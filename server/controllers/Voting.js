import Vote from "../models/Votes.js";
import Answer from "../models/Answer.js"


//add new vote
export const addVote = async (req,res)=>{
    const userId = req.body.userId;
    const {answerId, voteType} = req.body;

    if(!answerId || !userId || !voteType){
        return res.status(406).json({
            success:false,
            message:"Please provide all required fields"
        });
    }

    try {
        // Check if user has already voted
        const existingVote = await Vote.findOne({voter: userId, answerId});
        
        if(existingVote) {
            if(existingVote.voteType === voteType) {
                // If voting the same way, remove the vote
                await Vote.findOneAndDelete({voter: userId, answerId});
                const updatedAnswer = await Answer.findByIdAndUpdate(
                    answerId,
                    {$inc: {score: -voteType}},
                    {new: true}
                );
                return res.status(200).json({
                    success: true,
                    message: "Vote removed successfully",
                    answer: updatedAnswer,
                    voteStatus: null
                });
            } else {
                // If changing vote direction, update the vote
                existingVote.voteType = voteType;
                await existingVote.save();
                const updatedAnswer = await Answer.findByIdAndUpdate(
                    answerId,
                    {$inc: {score: voteType * 2}}, // Multiply by 2 because we're changing from -1 to 1 or vice versa
                    {new: true}
                );
                return res.status(200).json({
                    success: true,
                    message: "Vote updated successfully",
                    answer: updatedAnswer,
                    voteStatus: voteType
                });
            }
        }

        // If no existing vote, create new vote
        const newVote = new Vote({
            voter: userId,
            answerId,
            voteType
        });

        await newVote.save();
        const updatedAnswer = await Answer.findByIdAndUpdate(
            answerId,
            {$inc: {score: voteType}},
            {new: true}
        );

        return res.status(200).json({
            success: true,
            message: "Vote added successfully",
            answer: updatedAnswer,
            voteStatus: voteType
        });
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

//remove vote
export const removeVote= async (req,res)=>{

    const userId=req.body.userId

    const {answerId}=req.body

    if(!answerId||!userId){
        return res.status(406).json({
            success:false,
            message:"not provided required fields"
        })
    }
    try{
        const userVote= await Vote.find({voter:userId,answerId})
        
        if(userVote){
           const deletedVote = await Vote.findOneAndDelete({voter:userId,answerId});

           const updatedAnswerVoteCount=await Answer.findByIdAndUpdate(answerId,
               {$inc:{score:-1}},
               {new:true}
            );

            return res.status(200).json({
                success:true,
                message:"vote deleted",
                deletedVote,
                updatedAnswerVoteCount
            })
        }

        return res.status(402).json({
            success:false,
            message:"Vote doesnt exist to delete"
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

//update vote
export const updateVote =async (req,res)=>{

    const userId=req.body.userId;

    const {answerId,voteDirection}=req.body;

    if(!answerId||!userId||!voteDirection){
        return res.status(406).json({
            success:false,
            message:"not provided required fields"
        })
    }
    try{
        const userVote= await Vote.find({voter:userId,answerId})
        
        if(userVote){
            if(voteDirection===userVote.voteType){
                return res.status(400).json({
                    success:false,
                    message:"vote cannot be updated,vote is already in the given direcion",
                })
            }else{
                const updateVote=await Vote.findOneAndUpdate({voter:userId,answerId},
                    {$set:{voteType:voteDirection}},
                    {new:true})

                const updatedAnswerVoteCount=await Answer.findByIdAndUpdate(answerId,
                    {$inc:{score:2*voteDirection}},
                    {new:true}
                )
                
                return res.status(200).json({
                    success:true,
                    message:"Vote modified",
                    updateVote,
                    updatedAnswerVoteCount
                })
            }
            
        }
        return res.status(400).json({
            success:true,
            message:"vote doesnt exist to update"
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}