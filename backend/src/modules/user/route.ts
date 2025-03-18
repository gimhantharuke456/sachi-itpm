import express from "express";
import {
  createUserController,
  getAllUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
  loginUserController,
} from "./controller";

const router = express.Router();

// User routes
router.post("/users", createUserController);
router.get("/users", getAllUsersController);
router.get("/users/:id", getUserByIdController); // 🔹 FIX: Added missing GET by ID
router.put("/users/:id", updateUserController); // 🔹 FIX: Added missing UPDATE
router.delete("/users/:id", deleteUserController); // 🔹 FIX: Added missing DELETE

// Login route
router.post("/login", loginUserController);

export default router;
