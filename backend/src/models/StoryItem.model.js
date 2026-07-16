const mongoose = require('mongoose');

const storyItemSchema = new mongoose.Schema({
    mediaUrl:{
        type:String,
        required:[true,"Media URL is required"],
        trim:true,
    },
    mediaType:{
        type:String,
        enum:["image","video"],
        default:'image',
        required:[true,"Media type is required"],
    },
    caption:{
        type:String,
        trim:true,
        minlength:[1,"Caption must be at least 1 character long"],
        maxlength:[500,"Caption cannot exceed 500 characters"],
    },
    viewCount:{
        type:Number,
        default:0,
    },
    likeCount:{
        type:Number,
        default:0
    },
    isForCloseFriends:{
        type:Boolean,
        default:false,
    },
    expiresAt:{
        type:Date,
        required:[true,"Expiration date is required"],
    },
},{
    timestamps:true,
})

storyItemSchema.index({
    expiresAt:1
})

const StoryItem = mongoose.model('StoryItem',storyItemSchema);
module.exports = StoryItem;