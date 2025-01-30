import { useEffect, useState } from "react";
import { Trash2 } from "react-feather";
import { AppDispatch, RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { deleteCustomer, getCustomers, saveCustomer, updateCustomer } from "../reducers/customer-reducer";
import Customer from "../models/Customer";

function CustomerPage() {
  const dispatch = useDispatch<AppDispatch>();
  const customers = useSelector((state: RootState) => state.customer);

  useEffect(() => {
    dispatch(getCustomers());
  }, []);

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleAdd = () => {
    if (!name || !address || !email) {
      alert("All fields are required!");
      return;
    }

    const newCustomer = {  Name: name, Address: address, Email: email };
    dispatch(saveCustomer(newCustomer));
    resetForm();
  };

  const handleEdit = (customer: Customer) => {
    setId(customer.CustomerID.toString());
    setName(customer.Name);
    setAddress(customer.Address);
    setEmail(customer.Email);
    setIsEditing(true);
  };

  const handleUpdate = () => {
    if (!id || !name || !address || !email) {
      alert("All fields are required!");
      return;
    }
    const updatedCustomer = { CustomerID: parseInt(id), Name: name, Address: address, Email: email };
    dispatch(updateCustomer(updatedCustomer));
    resetForm();
  };

  const handleDelete = (customerId: number) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      dispatch(deleteCustomer(customerId));
    }
  };

  const resetForm = () => {
    setId("");
    setName("");
    setAddress("");
    setEmail("");
    setIsEditing(false);
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <input type="text" name="id" placeholder="ID" value={id} onChange={(e) => setId(e.target.value)} className="border p-2 rounded" />
        <input type="text" name="name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 rounded" />
        <input type="text" name="address" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} className="border p-2 rounded" />
        <input type="email" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 rounded" />
      </div>
      <div className="flex justify-end">
        {isEditing ? (
          <button onClick={handleUpdate} className="bg-blue-500 text-white p-2 rounded mr-2">
            Update
          </button>
        ) : (
          <button onClick={handleAdd} className="bg-green-500 text-white p-2 rounded mr-2">
            Add
          </button>
        )}
        {isEditing && (
          <button onClick={resetForm} className="bg-gray-500 text-white p-2 rounded">
            Cancel
          </button>
        )}
      </div>
      <table className="min-w-full table-auto border-collapse mt-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Address</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.CustomerID} onClick={() => handleEdit(customer)} className="hover:cursor-pointer hover:bg-slate-600 hover:text-white">
              <td className="border px-4 py-2">{customer.CustomerID}</td>
              <td className="border px-4 py-2">{customer.Name}</td>
              <td className="border px-4 py-2">{customer.Address}</td>
              <td className="border px-4 py-2">{customer.Email}</td>
              <td className="border px-4 py-2 text-center">
                <button onClick={() => handleDelete(customer.CustomerID)} className="bg-red-500 text-white p-2 rounded-lg">
                  <Trash2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerPage;
