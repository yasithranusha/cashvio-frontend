import { z } from "zod";

export const SupplierSchema = z.object({
  name: z.string().min(1, "Supplier name is required"),
  email: z.string().email("Invalid email address").optional().nullable(),
  contactNumber: z.string().min(1, "Contact number is required"),
  haveWhatsApp: z.boolean().default(false),
  shopId: z.string().min(1, "Shop ID is required"),
});