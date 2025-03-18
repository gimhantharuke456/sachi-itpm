import express from "express";
import {
  createCouponController,
  getAllCouponsController,
  getCouponByIdController,
  applyCouponController,
  deleteCouponController,
} from "./controller";

const router = express.Router();

// Coupon routes
router.post("/coupons", createCouponController);
router.get("/coupons", getAllCouponsController);
router.get("/coupons/:id", getCouponByIdController);
router.post("/coupons/:id/apply", applyCouponController); // Apply a coupon
router.delete("/coupons/:id", deleteCouponController);

export default router;
