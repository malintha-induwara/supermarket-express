class Order {
  OrderID: number;
  CustomerID: number;
  OrderDate: Date;

  constructor(OrderID: number, CustomerID: number, OrderDate: Date) {
    this.OrderID = OrderID;
    this.CustomerID = CustomerID;
    this.OrderDate = OrderDate;
  }
}
