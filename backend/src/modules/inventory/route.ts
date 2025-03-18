import express from "express";
import {
  createInventoryItemController,
  getAllInventoryItemsController,
  getInventoryItemByIdController,
  updateInventoryItemController,
  deleteInventoryItemController,
} from "./controller";

const router = express.Router();

// Inventory item routes
router.post("/inventoryItems", createInventoryItemController);
router.get("/inventoryItems", getAllInventoryItemsController);
router.get("/inventoryItems/:id", getInventoryItemByIdController);
router.put("/inventoryItems/:id", updateInventoryItemController);
router.delete("/inventoryItems/:id", deleteInventoryItemController);

export default router;
