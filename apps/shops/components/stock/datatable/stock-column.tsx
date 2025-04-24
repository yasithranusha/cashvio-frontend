"use client";

import { ColumnDef } from "@tanstack/react-table";
import StockActions from "@/components/stock/datatable/stock-actions";
import { DataTableColumnHeader } from "@workspace/ui/components/datatable/datatable-header";
import { TStockItem } from "@workspace/ui/types/stock";
import { formatPrice } from "@workspace/ui/lib/utils";
import { Badge } from "@workspace/ui/components/badge";

export const columns: ColumnDef<TStockItem>[] = [
  {
    accessorKey: "barcode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Barcode" />
    ),
    cell: ({ row }) => {
      const barcode = row.getValue("barcode");
      return <div className="text-left font-medium">{barcode as string}</div>;
    },
  },
  {
    accessorKey: "broughtPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Purchase Price" />
    ),
    cell: ({ row }) => {
      const price = row.getValue("broughtPrice") as number;
      return (
        <div className="text-left">
          {formatPrice(price)}
        </div>
      );
    },
  },
  {
    accessorKey: "sellPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Selling Price" />
    ),
    cell: ({ row }) => {
      const price = row.getValue("sellPrice") as number;
      return (
        <div className="text-left font-medium">
          {formatPrice(price)}
        </div>
      );
    },
  },
  {
    id: "profit",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Profit" />
    ),
    cell: ({ row }) => {
      const broughtPrice = row.getValue("broughtPrice") as number;
      const sellPrice = row.getValue("sellPrice") as number;
      const profit = sellPrice - broughtPrice;
      const profitPercentage = ((profit / broughtPrice) * 100).toFixed(2);
      
      return (
        <div className="text-left flex flex-col">
          <span>{formatPrice(profit)}</span>
          <Badge variant={profit > 0 ? "default" : "destructive"} className="w-fit mt-1">
            {profit > 0 ? "+" : ""}{profitPercentage}%
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
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const stockItem = row.original;
      return (
        <div className="flex justify-center">
          <StockActions stockItem={stockItem} />
        </div>
      );
    },
  },
];