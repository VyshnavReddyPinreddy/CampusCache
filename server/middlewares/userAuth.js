import jwt from 'jsonwebtoken';
import userModel from '../models/User.js';

export const userAuth = async (request,response,next)=>{
    const {token} = request.cookies;
    if(!token){
        return response.json({success:false,message:"Not authorized. Login Again"});
    }
    try{ 
        const tokenDecoded =  jwt.verify(token,process.env.JWT_SECRET);
        if(tokenDecoded.id){
            if (!request.body) request.body = {};
            request.body.userId = tokenDecoded.id; 
        }else{
            return response.json({success:false,message:"Not authorized. Login Again"});
        } 
        next();
    }catch(error){
        return response.json({success:false,message:error.message});
    }
}

export const adminAuth = async (request,response,next)=>{
    const {token} = request.cookies;
    if(!token){
        return response.json({success:false,message:"Not authorized. Login Again"});
    }
    try{ 
        const tokenDecoded =  jwt.verify(token,process.env.JWT_SECRET);
        const user = await userModel.findById(tokenDecoded.id);
        if(!user || user.role!=='Admin'){
            return response.json({success:false,message:"Forbidden. Admin access required."});
        }
        
        request.body.userId = tokenDecoded.id;
        
        next();
    }catch(error){
        return response.json({success:false,message:error.message});
    }
}

 