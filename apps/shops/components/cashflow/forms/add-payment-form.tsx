"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Switch } from "@workspace/ui/components/switch";

import { useTransition } from "react";
import { createUpcomingPayment } from "@/actions/cashflow";
import { createUpcomingPaymentSchema } from "@/schemas/cashflow";

interface AddPaymentFormProps {
  newPaymentAmount: string;
  setNewPaymentAmount: (value: string) => void;

  shopId: string;
  onSuccess?: () => void;
}

export function AddPaymentForm({
  newPaymentAmount,
  setNewPaymentAmount,
  shopId,
  onSuccess,
}: AddPaymentFormProps) {
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  // For large payment alerts
  const [showLargePaymentAlert, setShowLargePaymentAlert] = useState(false);

  const form = useForm<z.infer<typeof createUpcomingPaymentSchema>>({
    resolver: zodResolver(createUpcomingPaymentSchema),
    defaultValues: {
      description: "",
      amount: newPaymentAmount || "",
      dueDate: new Date().toISOString().split("T")[0], // Set default to today's date
      isRecurring: false,
      shopId: shopId || "",
    },
    mode: "onChange", // Validate on change for better UX
  });

  // Update the external state when the form amount changes
  const handleAmountChange = (value: string) => {
    setNewPaymentAmount(value);
    form.setValue("amount", value);
  };

  // Check if the payment amount is too large (over 70% of balance)
  const handleSubmitNewPayment = () => {
    const paymentAmount = parseFloat(form.getValues("amount"));
    // This is a simplified check - in production you'd compare to actual balance
    if (paymentAmount > 1000) {
      setShowLargePaymentAlert(true);
      // You might want to show an alert here but still allow submission
    }
  };

  const onSubmit = async (
    values: z.infer<typeof createUpcomingPaymentSchema>
  ) => {
    setFormError(null);

    if (!shopId) {
      setFormError("Shop ID is required. Please try again or contact support.");
      return;
    }

    // Run validation check for large payment amounts
    handleSubmitNewPayment();

    try {
      startTransition(async () => {
        try {
          // Ensure shopId is set correctly
          const dataToSubmit = {
            ...values,
            shopId: shopId,
          };

          const result = await createUpcomingPayment(dataToSubmit);

          if (result.success) {
            toast.success("Payment scheduled successfully!");
            form.reset({
              description: "",
              amount: "",
              dueDate: new Date().toISOString().split("T")[0],
              isRecurring: false,
              shopId: shopId,
            });
            setNewPaymentAmount("");
            onSuccess?.();
          } else {
            setFormError(result.error || "Failed to schedule payment");
            toast.error(result.error || "Failed to schedule payment");
          }
        } catch (error) {
          console.error("Payment submission error:", error);
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to schedule payment";
          setFormError(errorMessage);
          toast.error(errorMessage);
        }
      });
    } catch (error) {
      console.error("Form submission error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to schedule payment";
      setFormError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {formError && (
          <div className="text-sm text-red-500 mb-4">{formError}</div>
        )}

        {showLargePaymentAlert && (
          <div className="text-sm text-amber-600 mb-4 p-2 bg-amber-50 rounded-md">
            Warning: This payment amount is large and may impact your cash flow.
          </div>
        )}

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <div className="space-y-2">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  id="payment-description"
                  placeholder="Enter payment description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <div className="space-y-2">
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  id="payment-amount"
                  type="number"
                  placeholder="0.00"
                  value={field.value}
                  onChange={(e) => handleAmountChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <div className="space-y-2">
              <FormLabel>Due Date</FormLabel>
              <FormControl>
                <Input id="payment-date" type="date" {...field} />
              </FormControl>
              <FormMessage />
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="isRecurring"
          render={({ field }) => (
            <div className="flex items-center space-x-2 pt-2">
              <FormControl>
                <Switch
                  id="priority"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel htmlFor="priority">Recurring payment</FormLabel>
            </div>
          )}
        />

        <input type="hidden" {...form.register("shopId")} value={shopId} />

        <Button type="submit" className="w-full" disabled={isPending}>
          Schedule Payment
        </Button>
      </form>
    </Form>
  );
}
