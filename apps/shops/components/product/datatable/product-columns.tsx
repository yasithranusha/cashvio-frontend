"use client";

import { ColumnDef } from "@tanstack/react-table";
import ProductActions from "./product-action";
import { DataTableColumnHeader } from "@workspace/ui/components/datatable/datatable-header";
import { TProduct } from "@workspace/ui/types/product";
import Image from "next/image";
import { Badge } from "@workspace/ui/components/badge";
import Link from "next/link";

export const columns: ColumnDef<TProduct>[] = [
  {
    accessorKey: "imageUrls",
    header: () => <div className="text-center">Image</div>,
    cell: ({ row }) => {
      const imageUrls = row.getValue("imageUrls") as string[];
      const firstImage =
        imageUrls && imageUrls.length > 0 ? imageUrls[0] : null;

      return (
        <div className="flex justify-center">
          {firstImage ? (
            <div className="h-12 w-12 rounded-md overflow-hidden">
              <Image
                src={firstImage}
                alt={row.getValue("name") as string}
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">
              <span className="text-xs text-muted-foreground">No image</span>
            </div>
          )}
        </div>
      );
    },
  },
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
    accessorKey: "displayName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Display Name" />
    ),
    cell: ({ row }) => {
      const displayName = row.getValue("displayName") as string;
      return <div className="text-left">{displayName}</div>;
    },
  },
  {
    accessorKey: "keepingUnits",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock Keeping Units" />
    ),
    cell: ({ row }) => {
      const keepingUnits = row.getValue("keepingUnits") as number;
      return <div className="text-center">{keepingUnits}</div>;
    },
  },
  {
    accessorKey: "stock",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock Remain" />
    ),
    cell: ({ row }) => {
      const stock = (row.getValue("stock") as number) || 0;
      const keepingUnits = row.getValue("keepingUnits") as number;
      const isLowStock =
        typeof stock === "number" &&
        typeof keepingUnits === "number" &&
        stock < keepingUnits;
      return (
        <div className="text-center">
          <Link href={`/dashboard/stock/${row.original.id}`} title="View Stock">
            <span className={isLowStock ? "text-red-600 font-bold" : undefined}>
              {stock}
            </span>
            {isLowStock && (
              <span className="ml-2 px-2 py-0.5 rounded bg-red-100 text-red-700 text-xs font-semibold">
                Low
              </span>
            )}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "supplier",
    accessorFn: (row) => {
      return row.supplier?.name || "N/A";
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supplier" />
    ),
    cell: ({ row }) => {
      const supplier = row.original.supplier;
      return (
        <div className="text-left">
          {supplier ? (
            <span>{supplier.name}</span>
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
    filterFn: "equals",
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div className="flex justify-center">
          <Badge variant={status === "ACTIVE" ? "default" : "secondary"}>
            {status}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "warrantyMonths",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Warranty" />
    ),
    cell: ({ row }) => {
      const warrantyMonths = row.getValue("warrantyMonths") as number;
      return (
        <div className="text-center">
          {warrantyMonths ? `${warrantyMonths} months` : "N/A"}
        </div>
      );
    },
  },
  {
    id: "loyaltyPoints",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Loyalty Points" />
    ),
    cell: ({ row }) => {
      const loyaltyPoints = row.getValue("loyaltyPoints") as number;
      return (
        <div className="text-center">
          {loyaltyPoints ? `${loyaltyPoints}` : `N/A`}
        </div>
      );
    },
  },
  {
    id: "category",
    accessorFn: (row) => {
      return row.category?.name || "N/A";
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const categoryName = row.getValue("category") as string;
      return (
        <div className="text-left font-medium">{categoryName || "N/A"}</div>
      );
    },
    filterFn: "equals",
  },
  {
    id: "subCategory",
    accessorFn: (row) => {
      return row.subCategory?.name || "N/A";
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sub Category" />
    ),
    cell: ({ row }) => {
      const subCategoryName = row.getValue("subCategory") as string;
      return (
        <div className="text-left font-medium">{subCategoryName || "N/A"}</div>
      );
    },
    filterFn: "equals",
  },
  {
    id: "subSubCategory",
    accessorFn: (row) => {
      return row.subSubCategory?.name || "N/A";
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sub Sub Category" />
    ),
    cell: ({ row }) => {
      const subSubCategoryName = row.getValue("subSubCategory") as string;
      return (
        <div className="text-left font-medium">
          {subSubCategoryName || "N/A"}
        </div>
      );
    },
    filterFn: "equals",
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
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex justify-center">
          <ProductActions product={product} />
        </div>
      );
    },
  },
];
