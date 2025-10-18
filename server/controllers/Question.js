import Question from "../models/Question.js";
import Answer from "../models/Answer.js";
import User from "../models/User.js";
import Vote from "../models/Votes.js";

//post question
export const addQuestion = async (req,res)=>{
    const {
        userId,
        title,
        content,
        tags=[],
        isAnonymous=false,
    }=req.body;

    if(!userId||!title||!content){
        return res.status(400).json({
            success:false,
            message:"provide required fields",
        });
    }
    //checking if user exitsts??
    try{
        const userDetails= await User.findById(userId);
        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:"User doesnt exists"
            })
        }
        const newQuestion = new Question({
            title,
            content,
            tags,
            author:userId,
            isAnonymous
        });
    
        const saveQuestion=await newQuestion.save();

        const updatedPoints = await User.findByIdAndUpdate(userId,
            { $inc:{points:5}},
            {new:true}
        );
        
        return res.status(200).json({
            success: true,
            message: "Successfully added new question",
            question: saveQuestion,
            updatedPoints
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }

}

//Search questions
export const searchQuestions = async (req, res) => {
    try {
        const { q } = req.query; // frontend sends ?q=term

        if (!q || !q.trim()) {
            return res.status(400).json({
                success: false,
                message: "Search query is required"
            });
        }

        // Split search query into words and remove duplicates
        const searchWords = [...new Set(q.trim().toLowerCase().split(/\s+/))];
        
        // Get all questions first
        const allQuestions = await Question.find({})
            .populate('author', 'name email points')
            .select('title content tags createdAt isAnonymous author');

        // Calculate relevance score for each question
        const scoredQuestions = allQuestions.map(question => {
            let score = 0;
            const titleWords = question.title.toLowerCase().split(/\s+/);
            const contentWords = question.content.toLowerCase().split(/\s+/);
            const tagWords = question.tags.map(tag => tag.toLowerCase());
            
            // Calculate matches in title (highest weight)
            searchWords.forEach(word => {
                if (titleWords.some(tw => tw.includes(word))) score += 3;
                if (contentWords.some(cw => cw.includes(word))) score += 1;
                if (tagWords.some(tag => tag.includes(word))) score += 2;
            });

            // Calculate percentage match (normalized to 100)
            const maxPossibleScore = searchWords.length * 3; // maximum score if all words match in title
            const matchPercentage = (score / maxPossibleScore) * 100;

            return {
                ...question.toObject(),
                matchPercentage: Math.min(100, matchPercentage)
            };
        });

        // Filter questions with at least 20% relevance and sort by match percentage
        const relevantQuestions = scoredQuestions
            .filter(q => q.matchPercentage >= 20)
            .sort((a, b) => b.matchPercentage - a.matchPercentage)
            .slice(0, 20);

        return res.status(200).json({
            success: true,
            message: "Search results retrieved successfully",
            count: relevantQuestions.length,
            questions: relevantQuestions
        });

    } catch (error) {
        console.error("Search error:", error);
        return res.status(500).json({
            success: false,
            message: "Error searching questions",
            error: error.message
        });
    }
};

//fetchAllquestions
export const fetchAllQuestions = async(req,res)=>{
    try{
        const allQuestions = await Question.find()
            .populate({
                path: 'author',
                select: 'name email',
                transform: doc => {
                    // If question is anonymous, only return "Anonymous" as name
                    if (doc && doc._doc.isAnonymous) {
                        return { name: 'Anonymous' };
                    }
                    return doc;
                }
            });

        // Transform the response to handle anonymous posts
        const formattedQuestions = allQuestions.map(question => {
            if (question.isAnonymous) {
                // If anonymous, don't expose author details
                return {
                    ...question._doc,
                    author: { name: 'Anonymous' }
                };
            }
            return question;
        });

        return res.status(200).json({
            success: true,
            message: "successfully fetched all questions",
            allQuestions: formattedQuestions
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

//fetch user questions
export const fetchUserQuestions=async(req,res)=>{
    const {userId}=req.body;

    if(!userId){
        return res.status(400).json({
            success:false,
            message:"provide required fields",
        });
    }
    try{
        const userQuestions = await Question.find({author:userId})
            .populate({
                path: 'author',
                select: 'name email',
                transform: doc => {
                    // If question is anonymous, only return "Anonymous" as name
                    if (doc && doc._doc.isAnonymous) {
                        return { name: 'Anonymous' };
                    }
                    return doc;
                }
            });

        // Transform the response to handle anonymous posts
        const formattedQuestions = userQuestions.map(question => {
            if (question.isAnonymous) {
                // If anonymous, don't expose author details
                return {
                    ...question._doc,
                    author: { name: '-----' }
                };
            }
            return question;
        });

        return res.status(200).json({
            success:true,
            message:"Successfully fetched questions",
            userQuestions: formattedQuestions
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        });
    }


}

//delete question
export const deleteQuestion =async(req,res)=>{
    const { userId}=req.body;
    const {questionId} = req.params;
    if(!userId||!questionId){
        return res.status(400).json({
            success:false,
            message:"required fields missing"
        });
    }

    try{
        const questionDetails = await Question.findById(questionId);
        console.log(questionDetails.author,userId)
        if(userId!=questionDetails.author){
            return res.status(400).json({
                success:false,
                message:"Only the author can delete the question"
            })
        }

        const allAnswers= await Answer.find({question:questionId});
        const answerIds = allAnswers.map(answer=>answer._id);
        await Vote.deleteMany({
            answerId:{$in:answerIds}
        });
        await Answer.deleteMany({
            _id:{$in:answerIds}
        });
        await Question.findByIdAndDelete(questionId);

         const updatedPoints = await User.findByIdAndUpdate(userId,
            { $inc:{points:-5}},
            {new:true}
        );

        return res.status(200).json({
            success:true,
            message:"Successfully deleted the question",
            questionDetails,
            updatedPoints
        });
        

    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

