const express =require("express")
const app = express()
const database=require("./config/database")
const cookieParser=require("cookie-parser")
require("dotenv").config()

database.connect();

const PORT=process.env.PORT||4000
app.use(express.json())
app.use(cookieParser())


app.listen(PORT,()=>{
    console.log(`Server running on port no: ${PORT}`);
})

