"use client";

import { toast } from "sonner";
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
import { updateUpcomingPayment } from "@/actions/cashflow";
import { updateUpcomingPaymentSchema } from "@/schemas/cashflow";
import { UpcomingPayment } from "@/types/upcoming-payments";

interface EditPaymentFormProps {
  payment: UpcomingPayment;
  onSuccess?: () => void;
  shopId?: string;
}

export function EditPaymentForm({
  payment,
  onSuccess,
  shopId,
}: EditPaymentFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof updateUpcomingPaymentSchema>>({
    resolver: zodResolver(updateUpcomingPaymentSchema),
    defaultValues: {
      id: payment.id,
      description: payment.description,
      amount: payment.amount,
      dueDate: new Date(payment.dueDate).toISOString().split("T")[0],
      isRecurring: payment.paymentType === "RECURRING",
    },
    mode: "onBlur",
  });

  const onSubmit = (values: z.infer<typeof updateUpcomingPaymentSchema>) => {
    const promise = () =>
      new Promise(async (resolve, reject) => {
        startTransition(async () => {
          try {
            const result = await updateUpcomingPayment({
              id: values.id,
              description: values.description,
              amount: values.amount,
              dueDate: values.dueDate,
              isRecurring: values.isRecurring,
            });

            if (result.success) {
              resolve(result);
              onSuccess?.();
            } else {
              reject(new Error(result.error || "Failed to update payment"));
            }
          } catch (error) {
            reject(
              error instanceof Error
                ? error
                : new Error("Failed to update payment")
            );
          }
        });
      });

    toast.promise(promise, {
      loading: "Updating payment...",
      success: "Payment updated successfully!",
      error: (err) => `${err.message}`,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  id="payment-description"
                  placeholder="Enter payment description"
                  {...field}
                />
              </FormControl>
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
                <Input
                  id="payment-amount"
                  type="number"
                  placeholder="0.00"
                  {...field}
                />
              </FormControl>
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
                <Input id="payment-date" type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isRecurring"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Switch
                  id="recurring"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel htmlFor="recurring">Recurring Payment</FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <input type="hidden" {...form.register("id")} />

        <div className="flex justify-end space-x-2 pt-2">
          <Button variant="outline" onClick={onSuccess} type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            Update Payment
          </Button>
        </div>
      </form>
    </Form>
  );
}
