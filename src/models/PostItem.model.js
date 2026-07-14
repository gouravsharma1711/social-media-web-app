const mongoose = require("mongoose");

const postItemSchema = new mongoose.Schema({
    postId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: [true, "Post ID is required"]
    },
    itemUrl:{
        type: String,
        trim: true,
        required: [true, "Item URL is required"]
    },
    compressedUrl:{
        type: String,
        trim: true,
        required: [true, "Compressed URL is required"]
    },
    itemType:{
        type: String,
        enum: ["image", "video"],
        required: [true, "Item type is required"]
    },
},{
    timestamps: true,
})


const PostItem = mongoose.model("PostItem", postItemSchema);
module.exports = PostItem;