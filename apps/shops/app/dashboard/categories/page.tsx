import { getCategories } from "@/actions/category";
import { getSelectedShopId } from "@/lib/shop";
import { CategoryDialog } from "@/components/categories/dialog/category-dialog";

import { Metadata } from "next";
import CategoryTable from "@/components/categories/category-table";
import { TCategory } from "@workspace/ui/types/categories";
export const metadata: Metadata = {
  title: "Categories | Cashvio",
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

  const categoriesData = await getCategories(selectedShopId);
  const mainCategories = (categoriesData?.data?.data as TCategory[]) || [];

  if (categoriesData.error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>{categoriesData.error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Categories</h2>
        <CategoryDialog shopId={selectedShopId} type="main" />
      </div>
      <CategoryTable
        data={mainCategories}
        categoryType="main"
        searchColumn={["name", "description"]}
        searchPlaceholder="Search by name or description"
      />
    </div>
  );
}
