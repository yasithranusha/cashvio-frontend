"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@workspace/ui/components/datatable/datatable-header";
import { Badge } from "@workspace/ui/components/badge";
import { format, addMonths, isAfter } from "date-fns";
import { formatPrice } from "@workspace/ui/lib/utils";
import WarrantyActions from "./warrenty-actionts";

// Define warranty type and export it for use in other files
export type Warranty = {
  id: string;
  productName: string;
  purchaseDate: string;
  expiryDate: string;
  storeName: string;
  warrantyPeriod: number; // in months
  purchaseAmount: number;
  status: "Active" | "Expired" | "Claimed";
  orderReference: string;
};

export const columns: ColumnDef<Warranty>[] = [
  {
    accessorKey: "productName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
    cell: ({ row }) => {
      const productName = row.getValue("productName") as string;
      return <div className="text-left font-medium">{productName}</div>;
    },
  },
  {
    accessorKey: "storeName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Store" />
    ),
    cell: ({ row }) => {
      const storeName = row.getValue("storeName") as string;
      return <div className="text-left">{storeName}</div>;
    },
  },
  {
    accessorKey: "purchaseDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Purchase Date" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("purchaseDate") as string);
      return <div className="text-left">{format(date, "MMM d, yyyy")}</div>;
    },
    sortingFn: "datetime",
  },
  {
    accessorKey: "warrantyPeriod",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Duration" />
    ),
    cell: ({ row }) => {
      const warrantyPeriod = row.getValue("warrantyPeriod") as number;
      return (
        <div className="text-center">
          {warrantyPeriod} {warrantyPeriod === 1 ? "month" : "months"}
        </div>
      );
    },
  },
  {
    accessorKey: "expiryDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Expiry Date" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("expiryDate") as string);
      const today = new Date();
      const isNearExpiry = isAfter(date, today) && 
                          isAfter(addMonths(today, 1), date);
      
      return (
        <div className={`text-left ${isNearExpiry ? "text-amber-500 font-medium" : ""}`}>
          {format(date, "MMM d, yyyy")}
          {isNearExpiry && (
            <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
              Expiring soon
            </span>
          )}
        </div>
      );
    },
    sortingFn: "datetime",
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      
      // Determine badge variant based on status
      let variant: "default" | "destructive" | "default" = "default";
      if (status === "Active") variant = "default";
      else if (status === "Expired") variant = "destructive";
      
      return (
        <div className="flex">
          <Badge variant={variant}>
            {status}
          </Badge>
        </div>
      );
    },
    filterFn: "equals",
  },
  {
    accessorKey: "purchaseAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const amount = row.getValue("purchaseAmount") as number;
      return (
        <div className="text-right font-medium">
          {formatPrice(amount)}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const warranty = row.original;
      return (
        <div className="flex justify-center">
          <WarrantyActions warranty={warranty} />
        </div>
      );
    },
  },
];