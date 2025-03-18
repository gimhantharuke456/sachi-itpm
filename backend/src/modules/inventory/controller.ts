import { Request, Response, NextFunction } from "express";
import {
  createInventoryItem,
  getAllInventoryItems,
  getInventoryItemById,
  updateInventoryItem,
  deleteInventoryItem,
} from "./service";

// Create a new inventory item
export const createInventoryItemController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const item = await createInventoryItem(req.body);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

// Get all inventory items
export const getAllInventoryItemsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const items = await getAllInventoryItems();
    res.status(200).json(items);
  } catch (error) {
    next(error);
  }
};

// Get an inventory item by ID
export const getInventoryItemByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const item = await getInventoryItemById(req.params.id);
    if (!item) {
      res.status(404).json({ error: "Inventory item not found" });
      return;
    }
    res.status(200).json(item);
  } catch (error) {
    next(error);
  }
};

// Update an inventory item
export const updateInventoryItemController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const item = await updateInventoryItem(req.params.id, req.body);
    if (!item) {
      res.status(404).json({ error: "Inventory item not found" });
      return;
    }
    res.status(200).json(item);
  } catch (error) {
    next(error);
  }
};

// Soft delete an inventory item
export const deleteInventoryItemController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const item = await deleteInventoryItem(req.params.id);
    if (!item) {
      res.status(404).json({ error: "Inventory item not found" });
      return;
    }
    res.status(200).json({ message: "Inventory item deleted", item });
  } catch (error) {
    next(error);
  }
};
