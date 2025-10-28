import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import todoRoutes from './routes/todo.route.js'
dotenv.config();

const app = express();

// app.get("/", (req,res) => {
//     res.send("Server is ready to use")
// });

app.use(express.json())
app.use("/api/todos", todoRoutes)

app.listen(5000, () => {
    connectDB();
    console.log("Server started at port 5000");
});