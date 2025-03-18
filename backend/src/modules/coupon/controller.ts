import { Request, Response, NextFunction } from "express";
import {
  createCoupon,
  getAllCoupons,
  getCouponById,
  applyCoupon,
  deleteCoupon,
} from "./service";

// Create a new coupon
export const createCouponController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const coupon = await createCoupon(req.body);
    res.status(201).json(coupon);
  } catch (error) {
    next(error);
  }
};

// Get all coupons
export const getAllCouponsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const coupons = await getAllCoupons();
    res.status(200).json(coupons);
  } catch (error) {
    next(error);
  }
};

// Get a coupon by ID
export const getCouponByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const coupon = await getCouponById(req.params.id);
    if (!coupon) {
      res.status(404).json({ error: "Coupon not found" });
      return;
    }
    res.status(200).json(coupon);
  } catch (error) {
    next(error);
  }
};

// Apply a coupon (deactivate it)
export const applyCouponController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const coupon = await applyCoupon(req.params.id);
    if (!coupon) {
      res.status(404).json({ error: "Coupon not found" });
      return;
    }
    res.status(200).json({ message: "Coupon applied", coupon });
  } catch (error) {
    next(error);
  }
};

// Delete a coupon
export const deleteCouponController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const coupon = await deleteCoupon(req.params.id);
    if (!coupon) {
      res.status(404).json({ error: "Coupon not found" });
      return;
    }
    res.status(200).json({ message: "Coupon deleted", coupon });
  } catch (error) {
    next(error);
  }
};
