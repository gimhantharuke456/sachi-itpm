import { Request, Response, NextFunction } from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByCustomerId,
  updateOrder,
  deleteOrder,
} from "./service";

// Create a new order
export const createOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const order = await createOrder(req.body);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

// Get all orders
export const getAllOrdersController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orders = await getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

// Get an order by ID
export const getOrderByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

// Get orders by customer ID
export const getOrdersByCustomerIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orders = await getOrdersByCustomerId(req.params.customerId);
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

// Update an order
export const updateOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const order = await updateOrder(req.params.id, req.body);
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

// Delete an order
export const deleteOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const order = await deleteOrder(req.params.id);
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.status(200).json({ message: "Order deleted", order });
  } catch (error) {
    next(error);
  }
};
