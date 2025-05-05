"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  BadgeDollarSign,
  BarChart3,
  CircleDollarSign,
  Package,
  PackagePlus,
  ShoppingBag,
  ShoppingCart,
  Users,
  Clock,
  ChevronRight,
  Plus,
  CheckCircle
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Progress } from "@workspace/ui/components/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@workspace/ui/components/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";

// Types
type Order = {
  id: string;
  customer: string;
  date: Date;
  status: "completed" | "refunded";
  amount: number;
  paymentMethod: string;
  items: number;
};

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stockLevel: number;
  stockThreshold: number;
  image?: string;
};

type SupportTicket = {
  id: string;
  subject: string;
  customerName: string;
  status: "open" | "in_progress" | "pending";
  priority: "low" | "medium" | "high";
  createdAt: Date;
};

// Mock recent orders data
const recentOrders: Order[] = [
  {
    id: "INV2025042",
    customer: "Nimal Perera",
    date: new Date(2025, 4, 5, 14, 35),
    status: "completed",
    amount: 235000,
    paymentMethod: "Credit Card",
    items: 2,
  },
  {
    id: "INV2025041",
    customer: "Chamari Silva",
    date: new Date(2025, 4, 5, 13, 10),
    status: "completed",
    amount: 8500,
    paymentMethod: "Cash",
    items: 1,
  },
  {
    id: "INV2025040",
    customer: "Amal Bandara",
    date: new Date(2025, 4, 5, 11, 45),
    status: "refunded",
    amount: 25000,
    paymentMethod: "Wallet",
    items: 3,
  },
  {
    id: "INV2025039",
    customer: "Kumari Fernando",
    date: new Date(2025, 4, 5, 10, 20),
    status: "completed",
    amount: 185000,
    paymentMethod: "Debit Card",
    items: 1,
  },
  {
    id: "INV2025038",
    customer: "Lakshman Perera",
    date: new Date(2025, 4, 5, 9, 15),
    status: "completed",
    amount: 6500,
    paymentMethod: "Cash",
    items: 2,
  },
];

// Mock low stock items
const lowStockItems: Product[] = [
  {
    id: "SKU001",
    name: "iPhone 15 Pro Max",
    category: "Smartphones",
    price: 325000,
    stockLevel: 2,
    stockThreshold: 5,
    image: "/iphone15.png",
  },
  {
    id: "SKU025",
    name: "Sony WH-1000XM5",
    category: "Audio",
    price: 85000,
    stockLevel: 1,
    stockThreshold: 3,
    image: "/sony-headphones.png",
  },
  {
    id: "SKU103",
    name: "Samsung 65\" QLED TV",
    category: "TVs",
    price: 425000,
    stockLevel: 0,
    stockThreshold: 2,
    image: "/samsung-tv.png",
  },
  {
    id: "SKU054",
    name: "Apple Watch Series 9",
    category: "Wearables",
    price: 145000,
    stockLevel: 3,
    stockThreshold: 5,
    image: "/apple-watch.png",
  },
];

// Mock pending support tickets
const pendingTickets: SupportTicket[] = [
  {
    id: "TKT2025010",
    subject: "Defective Samsung S30 Ultra",
    customerName: "Anura Perera",
    status: "pending",
    priority: "high",
    createdAt: new Date(2025, 4, 4, 16, 30),
  },
  {
    id: "TKT2025009",
    subject: "Inquiry about MacBook delivery",
    customerName: "Malini Jayawardena",
    status: "open",
    priority: "medium",
    createdAt: new Date(2025, 4, 5, 9, 15),
  },
  {
    id: "TKT2025008",
    subject: "Warranty claim for LG TV",
    customerName: "Dinesh Kumar",
    status: "in_progress",
    priority: "medium",
    createdAt: new Date(2025, 4, 3, 14, 20),
  },
];

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "completed":
      return <Badge className="bg-emerald-500">Completed</Badge>;
    case "refunded":
      return <Badge variant="secondary">Refunded</Badge>;
    case "open":
      return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Open</Badge>;
    case "in_progress":
      return <Badge className="bg-amber-500">In Progress</Badge>;
    case "pending":
      return <Badge variant="secondary">Pending</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

// Priority badge component
const PriorityBadge = ({ priority }: { priority: string }) => {
  switch (priority) {
    case "high":
      return <Badge variant="destructive" className="bg-red-50 text-red-600 border-red-200">High</Badge>;
    case "medium":
      return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Medium</Badge>;
    case "low":
      return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Low</Badge>;
    default:
      return <Badge variant="outline">{priority}</Badge>;
  }
};

// Stock level indicator component
const StockLevelIndicator = ({ level, threshold }: { level: number; threshold: number }) => {
  const percentage = Math.min((level / threshold) * 100, 100);
  
  let color = "bg-emerald-500";
  if (level === 0) {
    color = "bg-destructive";
  } else if (level <= threshold * 0.3) {
    color = "bg-red-500";
  } else if (level <= threshold * 0.7) {
    color = "bg-amber-500";
  }
  
  return (
    <div className="space-y-1 w-full">
      <Progress value={percentage} className={color} />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{level} in stock</span>
        <span>Min: {threshold}</span>
      </div>
    </div>
  );
};

