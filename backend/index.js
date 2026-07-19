require('dotenv').config();
const multer = require('multer');
const app = require('./src/app.js');
const connectToDb = require('./src/database/connectToDb.js');
const ApiError = require('./src/utils/ApiError.js');



const port = process.env.PORT;
app.listen(port,()=>{
    console.log(`Server Run on Port ${port}`);
    connectToDb();
})


app.use((err, req, res, next) => {

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    }

    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }

    return res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error",

    });
});