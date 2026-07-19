const multer = require('multer');
const ApiError = require('../utils/ApiError');
const path = require('path')

const storage = multer.diskStorage({

    destination: function(req,file,cb){
        cb(null,'./public/temp')
    },
    filename: function(req,file, cb){
        const fileExtension = path.extname(file.originalname);
        cb(null,file.fieldname+'-'+Date.now()+fileExtension);
    }

})


const ALLOWED_MIME_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "video/mp4",
    "video/quicktime",
    "video/webm",
    "video/x-matroska"
]);

const fileFilter = (req, file, cb) => {
    console.log("File Type  : ",file.mimetype);
    
    if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
        return cb(null, true);
    }

    return cb(new ApiError(400, "Only images and videos are allowed."));
};

const uplord = multer({
    storage:storage,
    limits:{
        files:5,
        fileSize:100*1024*1024, // 100 MB
    },
    fileFilter
});


module.exports = uplord;