"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@workspace/ui/components/datatable/datatable-header";
import { Badge } from "@workspace/ui/components/badge";
import { format } from "date-fns";
import UserActions from "./user-actions";
import { TUser } from "@workspace/ui/types/user"; // Import the shared type definition

// Define a local type that represents just the fields we need for the table
type TableUser = Pick<TUser, "id" | "name" | "email" | "contactNumber" | "status" | "createdAt">;

export const columns: ColumnDef<TableUser>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      // Show only first 8 characters of the ID for brevity
      const shortId = id.substring(0, 8) + "...";
      return (
        <div className="text-left font-mono text-xs" title={id}>
          {shortId}
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
      const name = row.getValue("name") as string;
      return <div className="text-left font-medium">{name}</div>;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      const email = row.getValue("email") as string;
      return <div className="text-left">{email}</div>;
    },
  },
  {
    accessorKey: "contactNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact" />
    ),
    cell: ({ row }) => {
      const contactNumber = row.getValue("contactNumber") as string | null;
      return (
        <div className="text-left">
          {contactNumber || (
            <span className="text-muted-foreground text-sm">Not provided</span>
          )}
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
      return (
        <div className="flex">
          <Badge variant={status === "ACTIVE" ? "default" : "destructive"}>
            {status === "ACTIVE" ? "Active" : "Inactive"}
          </Badge>
        </div>
      );
    },
    filterFn: "equals",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt") as string);
      return (
        <div className="text-left text-sm text-muted-foreground">
          {format(date, "MMM d, yyyy")}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const user = row.original as TUser; // Cast to the full TUser type
      return (
        <div className="flex justify-center">
          <UserActions user={user} />
        </div>
      );
    },
  },
];