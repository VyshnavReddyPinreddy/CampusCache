const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    question:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Question"
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    isAnonymous:{
        type:Boolean,
        default:false
    },
    score:{
        type:Number,
        default:0
    },
    updated:{
        type:Boolean,
        default:false
    },
    updatedAt:{
        type:Date,
        default:Date.now()
    }
});

module.exports=mongoose.model("Answer",answerSchema);