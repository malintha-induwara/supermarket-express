import express from "express";
import customerRouter from "./routes/customer-routes";
import itemRouter from "./routes/item-routes";
import orderRouter from "./routes/order-routes";
const app = express();

app.use(express.json());

app.use("/customer",customerRouter);
app.use('/items', itemRouter);
app.use('/orders', orderRouter);
app.listen(3000,(err)=>{
    console.log("The server is running on port 3000");
})