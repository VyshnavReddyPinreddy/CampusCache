import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';
import { EMAIL_VERIFY_TEMPLATE,PASSWORD_RESET_TEMPLATE } from '../config/emailTemplates.js';

export const register = async (request,response)=>{
    const {name,email,password} = request.body;
    if(!name || !email || !password){
        return response.json({success:false,message:"Missing Details"});
    }
    try{
        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return response.json({success:false,message:"User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const user = new userModel({name,email,password:hashedPassword});
        await user.save();

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1d'});

        response.cookie('token',token,{
            httpOnly : true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge : 24*60*60*1000
        });

        // sending welcome email to user. 

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: `Welcome ${name}`,
            text:`Welcome to this website, Your account has been created with email id : ${email}`
        }

        await transporter.sendMail(mailOptions);

        return response.json({success:true,message:"Signed In"});

    }catch(error){
        response.json({success:false,message:error.message});
    }
};

export const login = async (request,response)=>{
    const {email,password} = request.body;
    if(!email || !password){
        return response.json({success:false,message:"Email and password are required!"});
    }
    try{
        const user = await userModel.findOne({email});
        if(!user){
            return response.json({success:false,message:"Invalid Email!"});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return response.json({success:false,message:"Invalid Password!"});
        }

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1d'});

        response.cookie('token',token,{
            httpOnly : true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge : 24*60*60*1000
        });

        return response.json({success:true,message:"Logged In"});

    }catch(error){
        return response.json({success:false,message:error.message});
    }
};

export const logout = async (request,response)=>{
    try{
        response.clearCookie('token',{
            httpOnly : true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return response.json({success:true,message:"Logged Out !"});
    }catch(error){
        return response.json({success:false,message:error.message});       
    }
};

export const sendVerifyOtp = async (request,response)=>{
    try{
        const {userId} = request.body;
        const user = await userModel.findById(userId);
        if(user.isAccountVerified){
            return response.json({success:false,message:"Account already Verified!"});
        }
        const otp = String(Math.floor(100000+Math.random()*900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now()+24*60*60*1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: `Account verification OTP`,
            html : EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
        }

        await transporter.sendMail(mailOptions);
        return response.json({success:true,message:"Verification OTP sent successfully"});

    }catch(error){
        return response.json({success:false,message:error.message});
    }
}

export const verifyEmail = async (request,response)=>{
    const {userId,otp} = request.body;
    if(!userId){
        return response.json({success:false,message:"Missing UserId Details!!"});
    }
    if(!otp){
        return response.json({success:false,message:"Missing OTP Details!!"});
    }

    try{
        const user = await userModel.findById(userId);
        if(!user){
            return response.json({success:false,message:"User not found"});
        }

        if(user.verifyOtp==='' || user.verifyOtp!==otp){
            console.log(user.verifyOtp);
            console.log(otp);
            return response.json({success:false,message:"Invalid Otp"}); 
        }

        if(user.verifyOtpExpireAt<Date.now()){
            return response.json({success:false,message:"Otp Expired"}); 
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();
        return response.json({success:true,message:"Email verified Successfully"});

    }catch(error){
        return response.json({success:false,message:error.message});
    }
}

export const isAuthenticated = async (request,response)=>{
    try{
        return response.json({success:true});
    }catch(error){
        return response.json({success:false,message:error.message});
    }
} 

export const sendResetOtp = async (request,response)=>{
    const {email} = request.body;
    if(!email){
        return response.json({success:false,message:"Email is required!"});
    }
    try{
        const user = await userModel.findOne({email});
        if(!user){
            return response.json({success:false,message:"User not found!"});
        }
        const otp = String(Math.floor(100000+Math.random()*900000));

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now()+15*60*1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: `Password reset OTP`,
            html:PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
        }

        await transporter.sendMail(mailOptions);
        return response.json({success:true,message:"Password reset OTP sent successfully"});

    }catch(error){
        return response.json({success:false,message:error.message});
    }
};

export const resetPassword = async  (request,response)=>{
    const {email,otp,newPassword} = request.body;
    if(!email){
        return response.json({success:false,message:"Missing EmailId!!"});
    }
    if(!otp){
        return response.json({success:false,message:"Missing OTP Details!!"});
    }
    if(!newPassword){
        return response.json({success:false,message:"Missing New password Details!!"});      
    }

    try{
        const user = await userModel.findOne({email});
        if(!user){
            return response.json({success:false,message:"User not found"});
        }

        if(user.resetOtp==='' || user.resetOtp!==otp){
            console.log(user.resetOtp);
            console.log(otp);
            return response.json({success:false,message:"Invalid Otp"}); 
        }

        if(user.resetOtpExpireAt<Date.now()){
            return response.json({success:false,message:"Otp Expired"}); 
        }

        const hashedPassword = await bcrypt.hash(newPassword,10);
        
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;

        await user.save();
        return response.json({success:true,message:"Password reset Successfull"});

    }catch(error){
        return response.json({success:false,message:error.message});
    }
}