import { z } from "zod";

export const CouponSchema = z.object({
  couponCode: z.string().min(1, "Coupon code is required"),
  discountedAmount: z.number().min(0, "Discounted amount cannot be negative"),
  activeStatus: z.boolean().default(true),
  allowedItems: z.array(z.string()).min(1, "At least one item is required"),
});

export type CouponFormValues = z.infer<typeof CouponSchema>;
