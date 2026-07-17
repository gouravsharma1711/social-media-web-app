const asyncHandler = (requestHandler)=>{
    return (req, res, next)=>{
        Promise
        .resolve(requestHandler(req,res,next))
        .catch((error)=>{
            console.log("error : ",error);
            

            res.status(error.statusCode || 500 ).json({
                ...error,
                message:error.message || "Internal Server Error"
            });
        })
    }
}

module.exports = asyncHandler;