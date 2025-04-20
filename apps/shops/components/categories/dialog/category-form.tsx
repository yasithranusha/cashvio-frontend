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
import { useTransition, useState, useMemo } from "react";
import {
  TCategory,
  TSubCategory,
  TSubSubCategory,
} from "@workspace/ui/types/categories";
import { ProductStatus, ActionResponse } from "@workspace/ui/types/common";
import {
  CategorySchema,
  SubCategorySchema,
  SubSubCategorySchema,
} from "@workspace/ui/schemas/category";
import { createCategory, updateCategory } from "@/actions/category";
import { Textarea } from "@workspace/ui/components/textarea";
import { uploadWithPreview } from "@workspace/ui/lib/upload-helper";
import { MultiImageUploadInput } from "@workspace/ui/components/uploder/multi-img-upload-input";
import { uploadFiles } from "@/actions/upload";
import { S3_PATH } from "@/lib/constants";
import { CategoryType } from "@/components/categories/datatable/categories-columns";

type MainCategoryFormValues = z.infer<typeof CategorySchema>;
type SubCategoryFormValues = z.infer<typeof SubCategorySchema>;
type SubSubCategoryFormValues = z.infer<typeof SubSubCategorySchema>;

interface CategoryFormProps {
  initialData?: TCategory | TSubCategory | TSubSubCategory;
  onSuccess?: () => void;
  shopId?: string;
  uploadAction?: (
    file: File | File[],
    subFolder?: string
  ) => Promise<ActionResponse>;
  s3Path?: string;
  type?: CategoryType;
  mainCategories?: TCategory[];
  subCategories?: TCategory[];
}

export default function CategoryForm({
  initialData,
  onSuccess,
  shopId,
  uploadAction = uploadFiles,
  s3Path = S3_PATH,
  type = "main",
  mainCategories,
  subCategories,
}: CategoryFormProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const isSubCategoryForm = type === "sub";
  const isSubSubCategoryForm = type === "subsub";
  const isMainCategoryForm = type === "main";

  const defaultMainValues = useMemo(() => {
    if (isMainCategoryForm) {
      return {
        name: initialData?.name || "",
        description: initialData?.description || null,
        imageUrl: initialData?.imageUrl || null,
        status: initialData?.status || ProductStatus.ACTIVE,
        shopId:
          (initialData && "shopId" in initialData
            ? initialData.shopId
            : shopId) || "",
      } as MainCategoryFormValues;
    }
    return undefined;
  }, [initialData, shopId, isMainCategoryForm]);

  const defaultSubValues = useMemo(() => {
    if (isSubCategoryForm) {
      return {
        name: initialData?.name || "",
        description: initialData?.description || null,
        imageUrl: initialData?.imageUrl || null,
        status: initialData?.status || ProductStatus.ACTIVE,
        categoryId:
          (initialData && "categoryId" in initialData
            ? initialData.categoryId
            : "") || "",
      } as SubCategoryFormValues;
    }
    return undefined;
  }, [initialData, isSubCategoryForm]);

  const defaultSubSubValues = useMemo(() => {
    if (isSubSubCategoryForm) {
      return {
        name: initialData?.name || "",
        description: initialData?.description || null,
        imageUrl: initialData?.imageUrl || null,
        status: initialData?.status || ProductStatus.ACTIVE,
        subCategoryId:
          (initialData && "subCategoryId" in initialData
            ? initialData.subCategoryId
            : "") || "",
      } as SubSubCategoryFormValues;
    }
    return undefined;
  }, [initialData, isSubSubCategoryForm]);

  const mainForm = useForm<MainCategoryFormValues>({
    resolver: zodResolver(CategorySchema),
    defaultValues: defaultMainValues,
    mode: "onBlur",
  });

  const subForm = useForm<SubCategoryFormValues>({
    resolver: zodResolver(SubCategorySchema),
    defaultValues: defaultSubValues,
    mode: "onBlur",
  });

  const subSubForm = useForm<SubSubCategoryFormValues>({
    resolver: zodResolver(SubSubCategorySchema),
    defaultValues: defaultSubSubValues,
    mode: "onBlur",
  });

  const handleFileChange = (files: File[]) => {
    setSelectedFiles(files);
  };

  async function onMainSubmit(values: MainCategoryFormValues) {
    if (shopId) {
      values.shopId = shopId;
    } else if (!values.shopId || values.shopId === "") {
      toast.error("Shop ID is required. Please try again or contact support.");
      return;
    }

    handleSubmit(values, "main");
  }

  async function onSubSubmit(values: SubCategoryFormValues) {
    handleSubmit(values, "sub");
  }

  async function onSubSubSubmit(values: SubSubCategoryFormValues) {
    handleSubmit(values, "subsub");
  }

  async function handleSubmit(
    values:
      | MainCategoryFormValues
      | SubCategoryFormValues
      | SubSubCategoryFormValues,
    formType: CategoryType
  ) {
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
              ? await updateCategory(initialData.id, values, formType)
              : await createCategory(values, formType);

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

  if (isMainCategoryForm) {
    return (
      <Form {...mainForm}>
        <form
          onSubmit={mainForm.handleSubmit(onMainSubmit)}
          className="space-y-5"
        >
          <FormField
            control={mainForm.control}
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
            control={mainForm.control}
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
            control={mainForm.control}
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
            control={mainForm.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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

          <input type="hidden" {...mainForm.register("shopId")} />

          <Button type="submit" disabled={isPending}>
            {initialData ? "Update Category" : "Add Category"}
          </Button>
        </form>
      </Form>
    );
  } else if (isSubCategoryForm) {
    return (
      <Form {...subForm}>
        <form
          onSubmit={subForm.handleSubmit(onSubSubmit)}
          className="space-y-5"
        >
          {mainCategories && (
            <FormField
              control={subForm.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Main Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a main category" />
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
                  <FormDescription>Select the parent category</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={subForm.control}
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
            control={subForm.control}
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
            control={subForm.control}
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
            control={subForm.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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

          <Button type="submit" disabled={isPending}>
            {initialData ? "Update Category" : "Add Category"}
          </Button>
        </form>
      </Form>
    );
  } else {
    return (
      <Form {...subSubForm}>
        <form
          onSubmit={subSubForm.handleSubmit(onSubSubSubmit)}
          className="space-y-5"
        >
          {subCategories && (
            <FormField
              control={subSubForm.control}
              name="subCategoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a sub category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the parent subcategory
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={subSubForm.control}
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
            control={subSubForm.control}
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
            control={subSubForm.control}
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
            control={subSubForm.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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

          <Button type="submit" disabled={isPending}>
            {initialData ? "Update Category" : "Add Category"}
          </Button>
        </form>
      </Form>
    );
  }
}
