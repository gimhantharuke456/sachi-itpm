import { Coupon, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create a new coupon
export const createCoupon = async (
  couponData: Omit<
    Coupon,
    "id" | "createdAt" | "updatedAt" | "activeStatus"
  > & {
    allowedItems: string[];
  }
): Promise<Coupon> => {
  return prisma.coupon.create({
    data: {
      couponCode: couponData.couponCode,
      discountedAmount: parseFloat(couponData.discountedAmount.toString()),
      activeStatus: true,
      allowedItems: {
        create: couponData.allowedItems.map((itemId) => ({
          inventory: {
            connect: { id: itemId },
          },
        })),
      },
    },
    include: {
      allowedItems: true,
    },
  });
};

// Get all coupons
export const getAllCoupons = async (): Promise<Coupon[]> => {
  return prisma.coupon.findMany({
    include: { allowedItems: true }, // Include related InventoryItems
  });
};

// Get a coupon by ID
export const getCouponById = async (id: string): Promise<Coupon | null> => {
  return prisma.coupon.findUnique({
    where: { id },
    include: { allowedItems: true }, // Include related InventoryItems
  });
};

// Apply a coupon (deactivate it)
export const applyCoupon = async (id: string): Promise<Coupon | null> => {
  return prisma.coupon.update({
    where: { id },
    data: { activeStatus: false },
  });
};

// Delete a coupon
export const deleteCoupon = async (id: string): Promise<Coupon | null> => {
  return prisma.coupon.delete({
    where: { id },
  });
};
