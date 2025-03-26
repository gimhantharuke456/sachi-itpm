import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../prisma/client";

// Create a new user
export const createUser = async (userData: Omit<User, "id">): Promise<User> => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  return prisma.user.create({
    data: {
      name: userData.name,
      contactNumber: userData.contactNumber,
      username: userData.username,
      email: userData.email,
      role: userData.role,
      password: hashedPassword,
    },
  });
};

// Get all users
export const getAllUsers = async (): Promise<User[]> => {
  return prisma.user.findMany();
};

// Get a user by ID
export const getUserById = async (id: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { id },
  });
};

// Update a user
export const updateUser = async (
  id: string,
  userData: Partial<User>
): Promise<User | null> => {
  if (userData.password) {
    userData.password = await bcrypt.hash(userData.password, 10);
  }
  return prisma.user.update({
    where: { id },
    data: userData,
  });
};

// Delete a user
export const deleteUser = async (id: string): Promise<User | null> => {
  await prisma.orderInventoryItem.deleteMany({
    where: {
      order: {
        userId: id,
      },
    },
  }),
    await Promise.all([
      prisma.points.deleteMany({
        where: {
          userId: id,
        },
      }),

      prisma.order.deleteMany({
        where: {
          userId: id,
        },
      }),
    ]);
  return prisma.user.delete({
    where: { id },
  });
};

// Login a user
export const loginUser = async (
  username: string,
  password: string
): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return null;
  }

  return user;
};
