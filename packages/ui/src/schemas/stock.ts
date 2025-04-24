import { z } from "zod";

export const StockItemSchema = z.object({
  barcode: z.string().min(1, "Barcode is required"),
  broughtPrice: z.number().positive("Brought price must be positive"),
  sellPrice: z.number().positive("Sell price must be positive"),
  productId: z.string().uuid("Invalid product ID"),
});

export const UpdateStockItemSchema = StockItemSchema.partial();