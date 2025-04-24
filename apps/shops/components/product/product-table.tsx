"use client";
import { TProduct } from "@workspace/ui/types/product";
import { TCategory, TSubCategory, TSubSubCategory } from "@workspace/ui/types/categories";
import { DataTable } from "@workspace/ui/components/datatable/datatable";
import { columns } from "@/components/product/datatable/product-columns";
import { ProductStatus } from "@workspace/ui/types/common";
import { useCategoryStore } from "@/store/category";
import { useSupplierStore } from "@/store/suppliers";
import { useEffect } from "react";
import { TSupplier } from "@/types/supplier";

interface ProductTableProps {
  data: TProduct[];
  maincategoriesData: TCategory[];
  subcategoriesData: TSubCategory[];
  subsubcategoriesData: TSubSubCategory[];
  suppliers: TSupplier[];
}

export default function ProductTable({
  data,
  maincategoriesData,
  subcategoriesData,
  subsubcategoriesData,
  suppliers,
}: ProductTableProps) {
  // Get the setter functions from the category store
  const { setMainCategories, setSubCategories, setSubSubCategories } =
    useCategoryStore();
  
  // Get the setter function from the supplier store
  const { setSuppliers } = useSupplierStore();

  // Update the stores with the data received from props
  useEffect(() => {
    setMainCategories(maincategoriesData || []);
    setSubCategories(subcategoriesData || []);
    setSubSubCategories(subsubcategoriesData || []);
    setSuppliers(suppliers || []);
  }, [
    maincategoriesData,
    subcategoriesData,
    subsubcategoriesData,
    suppliers,
    setMainCategories,
    setSubCategories,
    setSubSubCategories,
    setSuppliers,
  ]);

  // Get suppliers from the store
  const { suppliers: storeSuppliers } = useSupplierStore();

  const filters = [
    {
      title: "Status",
      filterKey: "status",
      options: [
        {
          label: "Active",
          value: ProductStatus.ACTIVE,
        },
        {
          label: "Inactive",
          value: ProductStatus.HIDE,
        },
      ],
    },
    {
      title: "Main Category",
      filterKey: "category",
      options:
        maincategoriesData?.map((category) => ({
          label: category.name,
          value: category.name,
        })) || [],
    },
    {
      title: "Sub Category",
      filterKey: "subCategory",
      options:
        subcategoriesData?.map((category) => ({
          label: category.name,
          value: category.name,
        })) || [],
    },
    {
      title: "Sub Sub Category",
      filterKey: "subSubCategory",
      options:
        subsubcategoriesData?.map((category) => ({
          label: category.name,
          value: category.name,
        })) || [],
    },
    {
      title: "Supplier",
      filterKey: "supplier",
      options:
        storeSuppliers?.map((supplier) => ({
          label: supplier.name,
          value: supplier.name,
        })) || [],
    },
  ];

  return (
    <DataTable
      columns={columns}
      filters={filters}
      seperateFilters
      data={data || []}
      searchColumn={["name", "displayName", "description"]}
      searchPlaceholder="Search by name, display name, or description"
    />
  );
}