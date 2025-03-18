import express from "express";
import {
  createSupplierController,
  getAllSuppliersController,
  getSupplierByIdController,
  updateSupplierController,
  deleteSupplierController,
} from "./controller";

const router = express.Router();

// Supplier routes
router.post("/suppliers", createSupplierController);
router.get("/suppliers", getAllSuppliersController);
router.get("/suppliers/:id", getSupplierByIdController);
router.put("/suppliers/:id", updateSupplierController);
router.delete("/suppliers/:id", deleteSupplierController);

export default router;
