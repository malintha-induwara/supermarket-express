import { Router } from "express";
import { createOrder, deleteOrder, getAllOrders, getOrderById } from "../repository/order-repository";

const orderRouter = Router();

orderRouter.get("/", async (req, res) => {
  try {
    const orderList = await getAllOrders();
    res.json(orderList);
  } catch (err) {
    console.error("Error in GET /orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

orderRouter.get("/:id", async (req, res) => {
  try {
    const OrderID = parseInt(req.params.id);
    const order = await getOrderById(OrderID);
    res.json(order);
  } catch (err) {
    if (err instanceof Error && err.message === "Order not found") {
      res.status(404).json({ error: "Order not found" });
    } else {
      console.error("Error in GET /orders/:id:", err);
      res.status(500).json({ error: "Failed to fetch order" });
    }
  }
});

orderRouter.post("/", async (req, res) => {
  try {
    const newOrder = req.body;
    const order = await createOrder(newOrder);
    res.status(201).json(order);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "Customer not found") {
        res.status(404).json({ error: "Customer not found" });
      } else if (err.message.includes("Item with ID") && err.message.includes("not found")) {
        res.status(404).json({ error: err.message });
      } else if (err.message.includes("Insufficient quantity")) {
        res.status(400).json({ error: err.message });
      } else {
        console.error("Error in POST /orders:", err);
        res.status(500).json({ error: "Failed to create order" });
      }
    }
  }
});

orderRouter.delete("/:id", async (req, res) => {
  try {
    const OrderID = parseInt(req.params.id);
    await deleteOrder(OrderID);
    res.status(204).send();
  } catch (err) {
    if (err instanceof Error && err.message === "Order not found") {
      res.status(404).json({ error: "Order not found" });
    } else {
      console.error("Error in DELETE /orders/:id:", err);
      res.status(500).json({ error: "Failed to delete order" });
    }
  }
});

export default orderRouter;