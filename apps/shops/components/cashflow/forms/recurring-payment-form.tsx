"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { useTransition } from "react";
import { UpcomingPayment } from "@/types/upcoming-payments";
import {
  createUpcomingPayment,
  updateUpcomingPayment,
} from "@/actions/cashflow";
import { Switch } from "@workspace/ui/components/switch";

interface RecurringPaymentFormProps {
  initialData?: UpcomingPayment;
  onSuccess?: () => void;
  shopId: string; // Mark as required
}

// Define our form schema
const paymentFormSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.string().min(1, "Amount is required"),
  dueDate: z.string().min(1, "Due date is required"),
  isRecurring: z.boolean().default(true),
  shopId: z.string().min(1, "Shop ID is required"),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

export default function RecurringPaymentForm({
  initialData,
  onSuccess,
  shopId,
}: RecurringPaymentFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      description: initialData?.description || "Monthly Rental",
      amount: initialData?.amount || "20000",
      dueDate: initialData
        ? new Date(initialData.dueDate).toISOString().split("T")[0]
        : new Date("2025-06-01").toISOString().split("T")[0],
      isRecurring: true, // Always true for monthly recurrent
      shopId: shopId,
    },
    mode: "onChange",
  });

  async function onSubmit(values: PaymentFormValues) {
    try {
      startTransition(async () => {
        try {
          const result = initialData
            ? await updateUpcomingPayment({
                id: initialData.id,
                description: values.description,
                amount: values.amount,
                dueDate: values.dueDate,
                isRecurring: values.isRecurring,
              })
            : await createUpcomingPayment({
                description: values.description,
                amount: values.amount,
                dueDate: values.dueDate,
                isRecurring: values.isRecurring,
                shopId: values.shopId,
              });

          if (result.success) {
            toast.success(
              initialData
                ? "Payment updated successfully!"
                : values.isRecurring
                  ? "Recurring payment created successfully!"
                  : "One-time payment scheduled successfully!"
            );
            onSuccess?.();
          } else {
            toast.error(result.error || "Failed to process payment");
          }
        } catch (error) {
          console.error("Payment submission error:", error);
          toast.error(
            error instanceof Error ? error.message : "Failed to process payment"
          );
        }
      });
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to process payment"
      );
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Monthly Rent" {...field} />
              </FormControl>
              <FormDescription>
                Enter a description for this payment
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input placeholder="0.00" type="number" {...field} />
              </FormControl>
              <FormDescription>Enter the payment amount</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>Enter the payment due date</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isRecurring"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-2 space-y-0 rounded-md border p-4">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-0.5">
                <FormLabel>Monthly Recurring</FormLabel>
                <FormDescription>
                  Toggle on for a monthly recurring payment, off for one-time
                  payment
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <input type="hidden" {...form.register("shopId")} value={shopId} />

        <Button type="submit" disabled={isPending} className="w-full">
          {initialData ? "Update Payment" : "Schedule Payment"}
        </Button>
      </form>
    </Form>
  );
}
