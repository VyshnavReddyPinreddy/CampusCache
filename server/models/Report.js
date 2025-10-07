const mongoose=require("mongoose");

const reportSchema=mongoose.Schema({
    contentId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    contentType:{
        type:String,
        required:true,
        enum:["Question","Answer","Comment"]
    },
    reportedBy:{
        type:Stirng,
        required:true,
        ref:"User"
    },
    reason:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["Pending","Resolved"]
    }
});

module.exports=mongoose.model("Report",reportSchema);