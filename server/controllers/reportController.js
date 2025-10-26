import Report from '../models/Report.js';
import Question from '../models/Question.js';
import Answer from '../models/Answer.js';
import userModel from '../models/User.js';

export const createReport = async (request, response) => {
    const { userId,contentId, contentType, reasons} = request.body;

    if (!userId || !contentId || !contentType || !reasons) {
        return response.status(400).json({ success: false, message: "Missing required report details." });
    }

    try {
        // Check if user is restricted from reporting
        const user = await userModel.findById(userId);
        if (user.invalidReports >= 3 && user.reportEnableAt > Date.now()) {
            const remainingTime = Math.ceil((user.reportEnableAt - Date.now()) / (1000 * 60 * 60)); // Convert to hours
            return response.status(403).json({ 
                success: false, 
                message: `You are temporarily restricted from reporting content. Please try again in ${remainingTime} hours.` 
            });
        }else if(user.invalidReports >=3 && user.reportEnableAt <= Date.now()){
            // Reset invalid reports count after restriction period
            user.invalidReports = 0;
            user.reportEnableAt = 0;
            await user.save();
        }
        if(contentType==='Question'){
            const question = await Question.findById(contentId);
            if(!question){
                return response.status(404).json({ success: false, message: "Question not found." });
            }
            // check if author is reporting their own content
            if(question.author.toString()===userId){
                return response.status(400).json({ success: false, message: "You cannot report your own content." });
            }
        }else if(contentType==='Answer'){
            const answer = await Answer.findById(contentId);
            if(!answer){
                return response.status(404).json({ success: false, message: "Answer not found." });
            }   
            // check if author is reporting their own content
            if(answer.author.toString()===userId){
                return response.status(400).json({ success: false, message: "You cannot report your own content." });
            }
        }else{
            return response.status(400).json({ success: false, message: "Invalid content type." });
        }
        // Check for existing pending report by the same user on the same content
        const existingReport = await Report.findOne({ reportedBy: userId, contentId});
        if (existingReport) {
            return response.status(400).json({ success: false, message: "You have already reported this content and it is under review." });
        }
        const newReport = new Report({
            ...request.body,
            reportedBy: userId,
            status: 'Pending'
        });

        await newReport.save();
        return response.status(201).json({ success: true, message: "Report submitted successfully." });

    } catch (error) {
        return response.status(500).json({ success: false, message: error.message });
    }
};