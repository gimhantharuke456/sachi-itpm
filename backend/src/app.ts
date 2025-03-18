import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "../src/modules/user/route";
import inventoryRoutes from "../src/modules/inventory/route";
import couponRoutes from "../src/modules/coupon/route";
import supplierRoutes from "../src/modules/supplier/route";
import orderRoutes from "../src/modules/order/route";
import pointsRoutes from "../src/modules/points/route";
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

//routes
app.use("/api", userRoutes);
app.use("/api", inventoryRoutes);
app.use("/api", couponRoutes);
app.use("/api", supplierRoutes);
app.use("/api", orderRoutes);
app.use("/api", pointsRoutes);

//errors
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error(error); // Log error for debugging
  res.status(500).json({ error: error.message || "Internal Server Error" });
});

// Default route
app.get("/", (req, res) => {
  res.send("Hotel Inventory System API");
});

export default app;
