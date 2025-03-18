import { z } from "zod";

export const UserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contactNumber: z.string().min(1, "Contact number is required"),
  role: z.string().default("customer"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
});

export type UserFormValues = z.infer<typeof UserSchema>;
