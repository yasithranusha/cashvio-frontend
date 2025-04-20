"use client";

import { DataTable } from "@workspace/ui/components/datatable/datatable";
import { columns, CategoryType } from "./datatable/categories-columns";
import { TCategory } from "@workspace/ui/types/categories";
import { ProductStatus } from "@workspace/ui/types/common";

interface CategoryTableProps<TData = TCategory> {
  data: TData[];
  categoryType?: CategoryType;
  searchColumn?: string | string[];
  searchPlaceholder?: string;
  filters?: Array<{
    title: string;
    filterKey: string;
    options: Array<{
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }>;
  }>;
}

export default function CategoryTable({
  data,
  categoryType = "main",
  searchColumn = ["name", "description"],
  searchPlaceholder = "Search by name or description",
  filters = [],
}: CategoryTableProps) {
  const defaultFilters = [
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
  ];

  const combinedFilters = [...defaultFilters, ...filters];

  return (
    <DataTable
      columns={columns(categoryType)}
      data={data}
      filters={combinedFilters}
      searchColumn={searchColumn}
      searchPlaceholder={searchPlaceholder}
    />
  );
}
