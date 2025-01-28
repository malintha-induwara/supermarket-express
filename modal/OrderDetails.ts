class OrderDetails {
  OrderDetailsID: number;
  OrderID: number;
  ItemID: number;
  Quantity: number;
  Price: number;

  constructor(OrderDetailsID: number, OrderID: number, ItemID: number, Quantity: number, Price: number) {
    this.OrderDetailsID = OrderDetailsID;
    this.OrderID = OrderID;
    this.ItemID = ItemID;
    this.Quantity = Quantity;
    this.Price = Price;
  }
}
