import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import  connectDB from "./config/database.js"; // Note the .js extension

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to the database
connectDB();

// Apply middleware
app.use(express.json());
app.use(cookieParser());


app.listen(PORT, () => {
    console.log(`Server running on port no: ${PORT}`);
});