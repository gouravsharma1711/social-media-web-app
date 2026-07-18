const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError.js');
const User = require('../models/User.model.js');
const asyncHandler = require('../utils/asyncHandler.js');


const generateNewTokens=async function(user){

    const newAccessToken =  user.generateAccessToken();
    const newRefreshToken =  user.generateRefreshToken();

    user.refreshToken = newRefreshToken;
    await user.save();

    return {
        newAccessToken,
        newRefreshToken
    }

}


const getUserFromToken =async function(id){

    const user=await User.findById(id)
        .select("+refreshToken");

    if(!user){

        throw new ApiError(
            401,
            "Authentication failed."
        )

    }

    return user;

}

const verifyToken=(token, secret, tokenType)=>{
    try {
        return jwt.verify(token, secret);
    } catch {
        throw new ApiError(
            401,
            `Invalid or expired ${tokenType}.`
        );
    }
}

const Auth = asyncHandler(async(req, res, next) => {
    const {accessToken,refreshToken} = req.cookies || {};
    
    if(!accessToken && !refreshToken){

        throw new ApiError(401,"User is not Logged In");

    }else if (accessToken) {
        const  decoded =  verifyToken(accessToken,process.env.JWT_ACCESS_TOKEN_SECRET,"access Token");
        const user = await getUserFromToken(decoded._id);
        req.user = user;
       
    }else{
        let decoded = verifyToken(refreshToken,process.env.JWT_REFRESH_TOKEN_SECRET,"refresh Token");
        const user = await getUserFromToken(decoded._id);

        if(refreshToken!==user.refreshToken){
            throw new ApiError(401,"Invalid or revoked refresh token.");
        }

        req.user = user;

        const {newAccessToken, newRefreshToken } =await  generateNewTokens(user);

        res.locals.accessToken = newAccessToken;
        res.locals.refreshToken = newRefreshToken;
        
    }

    next();
})

module.exports = Auth;

