import User from "../models/User.js"

export const fetchUserPoints = async (req,res) => {
    try{
        const allusers = await User.find({ role: 'Student' }).select("_id name points").sort({points:-1});
        const {userId} = req.body;
        if(!userId){
            return res.status(400).json({
                success:false,
                message:"UserId is required"
            })
        }
         // check if the current user is in the top-10 of the data we fetched above
        const userIndex = allusers.findIndex(user => user._id.toString() === userId.toString());
        if(userIndex === -1){
            return res.status(404).json({
                success:false,
                message:"User not found in the leaderboard"
            })
        }
        
        if(userIndex<10){
            //return the top 10 user's "name" and "points" and "rank"

            const data = allusers.slice(0, 10).map((user, index) => ({
                name: user.name,
                points: user.points,
                rank: index + 1
            }));
            return res.status(200).json({
                success:true,
                message:"Successfully fetched the top 10 users",
                data : data
            })
        }

        // if the user is not in the top 10, return the top 10 users and the current user's name, points and rank
        const data1 = allusers.slice(0, 10).map((user, index) => ({
            name: user.name,
            points: user.points,
            rank: index + 1
        }));    
        const currentUser = {
            name: allusers[userIndex].name,
            points: allusers[userIndex].points,
            rank: userIndex + 1
        };  
        // add this current user to the data
        const data = [...data1, currentUser].sort((a, b) => a.rank - b.rank);
        return res.status(200).json({
            success:true,
            message:"Successfully fetched the top 10 users and current user details",
            data : data
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