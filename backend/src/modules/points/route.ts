import express from "express";
import {
  addPointsController,
  deductPointsController,
  getPointsBalanceController,
  getAllCustomersPointsController,
} from "./controller";

const router = express.Router();

// Points routes
router.post("/points/add", addPointsController);
router.post("/points/deduct", deductPointsController);
router.get("/points/balance/:userId", getPointsBalanceController);
router.get("/points/customers", getAllCustomersPointsController); // Admin-only route

export default router;
