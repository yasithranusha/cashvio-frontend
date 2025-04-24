import { getSelectedShopId } from "@/lib/shop";
import { Metadata } from "next";
import { getProducts } from "@/actions/products";
import AddStockForm from "@/components/stock/add-stock-form";
export const metadata: Metadata = {
  title: "Stock | Cashvio",
  description:
    "cashvio is a modern and powerful POS system for your business to manage your sales and inventory.",
};

export default async function CategoryPage() {
  const selectedShopId = await getSelectedShopId();

  if (!selectedShopId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No shop selected. Please select a shop or contact support.</p>
      </div>
    );
  }
  const productsData = await getProducts(selectedShopId);

  if (productsData.error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>{productsData.error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Add Stock</h2>
      </div>
      <AddStockForm products={productsData?.data?.data || []} />
    </div>
  );
}