export default function ShopDashboard() {
  // Calculate totals
  const todaySales = recentOrders
    .filter(order => order.status === "completed")
    .reduce((sum, order) => sum + order.amount, 0);
  
  const todayOrders = recentOrders.length;
  
  const totalLowStock = lowStockItems.length;
  const outOfStock = lowStockItems.filter(item => item.stockLevel === 0).length;
  
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your shop's performance today.
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Create New Order
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Order</DialogTitle>
              <DialogDescription>
                Would you like to create a new order or go to the POS system?
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <Link href="/dashboard/pos" className="w-full">
                <Button className="w-full h-24 flex flex-col items-center justify-center gap-2">
                  <ShoppingCart className="h-8 w-8" />
                  <span>Open POS</span>
                </Button>
              </Link>
              <Link href="/dashboard/orders/new" className="w-full">
                <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                  <ShoppingBag className="h-8 w-8" />
                  <span>Manual Order</span>
                </Button>
              </Link>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. {todaySales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +15% from yesterday
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayOrders}</div>
            <p className="text-xs text-muted-foreground">
              +3 orders from yesterday
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLowStock}</div>
            <p className="text-xs text-muted-foreground">
              {outOfStock} items completely out of stock
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/inventory" className="text-xs text-primary flex items-center">
              View inventory <ChevronRight className="h-3 w-3 ml-1" />
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Support</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTickets.length}</div>
            <p className="text-xs text-muted-foreground">
              {pendingTickets.filter(ticket => ticket.priority === "high").length} high priority tickets
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/support" className="text-xs text-primary flex items-center">
              View support <ChevronRight className="h-3 w-3 ml-1" />
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Today's latest transactions</CardDescription>
            </div>
            <Link href="/dashboard/orders">
              <Button variant="ghost" size="sm" className="gap-1">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-sm">
                    <th className="text-left font-medium py-2">Order ID</th>
                    <th className="text-left font-medium py-2">Customer</th>
                    <th className="text-left font-medium py-2">Time</th>
                    <th className="text-right font-medium py-2">Amount</th>
                    <th className="text-right font-medium py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-muted/50">
                      <td className="py-3">
                        <Link href={`/dashboard/orders/${order.id}`} className="font-medium hover:underline">
                          {order.id}
                        </Link>
                      </td>
                      <td className="py-3">{order.customer}</td>
                      <td className="py-3 text-muted-foreground text-sm">
                        {format(order.date, "h:mm a")}
                      </td>
                      <td className="py-3 text-right font-medium">
                        Rs. {order.amount.toLocaleString()}
                      </td>
                      <td className="py-3 text-right">
                        <StatusBadge status={order.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Low Stock and Support Tickets */}
        <Card>
          <Tabs defaultValue="low-stock">
            <CardHeader className="pb-0">
              <div className="flex justify-between items-center">
                <CardTitle>Alerts</CardTitle>
                <TabsList>
                  <TabsTrigger value="low-stock" className="text-xs">Low Stock</TabsTrigger>
                  <TabsTrigger value="support" className="text-xs">Support</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <TabsContent value="low-stock" className="space-y-0">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium">Items Requiring Attention</h4>
                  <Link href="/dashboard/inventory/order">
                    <Button size="sm" variant="outline" className="h-7">
                      <PackagePlus className="h-3.5 w-3.5 mr-1" />
                      Restock
                    </Button>
                  </Link>
                </div>

                <ScrollArea className="h-[370px]">
                  <div className="space-y-4">
                    {lowStockItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-2 rounded-lg border hover:bg-accent">
                        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                          {item.image ? (
                            <div></div>
                          ) : (
                            <Package className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium truncate">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">{item.category}</p>
                          <div className="mt-1">
                            <StockLevelIndicator level={item.stockLevel} threshold={item.stockThreshold} />
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">Rs. {item.price.toLocaleString()}</div>
                          <Button size="sm" variant="ghost" className="h-6 px-2 text-xs mt-1">
                            <Plus className="h-3 w-3 mr-1" />
                            Order
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="support" className="space-y-0">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium">Pending Support Tickets</h4>
                  <Link href="/dashboard/support">
                    <Button size="sm" variant="outline" className="h-7">
                      View All
                    </Button>
                  </Link>
                </div>

                <ScrollArea className="h-[370px]">
                  <div className="space-y-4">
                    {pendingTickets.map((ticket) => (
                      <div key={ticket.id} className="p-3 rounded-lg border hover:bg-accent">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <Link href={`/dashboard/support?ticket=${ticket.id}`}>
                              <h4 className="text-sm font-medium hover:text-primary hover:underline">
                                {ticket.subject}
                              </h4>
                            </Link>
                            <PriorityBadge priority={ticket.priority} />
                          </div>
                          <StatusBadge status={ticket.status} />
                        </div>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Avatar className="h-5 w-5 mr-1">
                              <AvatarFallback className="text-[10px]">
                                {ticket.customerName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            {ticket.customerName}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(ticket.createdAt, "MMM d, h:mm a")}
                          </div>
                        </div>
                        <div className="mt-2 flex justify-end gap-2">
                          <Button size="sm" variant="ghost" className="h-7 text-xs">
                            Assign
                          </Button>
                          <Button size="sm" className="h-7 text-xs">
                            Respond
                          </Button>
                        </div>
                      </div>
                    ))}

                    {pendingTickets.length === 0 && (
                      <div className="flex flex-col items-center justify-center p-8 text-center">
                        <CheckCircle className="h-12 w-12 mb-3 text-muted-foreground" />
                        <h3 className="text-lg font-medium">All caught up!</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          No pending support tickets at the moment.
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}