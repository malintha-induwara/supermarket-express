import Customer from "../models/Customer";
import axios from "axios";
import { createAsyncThunk, createSlice} from "@reduxjs/toolkit";

export const initialState: Customer[] = [];

type NewCustomer = Omit<Customer,'CustomerID'>

const api = axios.create({
  baseURL: "http://localhost:3000/customer",
});

export const saveCustomer = createAsyncThunk("customer/saveCustomer", async (customer: NewCustomer) => {
  try {
    const response = await api.post("/", customer);
    return response.data;
  } catch (error) {
    return console.log("error", error);
  }
});

export const getCustomers = createAsyncThunk("customer/getCustomers", async () => {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (err) {
    console.log(err);
  }
});

export const deleteCustomer = createAsyncThunk("customer/deleteCustomer", async (id: number) => {
  try {
    const response = await api.delete(`/${id}`);
    return response.data;
  } catch (err) {
    console.log(err);
  }
});

export const updateCustomer = createAsyncThunk("customer/updateCustomer", async (customer: Customer) => {
  try {
    const response = await api.put(`/${customer.CustomerID}`, customer);
    return response.data;
  } catch (err) {
    console.log(err);
  }
});     

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(saveCustomer.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(saveCustomer.rejected, (state, action) => {
        console.error("Failed to save customer:", action.payload);
      })
      .addCase(saveCustomer.pending, (state, action) => {
        console.log("Save customer Pending", action.payload);
      });

    builder
      .addCase(getCustomers.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(getCustomers.pending, (state, action) => {
        console.log("Get customer pending", action.payload);
      })
      .addCase(getCustomers.rejected, (state, action) => {
        console.error("Get customer faild:", action.payload);
      });
    builder
      .addCase(deleteCustomer.rejected, (state, action) => {
        console.error("Failed to delete customer", action.payload);
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {

        console.log(action);

        return (state = state.filter((customer: Customer) => customer.CustomerID !== action.payload.CustomerID));
      })
      .addCase(deleteCustomer.pending, (state, action) => {
        console.log("Pending delete customer", action.payload);
      });

    builder
      .addCase(updateCustomer.rejected, (state, action) => {
        console.error("Failed to save customer:", action.payload);
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        const customer = state.find((customer: Customer) => customer.CustomerID === action.payload.CustomerID);
        if (customer) {
          customer.Name = action.payload.Name;
          customer.Email = action.payload.Email;
          customer.Address = action.payload.Address;
        }
      })
      .addCase(updateCustomer.pending, (state, action) => {
        console.log("Pending update customer:", action.payload);
      });
  },
});


export default customerSlice.reducer;
