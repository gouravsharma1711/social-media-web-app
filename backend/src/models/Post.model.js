const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
    postItems: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "PostItem"
            }
        ]
    },
    caption: {
        type: String,
        trim: true,
    },
    isCommentsOff: {
        type: Boolean,
        default: false
    },
    likesCount: {
        type: Number,
        default: 0
    },
    commentsCount: {
        type: Number,
        default: 0
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:[true,"CreatedBy is required"]
    }
}, {
    timestamps: true,
});


postSchema.index({createdBy:1});
postSchema.index({createdBy:1,createdAt:-1});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;