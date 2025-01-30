import express from "express";
import customerRouter from "./routes/customer-routes";
import itemRouter from "./routes/item-routes";
import orderRouter from "./routes/order-routes";
const app = express();

app.use(express.json());
app.use("/", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, content-type");
  next();
});
app.use("/customer", customerRouter);
app.use("/item", itemRouter);
app.use("/order", orderRouter);
app.listen(3000, (err) => {
  console.log("The server is running on port 3000");
});
