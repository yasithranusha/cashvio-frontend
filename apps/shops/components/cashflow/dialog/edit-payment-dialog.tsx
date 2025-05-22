"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Dispatch, SetStateAction } from "react";
import { UpcomingPayment } from "@/types/upcoming-payments";
import RecurringPaymentForm from "@/components/cashflow/forms/recurring-payment-form";

interface EditPaymentDialogProps {
  payment: UpcomingPayment;
  onOpenChange: Dispatch<SetStateAction<null>>;
  shopId: string;
}

export function EditPaymentDialog({
  payment,
  onOpenChange,
  shopId,
}: EditPaymentDialogProps) {
  const isRecurring = payment.paymentType === "RECURRING";

  return (
    <Dialog open={!!payment} onOpenChange={() => onOpenChange(null)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Payment</DialogTitle>
          <DialogDescription>
            Update the details for {payment.description}
          </DialogDescription>
        </DialogHeader>

        <RecurringPaymentForm
          initialData={payment}
          onSuccess={() => onOpenChange(null)}
          shopId={shopId}
        />
      </DialogContent>
    </Dialog>
  );
}
