import { InventoryItem, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create a new inventory item
export const createInventoryItem = async (
  itemData: Omit<
    InventoryItem,
    "id" | "createdAt" | "updatedAt" | "deleteStatus"
  >
): Promise<InventoryItem> => {
  return prisma.inventoryItem.create({
    data: {
      ...itemData,
      deleteStatus: false, // Default value
    },
  });
};

// Get all inventory items (excluding deleted items)
export const getAllInventoryItems = async (): Promise<InventoryItem[]> => {
  return prisma.inventoryItem.findMany({
    where: { deleteStatus: false },
  });
};

// Get an inventory item by ID
export const getInventoryItemById = async (
  id: string
): Promise<InventoryItem | null> => {
  return prisma.inventoryItem.findUnique({
    where: { id },
  });
};

// Update an inventory item
export const updateInventoryItem = async (
  id: string,
  itemData: Partial<InventoryItem>
): Promise<InventoryItem | null> => {
  return prisma.inventoryItem.update({
    where: { id },
    data: itemData,
  });
};

// Soft delete an inventory item
export const deleteInventoryItem = async (
  id: string
): Promise<InventoryItem | null> => {
  return prisma.inventoryItem.update({
    where: { id },
    data: { deleteStatus: true },
  });
};
