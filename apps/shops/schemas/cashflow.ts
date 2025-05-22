import { z } from "zod";

export const upcomingPaymentSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.string().min(1, "Amount is required"),
  dueDate: z.string().min(1, "Due date is required"),
  isRecurring: z.boolean().default(false),
});

export const createUpcomingPaymentSchema = upcomingPaymentSchema.extend({
  shopId: z.string().min(1, "Shop ID is required"),
});

export const updateUpcomingPaymentSchema = upcomingPaymentSchema.extend({
  id: z.string().min(1, "ID is required"),
});
