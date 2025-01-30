import Item from "../models/Item";
import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const initialState: Item[] = [];

type NewItem = Omit<Item, 'ItemID'>;

const api = axios.create({
  baseURL: "http://localhost:3000/item",
});

export const saveItem = createAsyncThunk(
  "item/saveItem",
  async (item: NewItem) => {
    try {
      const response = await api.post("/", item);
      return response.data;
    } catch (error) {
      return console.log("error", error);
    }
  }
);

export const getItems = createAsyncThunk(
  "item/getItems",
  async () => {
    try {
      const response = await api.get("/");
      return response.data;
    } catch (err) {
      console.log(err);
    }
  }
);

export const deleteItem = createAsyncThunk(
  "item/deleteItem",
  async (id: number) => {
    try {
      const response = await api.delete(`/${id}`);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  }
);

export const updateItem = createAsyncThunk(
  "item/updateItem",
  async (item: Item) => {
    try {
      const response = await api.put(`/${item.ItemID}`, item);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  }
);

const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(saveItem.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(saveItem.rejected, (state, action) => {
        console.error("Failed to save item:", action.payload);
      })
      .addCase(saveItem.pending, (state, action) => {
        console.log("Save item Pending", action.payload);
      });

    builder
      .addCase(getItems.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(getItems.pending, (state, action) => {
        console.log("Get item pending", action.payload);
      })
      .addCase(getItems.rejected, (state, action) => {
        console.error("Get item failed:", action.payload);
      });

    builder
      .addCase(deleteItem.rejected, (state, action) => {
        console.error("Failed to delete item", action.payload);
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        console.log(action);
        return (state = state.filter(
          (item: Item) => item.ItemID !== action.payload.ItemID
        ));
      })
      .addCase(deleteItem.pending, (state, action) => {
        console.log("Pending delete item", action.payload);
      });

    builder
      .addCase(updateItem.rejected, (state, action) => {
        console.error("Failed to save item:", action.payload);
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        const item = state.find(
          (item: Item) => item.ItemID === action.payload.ItemID
        );
        if (item) {
          item.Name = action.payload.Name;
          item.Quantity = action.payload.Quantity;
          item.Price = action.payload.Price;
        }
      })
      .addCase(updateItem.pending, (state, action) => {
        console.log("Pending update item:", action.payload);
      });
  },
});

export default itemSlice.reducer;