import { z } from "zod";

export const OrderItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  barcodes: z
    .array(z.string().min(1, "Barcode is required"))
    .min(1, "At least one barcode is required"),
  customPrice: z.number().optional(),
});

export const PaymentSchema = z.object({
  amount: z.number().min(0, "Amount must be at least 0"),
  method: z.enum(["CASH", "CARD", "BANK", "WALLET"], {
    required_error: "Payment method is required",
  }),
  reference: z.string().optional(),
});

export const OrderFormSchema = z
  .object({
    // Required fields
    shopId: z.string().min(1, "Shop ID is required"),
    items: z.array(OrderItemSchema),
    payments: z
      .array(PaymentSchema)
      .min(1, "At least one payment method is required"),

    // Customer information (either customerId or customer details)
    customerId: z.string().optional(),
    customerName: z.string().optional(),
    customerEmail: z.string().email("Invalid email address").optional(),
    customerPhone: z.string().optional(),

    // Optional fields
    discount: z.number().min(0).default(0),
    discountType: z.enum(["FIXED", "PERCENTAGE"]).default("FIXED"),
    note: z.string().optional(),
    draft: z.boolean().default(false),
    sendReceiptEmail: z.boolean().default(false),

    // Wallet-related fields
    customDueAmount: z.number().min(0).optional(),
    duePaidAmount: z.number().min(0).optional(),
    extraWalletAmount: z.number().optional(),
  })
  .refine(
    (data) => {
      // If customerId is not provided, both customer name and email are required
      if (!data.customerId) {
        return !!data.customerName && !!data.customerEmail;
      }
      return true;
    },
    {
      message: "Either customerId or both customer name and email are required",
      path: ["customerName"],
    }
  )
  .refine(
    (data) => {
      // Require items only if we're not doing a due payment (positive extraWalletAmount)
      // or if there are no payments
      if (
        data.extraWalletAmount &&
        data.extraWalletAmount > 0 &&
        data.payments.length > 0
      ) {
        return true; // Skip items validation for due payments
      }
      return data.items.length > 0; // Otherwise require at least one item
    },
    {
      message: "At least one item is required for regular orders",
      path: ["items"],
    }
  );

export type OrderFormValues = z.infer<typeof OrderFormSchema>;
