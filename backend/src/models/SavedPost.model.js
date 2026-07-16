const mongoose= require('mongoose');

const savedPost = new mongoose.Schema({
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post',
        required:[true,"Post Id is required"]
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,"User id is required"]
    }
},{
    timestamps:true
});

savedPost.index({userId:1, postId:1},{unique:1})

const SavedPost= mongoose.model('SavedPost',savedPost);
module.exports= SavedPost;