"use client";

import { ColumnDef } from "@tanstack/react-table";
import EmployeeActions from "./employee-actions";
import { DataTableColumnHeader } from "@workspace/ui/components/datatable/datatable-header";
import { TEmployee } from "@/types/employee";
import { formatPhoneNumber } from "react-phone-number-input";
import Link from "next/link";
import { Badge } from "@workspace/ui/components/badge";
import { Role } from "@workspace/ui/enum/user.enum";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import { Eye, Mail, Phone } from "lucide-react";

// Simple phone number formatting function
const formatPhoneNumber = (phone: string) => {
  if (!phone) return phone;
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  // Format as (XXX) XXX-XXXX for US numbers
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  // For international numbers, just return as-is with spaces
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
};

export const columns: ColumnDef<TEmployee>[] = [
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Employee" />
    ),
    cell: ({ row }) => {
      const firstName = row.getValue("firstName") as string;
      const lastName = row.original.lastName;
      const fullName = `${firstName} ${lastName}`;
      const email = row.original.email;
      const isActive = row.original.isActive;

      // Get initials for avatar
      const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

      return (
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback className={isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}>
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className={`font-medium truncate ${isActive ? "text-foreground" : "text-muted-foreground line-through"}`}>
                {fullName}
              </span>
              {!isActive && (
                <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                  Inactive
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground truncate">
              {email}
            </div>
          </div>
        </div>
      );
    },
    size: 200,
  },
  {
    accessorKey: "contactNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact" />
    ),
    cell: ({ row }) => {
      const contact = row.getValue("contactNumber") as string;
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            asChild
          >
            <Link href={`tel:${contact}`}>
              <Phone className="h-3 w-3" />
            </Link>
          </Button>
          <span className="text-sm font-mono">
            {formatPhoneNumber(contact)}
          </span>
        </div>
      );
    },
    size: 150,
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const role = row.getValue("role") as Role;
      const roleLabel = role === Role.SHOP_OWNER ? "Owner" : "Staff";
      const variant = role === Role.SHOP_OWNER ? "default" : "secondary";

      return (
        <Badge variant={variant} className="font-medium">
          {roleLabel}
        </Badge>
      );
    },
    size: 100,
  },
  {
    accessorKey: "salary",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Salary" />
    ),
    cell: ({ row }) => {
      const salary = row.getValue("salary") as number | undefined;
      return (
        <div className="text-right font-mono text-sm">
          {salary ? (
            <span className="text-green-600 font-medium">
              ${salary.toLocaleString()}
            </span>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </div>
      );
    },
    size: 120,
  },
  {
    accessorKey: "dateOfJoining",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Joined" />
    ),
    cell: ({ row }) => {
      const dateOfJoining = row.getValue("dateOfJoining") as string;
      const date = new Date(dateOfJoining);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let displayText = date.toLocaleDateString();
      let textColor = "text-muted-foreground";

      if (diffDays < 30) {
        displayText = `${diffDays}d ago`;
        textColor = "text-green-600";
      } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        displayText = `${months}mo ago`;
        textColor = "text-blue-600";
      }

      return (
        <div className={`text-sm ${textColor}`}>
          {displayText}
        </div>
      );
    },
    size: 100,
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <Badge
          variant={isActive ? "default" : "destructive"}
          className="font-medium"
        >
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
    size: 100,
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const employee = row.original;
      return (
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            asChild
          >
            <Link href={`/dashboard/employees/${employee.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <EmployeeActions employee={employee} />
        </div>
      );
    },
    size: 120,
    enableSorting: false,
  },
];
