import { Router } from "express";
import { createCustomer, deleteCustomer, getAllCustomers, getCustomerById } from "../repository/customer-repository";

const customerRouter = Router();

customerRouter.get("/", async (req, res) => {
  try {
    const customerList = await getAllCustomers();
    res.json(customerList);
  } catch (err) {
    console.error("Error in GET /customers:", err);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

customerRouter.get("/:id", async (req, res) => {
  try {
    const CustomerID = parseInt(req.params.id);
    const customer = await getCustomerById(CustomerID);
    res.json(customer);
  } catch (err) {
    if (err instanceof Error && err.message === "Customer not found") {
      res.status(404).json({ error: "Customer not found" });
    } else {
      console.error("Error in GET /customers/:id:", err);
      res.status(500).json({ error: "Failed to fetch customer" });
    }
  }
});

customerRouter.post("/", async (req, res) => {
  try {
    const newCustomer = req.body;
    const customer = await createCustomer(newCustomer);
    res.status(201).json(newCustomer);
  } catch (err) {
    if (err instanceof Error && err.message.includes("Unique constraint")) {
      res.status(400).json({ error: "Email already exists" });
    } else {
      console.error("Error in POST /customers:", err);
      res.status(500).json({ error: "Failed to create customer" });
    }
  }
});

customerRouter.put("/:id", async (req, res) => {
  try {
    const CustomerID = parseInt(req.params.id);
    const updateCustomer = req.body;
    const updatedCustomer = await updateCustomer(CustomerID, updateCustomer);
    res.json(updatedCustomer);
  } catch (err) {
    if (err instanceof Error && err.message.includes("Record to update not found")) {
      res.status(404).json({ error: "Customer not found" });
    } else if (err instanceof Error && err.message.includes("Unique constraint")) {
      res.status(400).json({ error: "Email already exists" });
    } else {
      console.error("Error in PUT /customers/:id:", err);
      res.status(500).json({ error: "Failed to update customer" });
    }
  }
});

customerRouter.delete("/:id", async (req, res) => {
  try {
    const CustomerID = parseInt(req.params.id);
    await deleteCustomer(CustomerID);
    res.status(204).send();
  } catch (err) {
    if (err instanceof Error && err.message.includes("Record to delete does not exist")) {
      res.status(404).json({ error: "Customer not found" });
    } else {
      console.error("Error in DELETE /customers/:id:", err);
      res.status(500).json({ error: "Failed to delete customer" });
    }
  }
});

export default customerRouter;
