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

const SavedPost= mongoose.model('SavedPost',savedPost);
module.exports= SavedPost;