const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post',
        required:[true,"Post Id is required"]
    },
    commentedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true,"commentedBy is required"]
    },
    parentCommentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment',
    },
    likesCount:{
        type:Number,
        default:0,
    },
    content:{
        type:String,
        required:[true,"Content of comment is required"],
        trim:true
    },

},{
    timestamps:true
})

const Comment = mongoose.model('Comment',commentSchema);
module.exports= commentSchema;