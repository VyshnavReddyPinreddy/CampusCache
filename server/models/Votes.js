const mongoose = require("mongoose")

const voteSchema=mongoose.Schema({
    voter:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    contentId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    contentType:{
        type:String,
        required:true,
        enum:["Answer","Comment"]
    },
    voteType:{
        type:Number
    }
});

module.exports=mongoose.model("Vote",voteSchema);