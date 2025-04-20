"use client";

import { ColumnDef } from "@tanstack/react-table";
import CategoriesActions from "./categories-action";
import { DataTableColumnHeader } from "@workspace/ui/components/datatable/datatable-header";
import { TCategory } from "@workspace/ui/types/categories";
import { Badge } from "@workspace/ui/components/badge";

export const columns: ColumnDef<TCategory>[] = [
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
            <span>{description}</span>
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
      <DataTableColumnHeader column={column} title="Status" className="flex items-center justify-center"/>
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
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const category = row.original;
      return (
        <div className="flex justify-center">
          <CategoriesActions category={category} />
        </div>
      );
    },
  },
];
