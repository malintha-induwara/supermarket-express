// customer-repository.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface CustomerCreateInput {
  Name: string;
  Address: string;
  Email: string;
}

export async function getAllCustomers() {
  try {
    return await prisma.customer.findMany();
  } catch (err) {
    console.error("Error fetching customers:", err);
    throw new Error("Failed to fetch customers from the database");
  }
}

export async function getCustomerById(CustomerID: number) {
  try {
    const customer = await prisma.customer.findUnique({
      where: { CustomerID },
    });
    if (!customer) {
      throw new Error("Customer not found");
    }
    return customer;
  } catch (err) {
    console.error(`Error fetching customer with id ${CustomerID}:`, err);
    throw err;
  }
}

export async function createCustomer(customerData: CustomerCreateInput) {
  try {
    return await prisma.customer.create({
      data: customerData,
    });
  } catch (err) {
    console.error("Error creating customer:", err);
    throw new Error("Failed to create customer");
  }
}

export async function updateCustomer(CustomerID: number, customerData: Partial<CustomerCreateInput>) {
  try {
    const customer = await prisma.customer.update({
      where: { CustomerID },
      data: customerData,
    });
    return customer;
  } catch (err) {
    console.error(`Error updating customer with id ${CustomerID}:`, err);
    throw err;
  }
}

export async function deleteCustomer(CustomerID: number) {
  try {
    await prisma.customer.delete({
      where: { CustomerID },
    });
    return true;
  } catch (err) {
    console.error(`Error deleting customer with id ${CustomerID}:`, err);
    throw err;
  }
}
