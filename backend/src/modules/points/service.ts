import { Points, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Add points to a user
export const addPoints = async (
  userId: string,
  points: number
): Promise<Points> => {
  const userPoints = await prisma.points.findUnique({
    where: { userId },
  });

  if (!userPoints) {
    return prisma.points.create({
      data: {
        userId,
        balance: points,
      },
    });
  }

  return prisma.points.update({
    where: { userId },
    data: { balance: userPoints.balance + points },
  });
};

// Deduct points from a user
export const deductPoints = async (
  userId: string,
  points: number
): Promise<Points> => {
  console.log(`points ${points}`);
  const userPoints = await prisma.points.findUnique({
    where: { userId },
  });

  if (!userPoints || userPoints.balance < points) {
    throw new Error("Insufficient points");
  }

  return prisma.points.update({
    where: { userId },
    data: { balance: points },
  });
};

// Get points balance for a user
export const getPointsBalance = async (
  userId: string
): Promise<Points | null> => {
  return prisma.points.findUnique({
    where: { userId },
    include: {
      user: true,
    },
  });
};

// Get all customers' points (for admin)
export const getAllCustomersPoints = async (): Promise<Points[]> => {
  return prisma.points.findMany({
    include: { user: true }, // Include user details
  });
};
