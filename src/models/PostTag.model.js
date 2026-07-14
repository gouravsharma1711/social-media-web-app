const mongoose = require('mongoose');

const postTagSchema= new mongoose.Schema({
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post',
        required:[true,"post is required"]
    },
    taggedUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true,"taggedUser is required"]
    },
    taggedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true,"taggedUser is required"]
    },
},{
    timestamps:true
})

const PostTag = mongoose.model('PostTag',postTagSchema);
module.exports= PostTag;