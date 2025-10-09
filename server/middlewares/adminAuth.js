import userModel from '../models/User.js'; 

const adminAuth = async (request,response,next)=>{
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

export default adminAuth;