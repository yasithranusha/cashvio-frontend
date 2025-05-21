import { z } from "zod";

export const BatchStockFormSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  broughtPrice: z.number().positive("Purchase price must be positive"),
  sellPrice: z.number().positive("Sell price must be positive"),
  items: z
    .array(
      z.object({
        barcode: z.string().min(1, "Barcode is required"),
      })
    )
    .min(1, "Add at least one item")
    .max(20, "Maximum 20 items allowed"),
});
