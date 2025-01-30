import { PrismaClient } from "@prisma/client";
import Item from "../modal/Item";


const prisma = new PrismaClient();

type ItemCreateInput  = Omit<Item,'ItemID'>;

export async function getAllItems() {
  try {
    return await prisma.item.findMany();
  } catch (err) {
    console.error("Error fetching items:", err);
    throw new Error("Failed to fetch items from the database");
  }
}

export async function getItemById(ItemID: number) {
  try {
    const item = await prisma.item.findUnique({
      where: { ItemID },
    });
    if (!item) {
      throw new Error("Item not found");
    }
    return item;
  } catch (err) {
    console.error(`Error fetching item with id ${ItemID}:`, err);
    throw err;
  }
}

export async function createItem(itemData: ItemCreateInput) {
  try {
    if (itemData.Quantity < 0) {
      throw new Error("Quantity cannot be negative");
    }
    return await prisma.item.create({
      data: itemData,
    });
  } catch (err) {
    console.error("Error creating item:", err);
    throw err;
  }
}

export async function updateItem(ItemID: number, itemData: Partial<ItemCreateInput>) {
  try {
    if (itemData.Quantity !== undefined && itemData.Quantity < 0) {
      throw new Error("Quantity cannot be negative");
    }
    const item = await prisma.item.update({
      where: { ItemID },
      data: itemData,
    });
    return item;
  } catch (err) {
    console.error(`Error updating item with id ${ItemID}:`, err);
    throw err;
  }
}

export async function deleteItem(ItemID: number) {
  try {
    await prisma.item.delete({
      where: { ItemID },
    });
    return true;
  } catch (err) {
    console.error(`Error deleting item with id ${ItemID}:`, err);
    throw err;
  }
}
