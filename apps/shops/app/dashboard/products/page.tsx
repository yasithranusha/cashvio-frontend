import { getProducts } from "@/actions/products";
import { getSelectedShopId } from "@/lib/shop";
import { ProductDialog } from "@/components/product/dialog/product-dialog";
import { getCategories } from "@/actions/category";
import { Metadata } from "next";
import ProductTable from "@/components/product/product-table";
import { getSuppliers } from "@/actions/supplier";
import {
  TCategory,
  TSubCategory,
  TSubSubCategory,
} from "@workspace/ui/types/categories";

export const metadata: Metadata = {
  title: "Products | Cashvio",
  description:
    "cashvio is a modern and powerful poss system for your business to manage your sales and inventory.",
};

export default async function ProductsPage() {
  const selectedShopId = await getSelectedShopId();

  if (!selectedShopId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No shop selected. Please select a shop or contact support.</p>
      </div>
    );
  }

  const productsData = await getProducts(selectedShopId);
  const mainCategoriesData = await getCategories(selectedShopId);
  const subcategoriesData = await getCategories(selectedShopId, "sub");
  const subsubCategoriesData = await getCategories(selectedShopId, "subsub");
  const suppliers = await getSuppliers(selectedShopId);

  if (productsData.error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>{productsData.error}</p>
      </div>
    );
  }

  const mainCategories = (mainCategoriesData?.data?.data as TCategory[]) || [];
  const subCategories = (subcategoriesData?.data?.data as TSubCategory[]) || [];
  const subSubCategories =
    (subsubCategoriesData?.data?.data as TSubSubCategory[]) || [];

  return (
    <div className="container mx-auto py-10 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Products</h2>
        <ProductDialog shopId={selectedShopId} />
      </div>
      <ProductTable
        data={productsData?.data?.data || []}
        maincategoriesData={mainCategories}
        subcategoriesData={subCategories}
        subsubcategoriesData={subSubCategories}
        suppliers={suppliers?.data?.data || []}
      />
    </div>
  );
}
