import { PurchasesChart } from "@/components/users/area-chart";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ShieldCheck, LifeBuoy, Bell, ArrowRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Button } from "@workspace/ui/components/button";
import { formatPrice } from "@workspace/ui/lib/utils";
import Link from "next/link";

// Mock data for recent purchases
const recentPurchases = [
  {
    id: "INV2025001",
    date: "2025-05-01",
    storeName: "Electronics Hub",
    amount: 4800,
    status: "Picked",
  },
  {
    id: "INV2025002",
    date: "2025-04-23",
    storeName: "Fashion Store",
    amount: 2100,
    status: "Delivered",
  },
  {
    id: "INV2025003",
    date: "2025-04-15",
    storeName: "Home Essentials",
    amount: 3450,
    status: "In Transit",
  },
];

async function getWarrantyItemsCount() {
  // Replace with actual API call in production
  return 3;
}

async function getSupportRequestsCount() {
  return 12;
}

// Add a function to get unread support requests
async function getUnreadSupportRequestsCount() {
  // Replace with actual API call in production
  return 5;
}

export default async function Dashboard() {
  const [warrantyItemsCount, supportRequestsCount, unreadSupportRequestsCount] =
    await Promise.all([
      getWarrantyItemsCount(),
      getSupportRequestsCount(),
      getUnreadSupportRequestsCount(),
    ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <PurchasesChart />
        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Warranty Items
              </CardTitle>
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{warrantyItemsCount}</div>
              <p className="text-xs text-muted-foreground">
                Products with active warranty coverage
              </p>
            </CardContent>
          </Card>

          <Card
            className={unreadSupportRequestsCount > 0 ? "border-red-400" : ""}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                Support Requests
                {unreadSupportRequestsCount > 0 && (
                  <span className="inline-flex items-center justify-center rounded-full bg-red-500 px-2 py-1 text-xs font-medium text-white">
                    {unreadSupportRequestsCount} new
                  </span>
                )}
              </CardTitle>
              <div className="relative">
                <LifeBuoy className="h-4 w-4 text-muted-foreground" />
                {unreadSupportRequestsCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center">
                {supportRequestsCount}
                {unreadSupportRequestsCount > 0 && (
                  <span className="ml-2 text-sm font-normal text-red-500 flex items-center gap-1">
                    <Bell className="h-3 w-3" />
                    {unreadSupportRequestsCount} unread
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Open tickets requiring attention
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Recent Purchases</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Store</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPurchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell className="font-medium">{purchase.id}</TableCell>
                    <TableCell>
                      {new Date(purchase.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{purchase.storeName}</TableCell>
                    <TableCell>
                      <span 
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                          purchase.status === "Delivered" 
                            ? "bg-green-100 text-green-700" 
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {purchase.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(purchase.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="mt-4 flex justify-end">
              <Button asChild variant="outline" size="sm">
                <Link href="/orders">
                  View all orders
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}