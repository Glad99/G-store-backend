import express from "express";
import cors from "cors"
import mongoose from "mongoose";


const app = express();

//middleware
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 4000

app.get("/", (req, res)=> {
    res.send("Server is running")
})

app.post("/signup", (req, res)=>{
    console.log(req.body);
} )

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})




