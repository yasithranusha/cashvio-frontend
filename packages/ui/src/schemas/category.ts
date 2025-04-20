import { z } from "zod";
import { ProductStatus } from "../types/common.js";

export const CategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  status: z.nativeEnum(ProductStatus).default(ProductStatus.ACTIVE),
  shopId: z.string().min(1, "Shop ID is required"),
});

export const SubCategorySchema = CategorySchema.omit({ shopId: true }).extend({
  categoryId: z.string().min(1, "Parent category ID is required"),
});

export const SubSubCategorySchema = CategorySchema.omit({ shopId: true }).extend({
  subCategoryId: z.string().min(1, "Parent subcategory ID is required"),
});

export const UpdateCategorySchema = CategorySchema.omit({ shopId: true }).partial();
export const UpdateSubCategorySchema = SubCategorySchema.partial();
export const UpdateSubSubCategorySchema = SubSubCategorySchema.partial();