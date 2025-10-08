import Vote from "../models/Votes";
const Vote =require("../models/Votes")
const Answer=require("../models/Answer")

export const voteAnswer= async (req,res)=>{

    const userId=req.user.id

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
            if(voteDirection===userVote.voteType){

                const deletedVote = await Vote.findOneAndDelete({voter:userId,answerId})
                return res.status(200).json({
                    success:false,
                    message:"vote deleted",
                    deletedVote
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

