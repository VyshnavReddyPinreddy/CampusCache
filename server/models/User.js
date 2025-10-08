const mongoose=require("mongoose");

const userSchema= new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        requried:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        required:true,
        enum:["Student","Admin"]
    },
    points:{
        type:Number,
        default:0
    }
});

module.exports=mongoose.model("User",userSchema);