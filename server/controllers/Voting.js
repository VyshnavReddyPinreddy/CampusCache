import Vote from "../models/Votes";


export const upvoteAnswer= async (req,res)=>{

    const userId=req.user.id

    const {answerId,voteDirection}=req.body

    if(!objectId,!objectType,!voteDirection){
        return res.status(406).json({
            success:false,
            message:"not provided required fields"
        })
    }
    try{

        const userVote= await Vote.find({voter:userId,contentId:answerId})
        
        if(userVote&&userVote.voteDirection==1){
            return res.status(405).json({
                success:false,
                message:"vote already exists"
            })
        }
        

    }catch(error){
        return res.status(406).json({
            success:false,
            message:error.message
        })
    }







}