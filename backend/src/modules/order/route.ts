import express from "express";
import {
  createOrderController,
  getAllOrdersController,
  getOrderByIdController,
  getOrdersByCustomerIdController,
  updateOrderController,
  deleteOrderController,
} from "./controller";

const router = express.Router();

// Order routes
router.post("/orders", createOrderController);
router.get("/orders", getAllOrdersController);
router.get("/orders/:id", getOrderByIdController);
router.get("/orders/customer/:customerId", getOrdersByCustomerIdController); // Get orders by customer ID
router.put("/orders/:id", updateOrderController);
router.delete("/orders/:id", deleteOrderController);

export default router;
