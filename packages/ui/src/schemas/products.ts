import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  displayName: z.string().min(1, "Display name is required"),
  keepingUnits: z.number().int().min(0, "Keeping units must be zero or positive"),
  imageUrls: z.array(z.string().url("Invalid image URL")).default([]),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
  shopId: z.string().uuid("Invalid shop ID"),
  supplierId: z.string().uuid("Invalid supplier ID"),
  categoryId: z.string().uuid("Invalid category ID"),
  subCategoryId: z.string().uuid("Invalid subcategory ID"),
  warrantyMonths:z.number().min(0).optional(),
  subSubCategoryId: z.string().uuid("Invalid sub-subcategory ID").optional(),
});