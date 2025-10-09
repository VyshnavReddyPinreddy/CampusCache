import Vote from "../models/Votes.js";
import Answer from "../models/Answer.js"


//add new vote
export const addVote= async (req,res)=>{

    const userId=req.body.userId

    const {answerId,voteDirection}=req.body

    if(!answerId||!userId||!voteDirection){
        return res.status(406).json({
            success:false,
            message:"not provided required fields"
        })
    }
    try{
        const userVote= await Vote.find({voter:userId,answerId})
        
        if(userVote){
            return res.status(400).json({
                success:false,
                message:"vote already exists",
                userVote
            })
        }

        const newVote= new Vote({
            voter:userId,
            answerId,
            contentType:"Answer",
            voteType:voteDirection
        })

        const savedVote=await newVote.save();

         const updatedAnswerVoteCount=await Answer.findByIdAndUpdate(answerId,
                    {$inc:{score:voteDirection}},
                    {new:true}
                )

        return res.status(200).json({
            success:true,
            message:"successfully added new vote",
            savedVote,
            updatedAnswerVoteCount
        })
    }catch(error){
        return res.status(406).json({
            success:false,
            message:error.message
        })
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