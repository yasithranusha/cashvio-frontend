"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog";
import { Button } from "@workspace/ui/components/button";
import { CreditCard } from "lucide-react";
import { UpcomingPayment } from "@/types/upcoming-payments";
import { makePayment } from "@/actions/cashflow";

interface PaymentConfirmDialogProps {
  payment: UpcomingPayment;
  formatCurrency: (amount: number) => string;
  onPaymentComplete?: () => void;
}

export function PaymentConfirmDialog({
  payment,
  formatCurrency,
  onPaymentComplete,
}: PaymentConfirmDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const result = await makePayment(payment.id);

      if (result.success) {
        toast.success("Payment processed successfully!");
        onPaymentComplete?.();
      } else {
        toast.error(result.error || "Failed to process payment");
      }
    } catch (error) {
      toast.error("An error occurred while processing payment");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="default" className="ml-2">
          <CreditCard className="mr-2 h-4 w-4" />
          Pay Now
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Process Payment</AlertDialogTitle>
          <AlertDialogDescription>
            This will process a payment of{" "}
            {formatCurrency(parseFloat(payment.amount))} for{" "}
            {payment.description}. Due date:{" "}
            {new Date(payment.dueDate).toLocaleDateString()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handlePayment();
            }}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Confirm Payment"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
