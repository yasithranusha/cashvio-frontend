"use client";

import { useState, useTransition, useEffect } from "react";
import { toast } from "sonner";
import { useForm, useFieldArray } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { TProduct } from "@workspace/ui/types/product";
import { TStockItem } from "@workspace/ui/types/stock";
import { createStockItem, updateStockItem } from "@/actions/stock";
import { Trash2, Plus } from "lucide-react";

// Create a schema for the batch form
const BatchStockFormSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  broughtPrice: z.number().positive("Purchase price must be positive"),
  sellPrice: z.number().positive("Sell price must be positive"),
  items: z.array(
    z.object({
      barcode: z.string().min(1, "Barcode is required"),
    })
  ).min(1, "Add at least one item").max(20, "Maximum 20 items allowed"),
});

type BatchStockFormValues = z.infer<typeof BatchStockFormSchema>;

interface AddStockFormProps {
  products: TProduct[];
  initialData?: TStockItem;
  onSuccess?: () => void;
}

export default function AddStockForm({
  products,
  initialData,
  onSuccess,
}: AddStockFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isEditMode, setIsEditMode] = useState(!!initialData);
  const MAX_ITEMS = 20;

  // Initial form values
  const defaultValues: BatchStockFormValues = {
    productId: initialData?.productId || "",
    broughtPrice: initialData?.broughtPrice || 0,
    sellPrice: initialData?.sellPrice || 0,
    items: initialData ? [
      {
        barcode: initialData.barcode || "",
      }
    ] : [
      { barcode: "" }
    ]
  };

  const form = useForm<BatchStockFormValues>({
    resolver: zodResolver(BatchStockFormSchema),
    defaultValues,
    mode: "onBlur",
  });

  // Set up field array for dynamic fields
  const { fields, append, remove } = useFieldArray({
    name: "items",
    control: form.control,
  });

  // Function to add a new empty item when the current one gets data
  const checkAndAddNewItem = (index: number) => {
    const items = form.getValues("items");
    const currentItem = items[index];
    
    // If this is the last item and barcode has value and we haven't hit the limit
    if (
      index === items.length - 1 && 
      currentItem && 
      currentItem.barcode && 
      items.length < MAX_ITEMS
    ) {
      // Add a new empty barcode field
      append({ barcode: "" });
    }
  };

  // Handle single item editing mode
  useEffect(() => {
    if (initialData) {
      setIsEditMode(true);
    }
  }, [initialData]);

  async function onSubmit(values: BatchStockFormValues) {
    // Filter out items with empty barcodes - using type assertion for non-null values
    const validBarcodes = values.items
      .filter((item): item is { barcode: string } => 
        !!item.barcode && item.barcode.trim() !== ''
      );
    
    if (validBarcodes.length === 0) {
      toast.error("Please add at least one barcode");
      return;
    }

    const promise = () =>
      new Promise(async (resolve, reject) => {
        startTransition(async () => {
          try {
            if (isEditMode && initialData) {
              // With the type guard in filter, this is now safe
              const firstBarcode = validBarcodes[0]?.barcode || "";
              
              // Update existing item
              const result = await updateStockItem(initialData.id, {
                barcode: firstBarcode, 
                broughtPrice: values.broughtPrice,
                sellPrice: values.sellPrice,
                productId: values.productId
              });
              
              if (result.success) {
                resolve(result);
                onSuccess?.();
              } else {
                reject(new Error(result.error || "Failed to update stock item"));
              }
            } else {
              // Batch create items
              const results = [];
              let hasErrors = false;
              
              // Process only valid items
              for (const item of validBarcodes) {
                const itemData = {
                  ...item,
                  broughtPrice: values.broughtPrice,
                  sellPrice: values.sellPrice,
                  productId: values.productId
                };
                
                const result = await createStockItem(itemData);
                results.push(result);
                
                if (!result.success) {
                  hasErrors = true;
                }
              }
              
              if (hasErrors) {
                reject(new Error("Some items failed to process"));
              } else {
                resolve(results);
                
                // Reset form but keep the product selected and prices
                form.reset({
                  productId: values.productId,
                  broughtPrice: values.broughtPrice,
                  sellPrice: values.sellPrice,
                  items: [{ barcode: "" }]
                });
                onSuccess?.();
              }
            }
          } catch (error) {
            reject(
              error instanceof Error
                ? error
                : new Error("Failed to process stock items")
            );
          }
        });
      });

    toast.promise(promise, {
      loading: isEditMode ? "Updating stock item..." : "Adding stock items...",
      success: () =>
        isEditMode
          ? "Stock item updated successfully!"
          : "Stock items added successfully!",
      error: (err) => `${err.message}`,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="productId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || ""}
                disabled={products.length === 0 || isPending}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        products.length === 0
                          ? "No products available"
                          : "Select a product"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.displayName || product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                {products.length === 0
                  ? "No products available. Please create a product first."
                  : "Select the product these stock items belong to"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="broughtPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purchase Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>
                  Price at which you purchased this product
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sellPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Selling Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>
                  Price at which you will sell this product
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Barcodes</h3>
            <p className="text-sm text-muted-foreground">
              {fields.length} of {MAX_ITEMS} items
            </p>
          </div>
          
          {fields.map((field, index) => (
            <div 
              key={field.id} 
              className="grid grid-cols-1 sm:grid-cols-6 gap-4 items-end border-b pb-4"
            >
              <div className="sm:col-span-5">
                <FormField
                  control={form.control}
                  name={`items.${index}.barcode`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Barcode {index + 1}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. 8901234567890" 
                          {...field} 
                          onBlur={() => {
                            field.onBlur();
                            checkAndAddNewItem(index);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="sm:col-span-1">
                {/* Delete button that only shows if there's more than one field or if the current field has data */}
                {(fields.length > 1 || form.getValues(`items.${index}.barcode`)) && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      // Don't allow deleting the last field if in edit mode
                      if (isEditMode && fields.length === 1) {
                        return;
                      }
                      // Don't allow deleting the last empty field
                      if (fields.length === 1 && !form.getValues(`items.${index}.barcode`)) {
                        return;
                      }
                      remove(index);
                    }}
                    className="h-10 w-10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                
                {/* Show add button only on the last row if we haven't hit the limit */}
                {index === fields.length - 1 && fields.length < MAX_ITEMS && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => append({ barcode: "" })}
                    className="ml-2 h-10 w-10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 flex gap-3 justify-between">
          <div>
            {isEditMode && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditMode(false);
                  form.reset({
                    productId: form.getValues("productId"),
                    broughtPrice: form.getValues("broughtPrice"),
                    sellPrice: form.getValues("sellPrice"),
                    items: [{ barcode: "" }]
                  });
                }}
                disabled={isPending}
              >
                Cancel Edit
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => {
                form.reset(defaultValues);
              }}
              disabled={isPending}
            >
              Reset
            </Button>
            <Button type="submit" disabled={isPending || !form.getValues("productId")}>
              {isEditMode ? "Update Stock Item" : "Submit All Items"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}