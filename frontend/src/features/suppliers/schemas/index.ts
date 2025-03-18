import { z } from "zod";

export const SupplierSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  contactNumber: z.string().min(1, "Contact number is required"),
  address: z.string().min(1, "Address is required"),
});

export type SupplierFormValues = z.infer<typeof SupplierSchema>;
