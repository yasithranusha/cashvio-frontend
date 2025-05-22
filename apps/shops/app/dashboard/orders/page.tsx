import { getOrders } from "@/actions/order";
import { TOrder } from "@workspace/ui/types/order";
import { OrdersDataTable } from "@/components/orders/orders-datatable";
import { Button } from "@workspace/ui/components/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getSelectedShopId } from "@/lib/shop";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Order History | Cashvio",
  description: "View and manage all transactions processed through your shop",
};

export default async function OrdersPage() {
  // Use the selected shop ID or fallback to the hardcoded one
  const selectedShopId =
    (await getSelectedShopId()) || "e2de2c02-2d2a-4f69-a9f2-317557bff078";

  // Fetch orders directly in the server component
  const result = await getOrders(selectedShopId);

  // If shop ID is missing
  if (!selectedShopId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No shop selected. Please select a shop or contact support.</p>
      </div>
    );
  }

  // Handle error case
  if (!result.success) {
    return (
      <div className="container mx-auto py-6 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
            <p className="text-muted-foreground">
              View and manage all transactions processed through your shop
            </p>
          </div>
        </div>
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          <p>{result.error || "Failed to load orders"}</p>
          <Button variant="outline" asChild className="mt-2">
            <Link href="/dashboard/orders">Try Again</Link>
          </Button>
        </div>
      </div>
    );
  }

  const orders = result.data as TOrder[];

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
          <p className="text-muted-foreground">
            View and manage all transactions processed through your shop
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/orders/create">
            <Plus className="mr-2 h-4 w-4" />
            New Order
          </Link>
        </Button>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border rounded-lg border-dashed">
          <h3 className="font-medium">No Orders Found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Create your first order to get started.
          </p>
          <Button className="mt-4" asChild>
            <Link href="/dashboard/orders/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Order
            </Link>
          </Button>
        </div>
      ) : (
        <OrdersDataTable orders={orders} />
      )}
    </div>
  );
}
