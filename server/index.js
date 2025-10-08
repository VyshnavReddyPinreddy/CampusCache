import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/database.js";
import authRouter from './routes/authRoutes.js';

const app = express();
const port = process.env.PORT || 4000;
connectDB(); 

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: "http://localhost:5173",credentials:true,}));

//API endpoints
app.get('/',(request,response)=>{response.send("API WORKING")});
app.use('/api/auth',authRouter);


app.listen(port,()=>console.log(`Server running on PORT : ${port}`));
