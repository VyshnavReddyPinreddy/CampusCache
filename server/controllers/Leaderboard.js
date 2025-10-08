const User = require("../models/User")

exports.fetchUserPoints = async (req,res) => {
    try{
        const userDetails=await User.find().select("firstName lastName points");

        return res.status(200).json({
            success:true,
            message:"Successfully fetched all user details",
            userDetails
        })
    }catch(error){
        return res.status(402).json({
            success:false,
            message:error.message
        })
    }
}

exports.fetchSingleUserPoints=async (req,res) => {
    const userId=req.user.id;

    try{
        const userPoints=await User.findById(id).select("points")

        return res.status(200).json({
            success:true,
            message:"Successfully fetched the user points",
            userPoints
        })
    }catch(error){
        return res.status(403).json({
            success:false,
            message:error.message
        })
    }
}