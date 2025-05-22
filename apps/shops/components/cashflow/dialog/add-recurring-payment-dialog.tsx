"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Dispatch, SetStateAction, useState } from "react";
import { AddPaymentForm } from "@/components/cashflow/forms/add-payment-form";

interface AddRecurringPaymentDialogProps {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  shopId: string;
}

export function AddRecurringPaymentDialog({
  open,
  onOpenChange,
  shopId,
}: AddRecurringPaymentDialogProps) {
  const [paymentAmount, setPaymentAmount] = useState("");



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Recurring Payment</DialogTitle>
          <DialogDescription>
            Schedule a new recurring payment or expense
          </DialogDescription>
        </DialogHeader>
        <AddPaymentForm
          newPaymentAmount={paymentAmount}
          setNewPaymentAmount={setPaymentAmount}
          shopId={shopId}
          onSuccess={() => {
            setPaymentAmount("");
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
