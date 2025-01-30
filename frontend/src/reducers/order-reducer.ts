import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import  Order from "../models/Order";
import { getItems } from "./item-reducer";


const api = axios.create({
  baseURL: "http://localhost:3000/order",
});

interface PlaceOrderPayload {
  CustomerID: number;
  items: {
    ItemID: number;
    Quantity: number;
    Price: number;
  }[];
}

export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async (orderData: PlaceOrderPayload, { dispatch }) => {
    try {
      // Create the order
      const response = await api.post("/", {
        CustomerID: orderData.CustomerID,
        items: orderData.items
      });
      
      // After successful order placement, refresh the items to get updated stock
      await dispatch(getItems());
      
      return response.data;
    } catch (error) {
      console.error("Error placing order:", error);
      throw error;
    }
  }
);

export const getOrders = createAsyncThunk(
  "order/getOrders",
  async () => {
    try {
      const response = await api.get("/");
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }
);

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to place order";
      })
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch orders";
      });
  },
});

export default orderSlice.reducer;