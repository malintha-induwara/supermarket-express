import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCustomers } from "../reducers/customer-reducer";
import { AppDispatch, RootState } from "../store/store";
import { getItems } from "../reducers/item-reducer";
import { placeOrder } from "../reducers/order-reducer";
import Item  from "../models/Item";

interface OrderItem extends Item {
  orderQuantity: number;
  total: number;
}

function PlaceOrder() {
  const [selectedCustomer, setSelectedCustomer] = useState<number | "">("");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const dispatch = useDispatch<AppDispatch>();
  const customers = useSelector((state: RootState) => state.customer);
  const items = useSelector((state: RootState) => state.item);
  const orderState = useSelector((state: RootState) => state.order);

  useEffect(() => {
    dispatch(getCustomers());
    dispatch(getItems());
  }, []); 

  const handleItemSelect = (itemId: number) => {
    const item = items.find((item) => item.ItemID === itemId);
    setSelectedItem(item || null);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!selectedItem) return;
    
    if (quantity < 1) {
      alert("Quantity must be at least 1");
      return;
    }
    
    if (quantity > selectedItem.Quantity) {
      alert("Insufficient stock available!");
      return;
    }

    const existing = orderItems.find(
      (orderItem) => orderItem.ItemID === selectedItem.ItemID
    );
    
    if (existing) {
      alert("Item already added to the order!");
      return;
    }

    const newOrderItem: OrderItem = {
      ...selectedItem,
      orderQuantity: quantity,
      total: selectedItem.Price * quantity
    };

    setOrderItems([...orderItems, newOrderItem]);
    calculateTotal([...orderItems, newOrderItem]);
  };

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      alert("Quantity must be at least 1");
      return;
    }

    const item = items.find((item) => item.ItemID === itemId);
    if (!item || newQuantity > item.Quantity) {
      alert("Insufficient stock available!");
      return;
    }

    const updatedItems = orderItems.map((orderItem) =>
      orderItem.ItemID === itemId
        ? { ...orderItem, orderQuantity: newQuantity, total: orderItem.Price * newQuantity }
        : orderItem
    );
    
    setOrderItems(updatedItems);
    calculateTotal(updatedItems);
  };

  const handleRemoveItem = (itemId: number) => {
    const updatedItems = orderItems.filter(
      (orderItem) => orderItem.ItemID !== itemId
    );
    setOrderItems(updatedItems);
    calculateTotal(updatedItems);
  };

  const handlePlaceOrder = async () => {
    if (!selectedCustomer) {
      alert("Please select a customer!");
      return;
    }
    
    if (orderItems.length === 0) {
      alert("Add at least one item to the order!");
      return;
    }

    try {
      await dispatch(placeOrder({
        CustomerID: Number(selectedCustomer),
        items: orderItems.map(item => ({
          ItemID: item.ItemID,
          Quantity: item.orderQuantity,
          Price: item.Price
        }))
      })).unwrap();
      
      resetForm();
      alert("Order placed successfully!");
    } catch (error) {
      console.log(error)
    }
  };

  const resetForm = () => {
    setSelectedCustomer("");
    setOrderItems([]);
    setTotalPrice(0);
    setSelectedItem(null);
    setQuantity(1);
  };

  const calculateTotal = (items: OrderItem[]) => {
    const total = items.reduce(
      (acc, curr) => acc + curr.orderQuantity * curr.Price,
      0
    );
    setTotalPrice(total);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Place Order</h2>

      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Select Customer</label>
        <select
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(Number(e.target.value) || "")}
          className="border p-2 rounded w-full"
        >
          <option value="">-- Select Customer --</option>
          {customers.map((customer) => (
            <option key={customer.CustomerID} value={customer.CustomerID}>
              {customer.Name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Select Item</label>
        <select
          onChange={(e) => handleItemSelect(parseInt(e.target.value))}
          className="border p-2 rounded w-full"
        >
          <option value="">-- Select Item --</option>
          {items.map((item) => (
            <option key={item.ItemID} value={item.ItemID}>
              {item.Name} - ${item.Price} (Stock: {item.Quantity})
            </option>
          ))}
        </select>
      </div>

      {selectedItem && (
        <div className="border p-4 mt-4 rounded">
          <h4 className="font-bold text-lg">Item Details</h4>
          <p>Name: {selectedItem.Name}</p>
          <p>Price: ${selectedItem.Price}</p>
          <p>Available Stock: {selectedItem.Quantity}</p>
          <label className="block mt-2">Enter Quantity:</label>
          <input
            type="number"
            value={quantity}
            min="1"
            max={selectedItem.Quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border p-2 rounded w-20"
          />
          <button
            onClick={handleAddToCart}
            className="bg-blue-500 text-white p-2 rounded mt-2 ml-2"
          >
            Add to Cart
          </button>
        </div>
      )}

      {orderItems.length > 0 && (
        <table className="min-w-full table-auto border-collapse mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Item Name</th>
              <th className="border px-4 py-2">Price</th>
              <th className="border px-4 py-2">Quantity</th>
              <th className="border px-4 py-2">Total</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map((orderItem) => (
              <tr key={orderItem.ItemID}>
                <td className="border px-4 py-2">{orderItem.Name}</td>
                <td className="border px-4 py-2">${orderItem.Price}</td>
                <td className="border px-4 py-2">
                  <input
                    type="number"
                    value={orderItem.orderQuantity}
                    min="1"
                    max={orderItem.Quantity}
                    className="w-16 border p-1 rounded"
                    onChange={(e) =>
                      handleQuantityChange(
                        orderItem.ItemID,
                        parseInt(e.target.value)
                      )
                    }
                  />
                </td>
                <td className="border px-4 py-2">
                  ${orderItem.total}
                </td>
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => handleRemoveItem(orderItem.ItemID)}
                    className="bg-red-500 text-white p-2 rounded-lg"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-4 font-bold text-xl">
        Total: ${totalPrice.toFixed(2)}
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={handlePlaceOrder}
          disabled={orderState.loading}
          className="bg-green-500 text-white p-2 rounded disabled:bg-gray-400"
        >
          {orderState.loading ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}

export default PlaceOrder;