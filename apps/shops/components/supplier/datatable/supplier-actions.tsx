"use client";

import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog";
import { MoreHorizontal } from "lucide-react";
import { TSupplier } from "@/types/supplier";
import SupplierForm from "@/components/supplier/dialog/supplier-form";
import SupplierDeleteDialog from "@/components/supplier/dialog/supplier-delete";import {
  AlertDialog,
} from "@workspace/ui/components/alert-dialog";

export default function SupplierActions({ supplier }: { supplier: TSupplier }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(supplier.id)}
          >
            Copy supplier ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setIsUpdateOpen(true);
              setIsDropdownOpen(false);
            }}
          >
            Edit supplier
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setIsDeleteOpen(true);
              setIsDropdownOpen(false);
            }}
            className="text-destructive hover:text-destructive"
          >
            Delete supplier
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit dialog */}
      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Supplier {supplier.name}</DialogTitle>
            <DialogDescription>
              Update {supplier.name}'s details
            </DialogDescription>
          </DialogHeader>
          <SupplierForm
            initialData={supplier}
            onSuccess={() => setIsUpdateOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <SupplierDeleteDialog
          supplier={supplier}
          onSuccess={() => setIsDeleteOpen(false)}
        />
      </AlertDialog>
    </>
  );
}