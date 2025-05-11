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
  RequiredStar,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Textarea } from "@workspace/ui/components/textarea";
import { useTransition, useState, useEffect } from "react";
import { TProduct, TProductStatus } from "@workspace/ui/types/product";
import { ProductSchema } from "@workspace/ui/schemas/products";
import { createProduct, updateProduct } from "@/actions/products";
import { MultiImageUploadInput } from "@workspace/ui/components/uploder/multi-img-upload-input";
import { uploadFiles } from "@/actions/upload";
import { uploadWithPreview } from "@workspace/ui/lib/upload-helper";
import { S3_PATH } from "@/lib/constants";
import { ActionResponse } from "@workspace/ui/types/common";
import { useCategoryStore } from "@/store/category";
import { useSupplierStore } from "@/store/suppliers";

interface ProductFormProps {
  initialData?: TProduct;
  onSuccess?: () => void;
  shopId?: string;
  uploadAction?: (
    file: File | File[],
    subFolder?: string
  ) => Promise<ActionResponse>;
  s3Path?: string;
}

export default function ProductForm({
  initialData,
  onSuccess,
  shopId,
  uploadAction = uploadFiles,
  s3Path = S3_PATH,
}: ProductFormProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const { mainCategories, subCategories, subSubCategories, fetchCategories } =
    useCategoryStore();

  const {
    suppliers,
    fetchSuppliers,
    isLoading: suppliersLoading,
  } = useSupplierStore();

  const [filteredSubCategories, setFilteredSubCategories] = useState<
    { id: string; name: string }[]
  >([]);
  const [filteredSubSubCategories, setFilteredSubSubCategories] = useState<
    { id: string; name: string }[]
  >([]);

  useEffect(() => {
    if (shopId) {
      fetchCategories(shopId);
      fetchSuppliers(shopId);
    }
  }, [shopId, fetchCategories, fetchSuppliers]);

  useEffect(() => {
    if (initialData?.categoryId) {
      handleCategoryChange(initialData.categoryId);
    }
    if (initialData?.subCategoryId) {
      handleSubCategoryChange(initialData.subCategoryId);
    }
  }, [initialData, subCategories, subSubCategories]);

  const defaultValues = {
    name: initialData?.name || "",
    description: initialData?.description || "",
    displayName: initialData?.displayName || "",
    keepingUnits: initialData?.keepingUnits || 0,
    imageUrls: initialData?.imageUrls || [],
    status: initialData?.status || ("ACTIVE" as TProductStatus),
    shopId: initialData?.shopId || shopId || "",
    supplierId: initialData?.supplierId || "",
    categoryId: initialData?.categoryId || "",
    subCategoryId: initialData?.subCategoryId || "",
    subSubCategoryId: initialData?.subSubCategoryId || "",
    warrantyMonths: initialData?.warrantyMonths || 0,
    loyaltyPoints: initialData?.loyaltyPoints || 0,
  };

  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    defaultValues,
    mode: "onBlur",
  });

  const handleFileChange = (files: File[]) => {
    setSelectedFiles(files);
  };

  const handleCategoryChange = (categoryId: string) => {
    const filtered = subCategories.filter(
      (subCat) => subCat.category?.id === categoryId
    );

    setFilteredSubCategories(filtered);
    setFilteredSubSubCategories([]);

    if (filtered.length === 0) {
      form.setValue("subCategoryId", "");
      form.setValue("subSubCategoryId", "");
    }
  };

  const handleSubCategoryChange = (subCategoryId: string) => {
    const filtered = subSubCategories.filter(
      (subSubCat) => subSubCat.subCategory?.id === subCategoryId
    );

    setFilteredSubSubCategories(filtered);

    if (filtered.length === 0) {
      form.setValue("subSubCategoryId", "");
    }
  };

  async function onSubmit(values: z.infer<typeof ProductSchema>) {
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
            // Handle image uploads if there are new files
            if (selectedFiles.length > 0) {
              const uploadPromises = selectedFiles.map((file) =>
                uploadWithPreview(file, "products", uploadAction, s3Path)
              );

              const uploadedUrls = await Promise.all(uploadPromises);
              const validUrls = uploadedUrls.filter(
                (url) => url !== null
              ) as string[];

              const existingUrls = initialData?.imageUrls || [];
              values.imageUrls = [...existingUrls, ...validUrls];
            }

            values.keepingUnits = Number(values.keepingUnits);

            const result = initialData?.id
              ? await updateProduct(initialData.id, values)
              : await createProduct(values);

            if (result.success) {
              resolve(result);
              onSuccess?.();
            } else {
              reject(new Error(result.error || "Failed to process product"));
            }
          } catch (error) {
            reject(
              error instanceof Error
                ? error
                : new Error("Failed to process product")
            );
          }
        });
      });

    toast.promise(promise, {
      loading: initialData ? "Updating product..." : "Creating product...",
      success: () =>
        initialData
          ? "Product updated successfully!"
          : "Product created successfully!",
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
              <FormLabel>
                Product Name <RequiredStar />
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Enter the product's internal name
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Display Name <RequiredStar />
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Enter the product's display name to shown on Bills
              </FormDescription>
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
                <Textarea {...field} value={field.value || ""} />
              </FormControl>
              <FormDescription>
                Provide details about the product
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="keepingUnits"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Stock Keeping Units <RequiredStar />
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  {...field}
                  value={field.value}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 0)
                  }
                />
              </FormControl>
              <FormDescription>
                Enter the current stock quantity
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="warrantyMonths"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Warranty (Months)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    {...field}
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormDescription>
                  Enter the warranty period in months
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="loyaltyPoints"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loyalty Points</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    {...field}
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormDescription>
                  Enter the loyalty points for this product
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="imageUrls"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Images</FormLabel>
              <FormControl>
                <MultiImageUploadInput
                  value={
                    field.value && field.value.length > 0
                      ? field.value.join(",")
                      : null
                  }
                  onChange={handleFileChange}
                  disabled={isPending}
                  maxFiles={5}
                  maxFileSize={5 * 1024 * 1024}
                  subFolder="products"
                />
              </FormControl>
              <FormDescription>
                Upload images for the product (max 5 files, 5MB each)
                {selectedFiles.length > 0 && (
                  <span className="block text-sm font-medium text-green-600">
                    Selected {selectedFiles.length} new file(s)
                  </span>
                )}
                {initialData?.imageUrls && initialData.imageUrls.length > 0 && (
                  <span className="block text-sm font-medium text-blue-600">
                    Product already has {initialData.imageUrls.length} image(s)
                  </span>
                )}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Status <RequiredStar />
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Set the product status</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="supplierId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supplier</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || ""}
                disabled={suppliersLoading || suppliers.length === 0}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        suppliersLoading
                          ? "Loading suppliers..."
                          : "Select a supplier"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                {suppliersLoading
                  ? "Loading suppliers..."
                  : suppliers.length === 0
                    ? "No suppliers available"
                    : "Select the product supplier"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  handleCategoryChange(value);
                }}
                defaultValue={field.value || ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {mainCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Select the product category</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subCategoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subcategory</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  handleSubCategoryChange(value);
                }}
                defaultValue={field.value || ""}
                disabled={filteredSubCategories.length === 0}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subcategory" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {filteredSubCategories.map((subcategory) => (
                    <SelectItem key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Select the product subcategory</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subSubCategoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sub-subcategory</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || ""}
                disabled={filteredSubSubCategories.length === 0}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a sub-subcategory" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {filteredSubSubCategories.map((subSubcategory) => (
                    <SelectItem
                      key={subSubcategory.id}
                      value={subSubcategory.id}
                    >
                      {subSubcategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the product sub-subcategory (if applicable)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <input type="hidden" {...form.register("shopId")} />

        <Button type="submit" disabled={isPending}>
          {initialData ? "Update Product" : "Add Product"}
        </Button>
      </form>
    </Form>
  );
}
