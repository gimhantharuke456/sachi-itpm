import { z } from "zod";

export const OrderSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  totalBill: z.number().min(0, "Total bill cannot be negative"),
  discount: z.number().default(0),
  couponCode: z.string().optional(),
  name: z.string(),
  address: z.string(),
  contactNumber: z.string(),
  orderStatus: z.string(),
  email: z.string(),
  items: z.array(
    z.object({
      inventoryId: z.string().min(1, "Inventory ID is required"),
      quantity: z.number().min(1, "Quantity must be at least 1"),
    })
  ),
});

export type OrderFormValues = z.infer<typeof OrderSchema>;
