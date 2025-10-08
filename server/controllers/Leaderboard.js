import User from "../models/User.js"

export const fetchUserPoints = async (req,res) => {
    try{
        const userDetails=await User.find().select("name points").sort({points:-1});

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

export const fetchSingleUserPoints=async (req,res) => {
    const userId=req.body.userId;
    console.log(userId);
    try{
        const userPoints=await User.findById(userId).select("points")

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

//update user points

export const updateUserPoints = async (req,res)=>{ 
    const userId=req.body.userId
    const newPoints=req.body.points
    console.log(userId,req.body);
    if(!userId||!newPoints){
        return res.status(407).json({
            success:false,
            message:"Missing required fields"
        })
    }

    try{
        const updatedPoints= await User.findByIdAndUpdate(userId,
            {$inc:{points:newPoints} },
            {new:true}
        )

        return res.status(200).json({
            success:true,
            message:"succesfully updated user points",
            updatedPoints
        })
    }catch(error){
        return res.status(406).json({
            success:false,
            message:error.message
        })
    }
}