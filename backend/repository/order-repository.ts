import { PrismaClient } from "@prisma/client";
import { getCustomerById } from "./customer-repository";
import { getItemById } from "./item-repository";
import Order from "../modal/Order";
import OrderDetails from "../modal/OrderDetails";

const prisma = new PrismaClient();

type OrderItemInput = Omit<OrderDetails, "OrderDetailsID" | "OrderID" | "Price">;
type OrderCreateInput = Omit<Order, "OrderID" | "OrderDate"> & { items: OrderItemInput[] };

export async function getAllOrders() {
  try {
    return await prisma.order.findMany({
      include: {
        Customer: true,
        OrderDetails: {
          include: {
            Item: true,
          },
        },
      },
    });
  } catch (err) {
    console.error("Error fetching orders:", err);
    throw new Error("Failed to fetch orders from the database");
  }
}

export async function getOrderById(OrderID: number) {
  try {
    const order = await prisma.order.findUnique({
      where: { OrderID },
      include: {
        Customer: true,
        OrderDetails: {
          include: {
            Item: true,
          },
        },
      },
    });
    if (!order) {
      throw new Error("Order not found");
    }
    return order;
  } catch (err) {
    console.error(`Error fetching order with id ${OrderID}:`, err);
    throw err;
  }
}

export async function createOrder(orderData: OrderCreateInput) {
  try {
    return await prisma.$transaction(async (prisma) => {

      const customer = await getCustomerById(orderData.CustomerID);

      const items = await Promise.all(
        orderData.items.map(async (item) => {
          const dbItem = await getItemById(item.ItemID);
          if (dbItem.Quantity < item.Quantity) {
            throw new Error(`Insufficient quantity for item ${dbItem.Name}`);
          }
          return { ...item, dbItem };
        })
      );

      // Create order
      const order = await prisma.order.create({
        data: {
          CustomerID: orderData.CustomerID,
          OrderDetails: {
            create: items.map((item) => ({
              ItemID: item.ItemID,
              Quantity: item.Quantity,
              Price: item.dbItem.Price,
            })),
          },
        },
        include: {
          OrderDetails: true,
        },
      });

      // Update item quantities
      await Promise.all(
        items.map((item) =>
          prisma.item.update({
            where: { ItemID: item.ItemID },
            data: {
              Quantity: {
                decrement: item.Quantity,
              },
            },
          })
        )
      );

      return order;
    });
  } catch (err) {
    console.error("Error creating order:", err);
    throw err;
  }
}

export async function deleteOrder(OrderID: number) {
  try {
    return await prisma.$transaction(async (prisma) => {
      // Get order details to restore item quantities
      const order = await prisma.order.findUnique({
        where: { OrderID },
        include: {
          OrderDetails: true,
        },
      });

      if (!order) {
        throw new Error("Order not found");
      }

      await Promise.all(
        order.OrderDetails.map((detail) =>
          prisma.item.update({
            where: { ItemID: detail.ItemID },
            data: {
              Quantity: {
                increment: detail.Quantity,
              },
            },
          })
        )
      );

      await prisma.order.delete({
        where: { OrderID },
      });

      return true;
    });
  } catch (err) {
    console.error(`Error deleting order with id ${OrderID}:`, err);
    throw err;
  }
}
