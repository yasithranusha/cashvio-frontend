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
import { useState, Dispatch, SetStateAction, ReactNode } from "react";
import { UpcomingPayment } from "@/types/upcoming-payments";
import RecurringPaymentForm from "@/components/cashflow/forms/recurring-payment-form";

interface RecurringPaymentDialogProps {
  payment?: UpcomingPayment;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  open?: boolean;
  shopId: string;
  children?: ReactNode;
}

export function RecurringPaymentDialog({
  payment,
  setOpen,
  open,
  shopId,
  children,
}: RecurringPaymentDialogProps) {
  const [localOpen, setLocalOpen] = useState(false);

  const isOpen = open !== undefined ? open : localOpen;
  const handleOpenChange = setOpen || setLocalOpen;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {!setOpen && children ? (
        <DialogTrigger asChild>{children}</DialogTrigger>
      ) : (
        !setOpen && (
          <DialogTrigger asChild>
            <Button>{payment ? "Edit Payment" : "Add Upcoming Payment"}</Button>
          </DialogTrigger>
        )
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {payment
              ? `Update Payment ${payment.description}`
              : "Add Upcoming Payment"}
          </DialogTitle>
          <DialogDescription>
            {payment
              ? `Update ${payment.description} details`
              : "Schedule a new payment (recurring or one-time)"}
          </DialogDescription>
        </DialogHeader>
        {payment ? (
          <RecurringPaymentForm
            initialData={payment}
            onSuccess={() => handleOpenChange(false)}
            shopId={shopId}
          />
        ) : (
          <RecurringPaymentForm
            onSuccess={() => handleOpenChange(false)}
            shopId={shopId}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
