import { Request, Response, NextFunction } from "express";
import {
  addPoints,
  deductPoints,
  getPointsBalance,
  getAllCustomersPoints,
} from "./service";

// Add points to a user
export const addPointsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId, points } = req.body;
    const updatedPoints = await addPoints(userId, points);
    res.status(200).json(updatedPoints);
  } catch (error) {
    next(error);
  }
};

// Deduct points from a user
export const deductPointsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId, points } = req.body;
    const updatedPoints = await deductPoints(userId, points);
    res.status(200).json(updatedPoints);
  } catch (error) {
    next(error);
  }
};

// Get points balance for a user
export const getPointsBalanceController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;
    const points = await getPointsBalance(userId);
    if (!points) {
      res.status(404).json({ error: "Points not found" });
      return;
    }
    res.status(200).json(points);
  } catch (error) {
    next(error);
  }
};

// Get all customers' points (for admin)
export const getAllCustomersPointsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const points = await getAllCustomersPoints();
    res.status(200).json(points);
  } catch (error) {
    next(error);
  }
};
