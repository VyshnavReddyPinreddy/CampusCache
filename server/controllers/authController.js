import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/User.js';
import transporter from '../config/nodemailer.js';
import { EMAIL_VERIFY_TEMPLATE,PASSWORD_RESET_TEMPLATE } from '../config/emailTemplates.js';

export const register = async (request,response)=>{
    const {name,email,password} = request.body;
    if(!name || !email || !password){
        return response.status(400).json({success:false,message:"Missing Details"});
    }
    try{
        const existingUser = await userModel.findOne({email});
        if(existingUser && existingUser.isAccountVerified){
             return response.status(400).json({success:false,message:"User already exists"});
        }

        // If user exists but is not verified, delete them to start fresh
        if (existingUser && !existingUser.isAccountVerified) {
            await userModel.findByIdAndDelete(existingUser._id);
        }
        
        const hashedPassword = await bcrypt.hash(password,10);
        
        // Generate OTP
        const otp = String(Math.floor(100000+Math.random()*900000));
        
        const user = new userModel({
            name,
            email,
            password:hashedPassword,
            verificationOtp: otp,
            verificationOtpExpires: Date.now() + 15 * 60 * 1000 // OTP expires in 15 minutes
        });

        await user.save();

        // Send verification email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: `Verify Your Account`,
            html : EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
        }
        await transporter.sendMail(mailOptions);

        return response.status(201).json({success:true,message:"Registration successful! Please check your email to verify your account."});

    }catch(error){
        response.status(500).json({success:false,message:error.message});
    }
};

export const verifyRegistration = async (request, response) => {
    const { email, otp } = request.body;
    if (!email || !otp) {
        return response.status(400).json({ success: false, message: "Missing email or OTP" });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return response.status(404).json({ success: false, message: "User not found. Please register first." });
        }

        if (user.isAccountVerified) {
            return response.status(400).json({ success: false, message: "Account already verified." });
        }
        
        if (user.verificationOtp !== otp) {
            return response.status(400).json({ success: false, message: "Invalid OTP." });
        }

        if (user.verificationOtpExpires < Date.now()) {
            return response.status(400).json({ success: false, message: "OTP has expired. Please register again to get a new one." });
        }

        user.isAccountVerified = true;
        user.verificationOtp = '';
        user.verificationOtpExpires = 0;
        await user.save();

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1d'});

        response.cookie('token',token,{
            httpOnly : true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge : 24*60*60*1000
        });
        
        return response.status(200).json({ success: true, message: "Account verified and logged in successfully!" });

    } catch (error) {
        return response.status(500).json({ success: false, message: error.message });
    }
};

export const login = async (request,response)=>{
    const {email,password} = request.body;
    if(!email || !password){
        return response.status(400).json({success:false,message:"Email and password are required!"});
    }
    try{
        const user = await userModel.findOne({email});
        if(!user){
            return response.status(404).json({success:false,message:"Invalid Email!"});
        }

        if (!user.isAccountVerified) {
            return response.status(403).json({ success: false, message: "Account not verified. Please check your email." });
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return response.status(400).json({success:false,message:"Invalid Password!"});
        }

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1d'});

        response.cookie('token',token,{
            httpOnly : true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge : 24*60*60*1000
        });

        return response.status(200).json({success:true,message:"Logged In"});

    }catch(error){
        return response.status(500).json({success:false,message:error.message});
    }
};

export const logout = async (request,response)=>{
    try{
        response.clearCookie('token',{
            httpOnly : true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return response.status(200).json({success:true,message:"Logged Out !"});
    }catch(error){
        return response.status(500).json({success:false,message:error.message});       
    }
};

export const isAuthenticated = async (request,response)=>{
    try{
        return response.status(200).json({success:true});
    }catch(error){
        return response.status(500).json({success:false,message:error.message});
    }
} 

export const sendResetOtp = async (request,response)=>{
    const {email} = request.body;
    if(!email){
        return response.status(400).json({success:false,message:"Email is required!"});
    }
    try{
        const user = await userModel.findOne({email});
        if(!user){
            return response.status(404).json({success:false,message:"User not found!"});
        }
        const otp = String(Math.floor(100000+Math.random()*900000));

        user.passwordResetOtp = otp;
        user.passwordResetOtpExpires = Date.now()+15*60*1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: `Password reset OTP`,
            html:PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
        }

        await transporter.sendMail(mailOptions);
        return response.status(200).json({success:true,message:"Password reset OTP sent successfully"});

    }catch(error){
        return response.status(500).json({success:false,message:error.message});
    }
};

export const resetPassword = async  (request,response)=>{
    const {email,otp,newPassword} = request.body;
    if(!email || !otp || !newPassword){
        return response.status(400).json({success:false,message:"Missing required details!"});      
    }

    try{
        const user = await userModel.findOne({email});
        if(!user){
            return response.status(404).json({success:false,message:"User not found"});
        }

        if(user.passwordResetOtp==='' || user.passwordResetOtp!==otp){
            return response.status(400).json({success:false,message:"Invalid Otp"}); 
        }

        if(user.passwordResetOtpExpires<Date.now()){
            return response.status(400).json({success:false,message:"Otp Expired"}); 
        }

        const hashedPassword = await bcrypt.hash(newPassword,10);
        
        user.password = hashedPassword;
        user.passwordResetOtp = undefined;
        user.passwordResetOtpExpires = undefined;

        await user.save();
        return response.status(200).json({success:true,message:"Password reset Successfull"});

    }catch(error){
        return response.status(500).json({success:false,message:error.message});
    }
}