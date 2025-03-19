import { Order, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create a new order
export const createOrder = async (orderData: {
  userId: string;
  items: { inventoryId: string; quantity: number }[]; // Array of InventoryItem IDs with quantity
  totalBill: number;
  discount?: number;
  couponCode?: string;
  address: string;
  contactNumber: string;
  email: string;
  name: string;
}): Promise<Order> => {
  const order = await prisma.order.create({
    data: {
      userId: orderData.userId,
      address: orderData.address,
      email: orderData.email,
      name: orderData.name,
      contactNumber: orderData.contactNumber,
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
  //check points and create or update
  const points = await prisma.points.findUnique({
    where: {
      userId: orderData.userId,
    },
  });
  if (points) {
    await prisma.points.update({
      where: {
        id: points.id,
      },
      data: {
        balance: points.balance + orderData.totalBill / 10,
      },
    });
  } else {
    await prisma.points.create({
      data: {
        balance: orderData.totalBill / 10,
        userId: orderData.userId,
      },
    });
  }
  return order;
};

// Get all orders
export const getAllOrders = async (): Promise<Order[]> => {
  return prisma.order.findMany({
    where: {
      deleteStatus: false,
    },
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
    where: { userId: customerId, deleteStatus: false },
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

  // Delete the order
  return prisma.order.update({
    where: { id },
    data: {
      deleteStatus: true,
    },
  });
};
