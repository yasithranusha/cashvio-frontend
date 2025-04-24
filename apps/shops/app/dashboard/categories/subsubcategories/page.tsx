import { getCategories } from "@/actions/category";
import { getSelectedShopId } from "@/lib/shop";
import { CategoryDialog } from "@/components/categories/dialog/category-dialog";

import { Metadata } from "next";
import CategoryTable from "@/components/categories/category-table";
import { TCategory, TSubCategory } from "@workspace/ui/types/categories";
export const metadata: Metadata = {
  title: "L2 Sub Category | Cashvio",
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

  const categoriesData = await getCategories(selectedShopId, "subsub");
  const mainCategoriesData = await getCategories(selectedShopId);
  const subcategoriesData = await getCategories(selectedShopId, "sub");

  const mainCategories = (mainCategoriesData?.data?.data as TCategory[]) || [];
  const subCategories = (subcategoriesData?.data?.data as TSubCategory[]) || [];

  const categoryFilters = [
    {
      title: "Main Category",
      filterKey: "category",
      options:
        mainCategoriesData?.data?.data.map((category) => ({
          label: category.name,
          value: category.name,
        })) || [],
    },
    {
      title: "Sub Category",
      filterKey: "subCategory",
      options:
        subcategoriesData?.data?.data.map((category) => ({
          label: category.name,
          value: category.name,
        })) || [],
    },
  ];

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
        <h2 className="text-2xl font-bold">L2 Sub Categories</h2>
        <CategoryDialog
          shopId={selectedShopId}
          type="subsub"
          subCategories={subCategories}
          disableTrigger={subcategoriesData.data?.data.length === 0}
          title={
            subcategoriesData.data?.data.length === 0
              ? "Create Sub Category before creating a sub sub category"
              : "Create Sub Sub Category"
          }
        />
      </div>
      <CategoryTable
        data={mainCategories}
        categoryType="subsub"
        filters={categoryFilters}
        searchColumn={["name", "description"]}
        searchPlaceholder="Search by name or description"
      />
    </div>
  );
}
