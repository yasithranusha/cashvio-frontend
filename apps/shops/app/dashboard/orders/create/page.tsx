import { getSelectedShopId } from "@/lib/shop";
import { Metadata } from "next";
import { getProducts, getCustomers } from "@/actions/order";
import CreateOrderForm from "@/components/orders/create-order-form";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Create Order | Cashvio",
  description:
    "cashvio is a modern and powerful POS system for your business to manage your sales and inventory.",
};

export default async function CreateOrderPage() {
  const selectedShopId = await getSelectedShopId();

  if (!selectedShopId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No shop selected. Please select a shop or contact support.</p>
      </div>
    );
  }
  const productsData = await getProducts(selectedShopId);
  const customersData = await getCustomers(selectedShopId);

  if (productsData.error || customersData.error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>{productsData.error || customersData.error}</p>
      </div>
    );
  }

  if (!productsData.data || productsData.data.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No products found</p>
        <Link href="/dashboard/products">Add products</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Create Order</h2>
      </div>
      <CreateOrderForm
        products={productsData.data}
        customers={customersData.data}
      />
    </div>
  );
}
