const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
};

const refreshTokenExpiry = {
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days => 7 days * 24 hr * 60 mins * 60 sec * 1000 ms
}

const accessTokenExpiry = {
    maxAge: 24 * 60 * 60 * 1000 // 1 Day => 24hr * 60 min * 60 sec * 1000 ms
}

const isVerified = (req,res,next)=>{
    const user=req.user;
    
    if(user.isVerified){
        next();
    }else{
        let response = res.status(401)

        const { refreshToken, accessToken } = res.locals;

        if(accessToken && refreshToken){
            response
            .cookie("refreshToken", refreshToken, {
                ...cookieOptions,
                ...refreshTokenExpiry,
            })
            .cookie("accessToken", accessToken, {
                ...cookieOptions,
                ...accessTokenExpiry,
            });
        }

        return response.json({
            statusCode:401,
            message:"Access denied. Please verify your email address to unlock this feature.",
            data:null,
            error: {},
            success: false,
        })

    }

}

module.exports = isVerified;