const mongoose=require("mongoose")

const commentSchema=new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    parentAnswer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Answer"
    },
    parentComment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    },
    score:{
        type:Number,
        default:0
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
});

module.exports=mongoose.model("Comment",commentSchema);