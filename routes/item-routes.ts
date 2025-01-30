import { Router } from "express";
import { createItem, deleteItem, getAllItems, getItemById, updateItem } from "../repository/item-repository";

const itemRouter = Router();

itemRouter.get("/", async (req, res) => {
  try {
    const itemList = await getAllItems();
    res.json(itemList);
  } catch (err) {
    console.error("Error in GET /items:", err);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

itemRouter.get("/:id", async (req, res) => {
  try {
    const ItemID = parseInt(req.params.id);
    const item = await getItemById(ItemID);
    res.json(item);
  } catch (err) {
    if (err instanceof Error && err.message === "Item not found") {
      res.status(404).json({ error: "Item not found" });
    } else {
      console.error("Error in GET /items/:id:", err);
      res.status(500).json({ error: "Failed to fetch item" });
    }
  }
});

itemRouter.post("/", async (req, res) => {
  try {
    const newItem = req.body;
    const item = await createItem(newItem);
    res.status(201).json(item);
  } catch (err) {
    if (err instanceof Error && err.message === "Quantity cannot be negative") {
      res.status(400).json({ error: "Quantity cannot be negative" });
    } else {
      console.error("Error in POST /items:", err);
      res.status(500).json({ error: "Failed to create item" });
    }
  }
});

itemRouter.put("/:id", async (req, res) => {
  try {
    const ItemID = parseInt(req.params.id);
    const updateData = req.body;
    const updatedItem = await updateItem(ItemID, updateData);
    res.json(updatedItem);
  } catch (err) {
    if (err instanceof Error && err.message === "Quantity cannot be negative") {
      res.status(400).json({ error: "Quantity cannot be negative" });
    } else if (err instanceof Error && err.message.includes("Record to update not found")) {
      res.status(404).json({ error: "Item not found" });
    } else {
      console.error("Error in PUT /items/:id:", err);
      res.status(500).json({ error: "Failed to update item" });
    }
  }
});

itemRouter.delete("/:id", async (req, res) => {
  try {
    const ItemID = parseInt(req.params.id);
    await deleteItem(ItemID);
    res.json({ItemID})
  } catch (err) {
    if (err instanceof Error && err.message.includes("Record to delete does not exist")) {
      res.status(404).json({ error: "Item not found" });
    } else {
      console.error("Error in DELETE /items/:id:", err);
      res.status(500).json({ error: "Failed to delete item" });
    }
  }
});

export default itemRouter;