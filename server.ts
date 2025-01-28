import express from "express";
const app = express();

app.use(express.json());


app.get("/health",(req,res)=>{
    res.send("Got It")
})
app.listen(3000,(err)=>{
    console.log("The server is running on port 3000");
})