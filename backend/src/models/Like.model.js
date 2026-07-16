const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
    likedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Liked by is required"]
    },
    type:{
        type: String,
        enum: ['post', 'comment','story'],
        required: [true, "Type is required"]
    },
    typeId:{
        type:mongoose.Schema.Types.ObjectId,
        required: [true, "Type ID is required"]
    },

},{
    timestamps: true
})

likeSchema.index({likedBy:1,type:1,typeId:1},{unique:true});

const Like = mongoose.model("Like", likeSchema);
module.exports = Like;