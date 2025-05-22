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
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { useTransition } from "react";
import { format } from "date-fns";

// Note: This is a simplified transaction schema - you'll want to create a proper schema in your schemas directory
const TransactionSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.string().min(1, "Amount is required"),
  date: z.string().min(1, "Date is required"),
  transactionType: z.enum(["income", "expense"]),
  isRecurring: z.boolean().default(false),
  shopId: z.string().min(1, "Shop ID is required"),
});

interface AddTransactionFormProps {
  onSuccess?: () => void;
  shopId?: string;
}

export function AddTransactionForm({
  onSuccess,
  shopId,
}: AddTransactionFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof TransactionSchema>>({
    resolver: zodResolver(TransactionSchema),
    defaultValues: {
      description: "",
      amount: "",
      date: format(new Date(), "yyyy-MM-dd"),
      transactionType: "income",
      isRecurring: false,
      shopId: shopId || "",
    },
    mode: "onBlur",
  });

  function onSubmit(values: z.infer<typeof TransactionSchema>) {
    if (!shopId && !values.shopId) {
      toast.error("Shop ID is required. Please try again or contact support.");
      return;
    }

    // Here you would add the actual API call to create a transaction
    // For now we'll just simulate success
    const promise = () =>
      new Promise((resolve) => {
        startTransition(() => {
          // In a real app, this would call a server action to create the transaction
          setTimeout(() => {
            resolve({ success: true });
            onSuccess?.();
          }, 1000);
        });
      });

    toast.promise(promise, {
      loading: "Creating transaction...",
      success: "Transaction created successfully!",
      error: "Failed to create transaction",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="transactionType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transaction type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Enter description" {...field} />
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
                <Input type="number" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
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
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Recurring Transaction</FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <input type="hidden" {...form.register("shopId")} value={shopId} />

        <Button type="submit" disabled={isPending} className="w-full">
          Create Transaction
        </Button>
      </form>
    </Form>
  );
}
