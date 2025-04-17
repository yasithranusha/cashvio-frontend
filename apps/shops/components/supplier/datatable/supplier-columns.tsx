"use client";

import { ColumnDef } from "@tanstack/react-table";
import SupplierActions from "./supplier-actions";
import { DataTableColumnHeader } from "@workspace/ui/components/datatable/datatable-header";
import {TSupplier} from "@/types/supplier";

export const columns: ColumnDef<TSupplier>[] = [
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
    accessorKey: "contactNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact" />
    ),
    cell: ({ row }) => {
      const contact = row.getValue("contactNumber");
      return <div className="text-left">{contact as string}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
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
      const supplier = row.original;
      return (
        <div className="flex justify-center">
          <SupplierActions supplier={supplier} />
        </div>
      );
    },
  },
];
