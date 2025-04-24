import { getStockItems } from "@/actions/stock";
import { getProductById } from "@/actions/products";
import { columns } from "@/components/stock/datatable/stock-column";
import { DataTable } from "@workspace/ui/components/datatable/datatable";
import { getSelectedShopId } from "@/lib/shop";
import { TProduct } from "@workspace/ui/types/product";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Product Stock | Cashvio",
  description:
    "Manage your product stock items with Cashvio's inventory management system.",
};

export default async function ProductStockPage({
  params,
}: {
  params: Promise<{ product: string }>;
}) {
  const { product: productId } = await params;
  const selectedShopId = await getSelectedShopId();

  if (!selectedShopId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No shop selected. Please select a shop or contact support.</p>
      </div>
    );
  }

  const productData = await getProductById(productId);
  const stockData = await getStockItems(productId);

  if (!productData.success || !productData.data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>{productData.error || "Failed to load product details"}</p>
      </div>
    );
  }

  const product = productData.data as TProduct;

  if (stockData.error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>{stockData.error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{product.displayName || product.name} Stock</h2>
          <p className="text-muted-foreground">
            Manage stock items for this product
          </p>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={stockData?.data?.data || []}
        searchColumn={["barcode"]}
        searchPlaceholder="Search by barcode"
      />
    </div>
  );
}