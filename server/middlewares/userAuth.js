import jwt from 'jsonwebtoken';

const userAuth = async (request,response,next)=>{
    const {token} = request.cookies;
    if(!token){
        return response.status(401).json({success:false,message:"Not authorized. Login Again"});
    }
    try{ 
        const tokenDecoded = jwt.verify(token,process.env.JWT_SECRET);
        if(tokenDecoded.id){
            request.userId = tokenDecoded.id;  // Add userId to request object directly
        }else{
            return response.status(401).json({success:false,message:"Not authorized. Login Again"});
        } 
        next();
    }catch(error){
        return response.status(401).json({success:false,message:"Invalid or expired token. Please login again"});
    }
}

export default userAuth;