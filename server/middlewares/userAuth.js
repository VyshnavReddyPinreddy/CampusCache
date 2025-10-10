import jwt from 'jsonwebtoken';

const userAuth = async (request,response,next)=>{
    const {token} = request.cookies;
    if(!token){
        return response.status(401).json({success:false,message:"Not authorized. Login Again"});
    }
    try{ 
        const tokenDecoded = jwt.verify(token,process.env.JWT_SECRET);
        if(tokenDecoded.id){
            request.userId = tokenDecoded.id;  // For direct access in controllers
            if (!request.body) request.body = {};  // Ensure request.body exists
            request.body.userId = tokenDecoded.id; // For controllers accessing from body
        }else{
            return response.status(401).json({success:false,message:"Not authorized. Login Again"});
        } 
        next();
    }catch(error){
        return response.status(401).json({success:false,message:"Invalid or expired token. Please login again"});
    }
}

export default userAuth;