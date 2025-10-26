import userModel from '../models/User.js';

export const getUserData = async (request,response)=>{
    try{
        if (!request.userId) {
            return response.status(401).json({success:false, message:"Authentication required"});
        }
        
        const user = await userModel.findById(request.userId).select('-password -resetOtp -resetOtpExpireAt -verifyOtp -verifyOtpExpireAt');
        if(!user){
            return response.status(404).json({success:false, message:"User not found!"});
        }

        response.json({ 
            success:true,
            userData: user
        });
    }catch(error){
        console.error('Error in getUserData:', error);
        response.status(500).json({success:false, message:error.message});
    }
}

export const resetInvalidReports = async (request, response) => {
    const userId = request.body.userId;
    try {
        if (!userId) {
            return response.status(401).json({ success: false, message: "Authentication required" });
        }   
        await userModel.findByIdAndUpdate(request.userId, { invalidReports: 0, reportEnableAt: 0 });
        response.json({ success: true, message: "Invalid reports count reset successfully" });
    } catch (error) {
        console.error('Error in resetInvalidReports:', error);
        response.status(500).json({ success: false, message: error.message });
    }   
}