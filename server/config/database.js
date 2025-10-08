const mongoose=require("mongoose")
require("dotenv").config()

exports.connect=()=>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{console.log("Successfully connected to mongoDB ")})
      .catch((e)=>{
                console.log("DB connection failed");
                console.log(e)
        })
};