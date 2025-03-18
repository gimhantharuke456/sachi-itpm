import { z } from "zod";

export const InventoryItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0, "Price cannot be negative"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().url("Invalid URL"),
  inStock: z.number().min(0, "Stock cannot be negative"),
  deleteStatus: z.boolean().default(false),
});

export type InventoryItemFormValues = z.infer<typeof InventoryItemSchema>;
