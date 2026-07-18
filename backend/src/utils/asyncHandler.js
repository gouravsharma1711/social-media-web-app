const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise
            .resolve(requestHandler(req, res, next))
            .catch((error) => {

                const response = Object.keys(error).length === 0? 
                {
                    statusCode:error.statusCode ||  500,
                    error: {},
                    success: false,
                    data: null,
                    message:error.message || "Internal Server Error",
                }
                : {
                    ...error,
                    message:error.message
                };

                res.status(response.statusCode || 500).json(response);
            })
    }
}

module.exports = asyncHandler;