import express from "express";
import customerRouter from "./routes/customer-routes";
const app = express();

app.use(express.json());

app.use("/customer",customerRouter);
app.listen(3000,(err)=>{
    console.log("The server is running on port 3000");
})