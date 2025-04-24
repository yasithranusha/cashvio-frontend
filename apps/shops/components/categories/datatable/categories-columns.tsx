"use client";

import { ColumnDef } from "@tanstack/react-table";
import CategoriesActions from "./categories-action";
import { DataTableColumnHeader } from "@workspace/ui/components/datatable/datatable-header";
import {
  TCategory,
  TSubCategory,
  TSubSubCategory,
  TCategoryUnion,
} from "@workspace/ui/types/categories";
import { Badge } from "@workspace/ui/components/badge";

export type CategoryType = "main" | "sub" | "subsub";

const createBaseColumns = <T extends TCategoryUnion>(): ColumnDef<T>[] =>
  [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        const name = row.getValue("name");
        return <div className="text-left font-medium">{name as string}</div>;
      },
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
      cell: ({ row }) => {
        const description = row.getValue("description") as string | undefined;

        return (
          <div className="text-left">
            {description ? (
              <span className="block truncate max-w-xs" title={description}>
                {description.length > 150
                  ? `${description.substring(0, 50)}...`
                  : description}
              </span>
            ) : (
              <span
                className="text-muted-foreground text-sm"
                title="Not Available"
              >
                N/A
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Status"
          className="flex items-center justify-center"
        />
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <div className="flex justify-center">
            <Badge
              variant={status === "ACTIVE" ? "default" : "secondary"}
              className="capitalize"
            >
              {status.toLowerCase()}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last Update" />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("updatedAt"));
        return (
          <div className="text-left text-sm text-muted-foreground">
            {date.toLocaleDateString()}
          </div>
        );
      },
    },
  ] as ColumnDef<T>[];

const createActionColumn = <T extends TCategoryUnion>(
  type: CategoryType
): ColumnDef<T> =>
  ({
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const category = row.original;
      return (
        <div className="flex justify-center">
          <CategoriesActions category={category as any} categoryType={type} />
        </div>
      );
    },
  }) as ColumnDef<T>;

const categoryColumn = (): ColumnDef<TSubCategory | TSubSubCategory> => ({
  id: "category",
  accessorFn: (row) => {
    if ("category" in row && row.category) {
      return row.category.name;
    } else if ("subCategory" in row && row.subCategory?.category) {
      return row.subCategory.category.name;
    }
    return "";
  },
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Category" />
  ),
  cell: ({ row }) => {
    const categoryName = row.getValue("category") as string;
    return <div className="text-left font-medium">{categoryName || "N/A"}</div>;
  },
  filterFn: "equals"
});

const subCategoryColumn = (): ColumnDef<TSubSubCategory> => ({
  id: "subCategory",
  accessorFn: (row) => {
    if ("subCategory" in row && row.subCategory) {
      return row.subCategory.name;
    }
    return "";
  },
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Sub Category" />
  ),
  cell: ({ row }) => {
    const subCategoryName = row.getValue("subCategory") as string;
    return <div className="text-left font-medium">{subCategoryName || "N/A"}</div>;
  },
  filterFn: "equals"
});

export const columns = (type: CategoryType): ColumnDef<TCategoryUnion>[] => {
  const columnsArray = createBaseColumns<TCategoryUnion>();
  
  const insertIndex = 3;  
  
  if (type === "sub") {
    columnsArray.splice(insertIndex, 0, categoryColumn() as ColumnDef<TCategoryUnion>);
  } else if (type === "subsub") {
    columnsArray.splice(
      insertIndex, 
      0, 
      categoryColumn() as ColumnDef<TCategoryUnion>,
      subCategoryColumn() as ColumnDef<TCategoryUnion>
    );
  }
  
  if (type === "main") {
    columnsArray.push(createActionColumn<TCategory>(type) as ColumnDef<TCategoryUnion>);
  } else if (type === "sub") {
    columnsArray.push(createActionColumn<TSubCategory>(type) as ColumnDef<TCategoryUnion>);
  } else if (type === "subsub") {
    columnsArray.push(createActionColumn<TSubSubCategory>(type) as ColumnDef<TCategoryUnion>);
  }
  
  return columnsArray;
};