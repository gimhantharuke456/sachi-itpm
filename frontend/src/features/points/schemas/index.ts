import { z } from "zod";

export const PointsSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  balance: z.number().min(0, "Balance cannot be negative"),
});

export type PointsFormValues = z.infer<typeof PointsSchema>;
