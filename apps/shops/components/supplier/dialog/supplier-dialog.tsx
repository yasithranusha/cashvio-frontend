"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { useState, Dispatch, SetStateAction } from "react";
import SupplierForm from "@/components/supplier/dialog/supplier-form";
import { TSupplier } from "@/types/supplier";

interface SupplierDialogProps {
  supplier?: TSupplier;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  shopId?: string;
}

export function SupplierDialog({ supplier, setOpen, shopId }: SupplierDialogProps) {
  const [localOpen, setLocalOpen] = useState(false);

  const open = setOpen ? undefined : localOpen;
  const handleOpenChange = setOpen || setLocalOpen;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!setOpen && (
        <DialogTrigger asChild>
          <Button>{supplier ? "Edit Supplier" : "Add Supplier"}</Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {supplier ? `Update Supplier ${supplier.name}` : "Add Supplier"}
          </DialogTitle>
          <DialogDescription>
            {supplier
              ? `Update ${supplier.name}'s details`
              : "Fill in the details to add a new supplier"}
          </DialogDescription>
        </DialogHeader>
        {supplier ? (
          <SupplierForm
            initialData={supplier}
            onSuccess={() => handleOpenChange(false)}
            shopId={shopId}
          />
        ) : (
          <SupplierForm 
            onSuccess={() => handleOpenChange(false)} 
            shopId={shopId}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}