"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Dispatch, SetStateAction } from "react";
import { AddTransactionForm } from "../forms/add-transaction-form";

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  shopId: string;
}

export function AddTransactionDialog({
  open,
  onOpenChange,
  shopId,
}: AddTransactionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
          <DialogDescription>
            Record a new income or expense transaction
          </DialogDescription>
        </DialogHeader>
        <AddTransactionForm
          onSuccess={() => onOpenChange(false)}
          shopId={shopId}
        />
      </DialogContent>
    </Dialog>
  );
}
