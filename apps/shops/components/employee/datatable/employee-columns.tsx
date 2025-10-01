"use client";

import { ColumnDef } from "@tanstack/react-table";
import EmployeeActions from "./employee-actions";
import { DataTableColumnHeader } from "@workspace/ui/components/datatable/datatable-header";
import { TEmployee } from "@/types/employee";
import { formatPhoneNumber } from "react-phone-number-input";
import Link from "next/link";
import { Badge } from "@workspace/ui/components/ui/badge";
import { Role } from "@workspace/ui/enum/user.enum";

export const columns: ColumnDef<TEmployee>[] = [
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const firstName = row.getValue("firstName") as string;
      const lastName = row.original.lastName;
      const fullName = `${firstName} ${lastName}`;
      const isActive = row.original.isActive;

      return (
        <div className="text-left font-medium flex items-center gap-2">
          <span
            className={
              isActive
                ? "text-foreground"
                : "text-muted-foreground line-through"
            }
          >
            {fullName}
          </span>
          {!isActive && (
            <Badge variant="destructive" className="text-xs">
              Inactive
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      const email = row.getValue("email") as string;
      return (
        <div className="text-left">
          <Link
            href={`mailto:${email}`}
            className="text-primary hover:underline"
          >
            {email}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "contactNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact" />
    ),
    cell: ({ row }) => {
      const contact = row.getValue("contactNumber") as string;
      return (
        <div className="text-left">
          <Link
            href={`tel:${contact}`}
            className="text-primary hover:underline"
          >
            {formatPhoneNumber(contact)}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const role = row.getValue("role") as Role;
      const roleLabel = role === Role.SHOP_OWNER ? "Shop Owner" : "Shop Staff";
      const variant = role === Role.SHOP_OWNER ? "default" : "secondary";

      return (
        <div className="text-left">
          <Badge variant={variant}>{roleLabel}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "salary",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Salary" />
    ),
    cell: ({ row }) => {
      const salary = row.getValue("salary") as number | undefined;
      return (
        <div className="text-left">
          {salary ? (
            <span className="font-mono">${salary.toLocaleString()}</span>
          ) : (
            <span className="text-muted-foreground text-sm">N/A</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "dateOfJoining",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Joined" />
    ),
    cell: ({ row }) => {
      const dateOfJoining = row.getValue("dateOfJoining") as string;
      const date = new Date(dateOfJoining);
      return (
        <div className="text-left text-sm">{date.toLocaleDateString()}</div>
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
      const employee = row.original;
      return (
        <div className="flex justify-center">
          <EmployeeActions employee={employee} />
        </div>
      );
    },
  },
];
