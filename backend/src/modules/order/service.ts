import { Order, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create a new order
export const createOrder = async (orderData: {
  userId: string;
  items: { inventoryId: string; quantity: number }[]; // Array of InventoryItem IDs with quantity
  totalBill: number;
  discount?: number;
  couponCode?: string;
}): Promise<Order> => {
  return prisma.order.create({
    data: {
      userId: orderData.userId,
      totalBill: orderData.totalBill,
      discount: orderData.discount || 0,
      couponCode: orderData.couponCode,
      orderedItems: {
        create: orderData.items.map((item) => ({
          inventory: { connect: { id: item.inventoryId } },
          quantity: item.quantity,
        })),
      },
    },
    include: { orderedItems: { include: { inventory: true } }, user: true },
  });
};

// Get all orders
export const getAllOrders = async (): Promise<Order[]> => {
  return prisma.order.findMany({
    include: { orderedItems: { include: { inventory: true } }, user: true },
  });
};

// Get an order by ID
export const getOrderById = async (id: string): Promise<Order | null> => {
  return prisma.order.findUnique({
    where: { id },
    include: { orderedItems: { include: { inventory: true } }, user: true },
  });
};

// Get orders by customer ID
export const getOrdersByCustomerId = async (
  customerId: string
): Promise<Order[]> => {
  return prisma.order.findMany({
    where: { userId: customerId },
    include: { orderedItems: { include: { inventory: true } }, user: true },
  });
};

// Update an order (only totalBill, discount, or couponCode)
export const updateOrder = async (
  id: string,
  orderData: Partial<Pick<Order, "totalBill" | "discount" | "couponCode">>
): Promise<Order | null> => {
  return prisma.order.update({
    where: { id },
    data: orderData,
    include: { orderedItems: { include: { inventory: true } }, user: true },
  });
};

// Delete an order (and its related OrderInventoryItem entries)
export const deleteOrder = async (id: string): Promise<Order | null> => {
  // Delete related order items first (because of Prisma foreign key constraints)
  await prisma.orderInventoryItem.deleteMany({
    where: { orderId: id },
  });

  // Delete the order
  return prisma.order.delete({
    where: { id },
  });
};
