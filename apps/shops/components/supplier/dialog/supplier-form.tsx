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
import { Checkbox } from "@workspace/ui/components/checkbox";
import { useTransition } from "react";
import { TSupplier } from "@/types/supplier";
import { SupplierSchema } from "@/app/schemas/suppliers";
import { createSupplier, updateSupplier } from "@/actions/supplier";
import { PhoneInput } from "@workspace/ui/components/phone-input";

interface SupplierFormProps {
  initialData?: TSupplier;
  onSuccess?: () => void;
  shopId?: string;
}

export default function SupplierForm({
  initialData,
  onSuccess,
  shopId,
}: SupplierFormProps) {
  const [isPending, startTransition] = useTransition();

  const defaultValues = {
    name: initialData?.name || "",
    email: initialData?.email || null,
    contactNumber: initialData?.contactNumber || "",
    haveWhatsApp: initialData?.haveWhatsApp || false,
    shopId: initialData?.shopId || shopId || "",
  };

  const form = useForm<z.infer<typeof SupplierSchema>>({
    resolver: zodResolver(SupplierSchema),
    defaultValues,
    mode: "onBlur",
  });

  async function onSubmit(values: z.infer<typeof SupplierSchema>) {
    if (shopId) {
      values.shopId = shopId;
    } else if (!values.shopId || values.shopId === "") {
      toast.error("Shop ID is required. Please try again or contact support.");
      return;
    }

    const promise = () =>
      new Promise(async (resolve, reject) => {
        startTransition(async () => {
          try {
            const result = initialData?.id
              ? await updateSupplier(initialData.id, values)
              : await createSupplier(values);

            if (result.success) {
              resolve(result);
              onSuccess?.();
            } else {
              reject(new Error(result.error || "Failed to process supplier"));
            }
          } catch (error) {
            reject(
              error instanceof Error
                ? error
                : new Error("Failed to process supplier")
            );
          }
        });
      });

    toast.promise(promise, {
      loading: initialData ? "Updating supplier..." : "Creating supplier...",
      success: () =>
        initialData
          ? "Supplier updated successfully!"
          : "Supplier created successfully!",
      error: (err) => `${err.message}`,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supplier Name</FormLabel>
              <FormControl>
                <Input placeholder="ABC Electronics" {...field} />
              </FormControl>
              <FormDescription>
                Enter the supplier's business name
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contactNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Number</FormLabel>
              <FormControl>
                <PhoneInput
                  defaultCountry="LK"
                  placeholder="Enter phone number"
                  {...field}
                />
              </FormControl>
              <FormDescription>Enter supplier contact number</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="supplier@example.com"
                  type="email"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>Enter supplier email address</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="haveWhatsApp"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>WhatsApp Available</FormLabel>
                <FormDescription>
                  Check if this contact number can be reached via WhatsApp
                </FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <input type="hidden" {...form.register("shopId")} />

        <Button type="submit" disabled={isPending}>
          {initialData ? "Update Supplier" : "Add Supplier"}
        </Button>
      </form>
    </Form>
  );
}
