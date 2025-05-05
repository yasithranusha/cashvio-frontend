"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@workspace/ui/components/datatable/datatable-header";
import { Badge } from "@workspace/ui/components/badge";
import { format } from "date-fns";
import OrderActions from "./order-actions";
import { formatPrice } from "@workspace/ui/lib/utils";

export type Order = {
  id: string;
  date: string;
  storeName: string;
  amount: number;
  status:
    | "Completed"
    | "Pending"
    | "Processing"
    | "Refunded"
    | "Partially Refunded";
  items?: number;
};

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order ID" />
    ),
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      return (
        <div className="text-left font-medium" title={id}>
          {id}
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Purchase Date" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("date") as string);
      return (
        <div className="text-left">
          {format(date, "MMM d, yyyy")}
        </div>
      );
    },
    sortingFn: "datetime",
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
    accessorKey: "items",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Items" />
    ),
    cell: ({ row }) => {
      const items = row.getValue("items") as number | undefined;
      return (
        <div className="text-center">
          {items || "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      
      // Determine badge variant based on status
      let variant = "default";
      if (status === "Completed") variant = "success";
      else if (status === "Pending") variant = "warning";
      else if (status === "Processing") variant = "default";
      else if (status === "Refunded") variant = "destructive";
      else if (status === "Partially Refunded") variant = "outline";
      
      return (
        <div className="flex">
          <Badge variant={variant as any}>
            {status}
          </Badge>
        </div>
      );
    },
    filterFn: "equals",
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
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
      const order = row.original;
      return (
        <div className="flex justify-center">
          <OrderActions order={order} />
        </div>
      );
    },
  },
];