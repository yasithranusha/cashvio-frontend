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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { useTransition, useState } from "react";
import { TCategory } from "@workspace/ui/types/categories";
import { ProductStatus, ActionResponse } from "@workspace/ui/types/common";
import { CategorySchema } from "@workspace/ui/schemas/category";
import { createCategory, updateCategory } from "@/actions/category";
import { Textarea } from "@workspace/ui/components/textarea";
import { uploadWithPreview } from "@workspace/ui/lib/upload-helper";
import { MultiImageUploadInput } from "@workspace/ui/components/uploder/multi-img-upload-input";
import { uploadFiles } from "@/actions/upload";
import { S3_PATH } from "@/lib/constants";

interface CategoryFormProps {
  initialData?: TCategory;
  onSuccess?: () => void;
  shopId?: string;
  uploadAction?: (
    file: File | File[],
    subFolder?: string
  ) => Promise<ActionResponse>;
  s3Path?: string;
}

export default function CategoryForm({
  initialData,
  onSuccess,
  shopId,
  uploadAction = uploadFiles,
  s3Path = S3_PATH,
}: CategoryFormProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const defaultValues = {
    name: initialData?.name || "",
    description: initialData?.description || null,
    imageUrl: initialData?.imageUrl || null,
    status: initialData?.status || ProductStatus.ACTIVE,
    shopId: initialData?.shopId || shopId || "",
  };

  const form = useForm<z.infer<typeof CategorySchema>>({
    resolver: zodResolver(CategorySchema),
    defaultValues,
    mode: "onBlur",
  });

  const handleFileChange = (files: File[]) => {
    setSelectedFiles(files);
  };

  async function onSubmit(values: z.infer<typeof CategorySchema>) {
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
            if (selectedFiles.length > 0 && selectedFiles[0]) {
              const file = selectedFiles[0];
              const imageUrl = await uploadWithPreview(
                file,
                "categories",
                uploadAction,
                s3Path
              );

              if (imageUrl) {
                values.imageUrl = imageUrl;
              }
            }

            const result = initialData?.id
              ? await updateCategory(initialData.id, values)
              : await createCategory(values);

            if (result.success) {
              resolve(result);
              onSuccess?.();
            } else {
              reject(new Error(result.error || "Failed to process category"));
            }
          } catch (error) {
            reject(
              error instanceof Error
                ? error
                : new Error("Failed to process category")
            );
          }
        });
      });

    toast.promise(promise, {
      loading: initialData ? "Updating category..." : "Creating category...",
      success: () =>
        initialData
          ? "Category updated successfully!"
          : "Category created successfully!",
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
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="Electronics" {...field} />
              </FormControl>
              <FormDescription>Enter a name for the category</FormDescription>
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
                <Textarea
                  placeholder="Electronic devices and accessories"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                Provide a description for this category (optional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Image</FormLabel>
              <FormControl>
                <MultiImageUploadInput
                  value={field.value}
                  onChange={handleFileChange}
                  disabled={isPending}
                  maxFiles={1}
                  maxFileSize={2 * 1024 * 1024}
                  subFolder="categories"
                />
              </FormControl>
              <FormDescription>
                Select an image for the category (optional)
                {selectedFiles.length > 0 && selectedFiles[0] && (
                  <span className="block text-sm font-medium text-green-600">
                    File selected: {selectedFiles[0].name}
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
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(ProductStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Set the category status</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <input type="hidden" {...form.register("shopId")} />

        <Button type="submit" disabled={isPending}>
          {initialData ? "Update Category" : "Add Category"}
        </Button>
      </form>
    </Form>
  );
}
