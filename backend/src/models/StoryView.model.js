const mongoose = require("mongoose");

const storyViewSchema= new mongoose.Schema({
    viewedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true,"viewedBy is required"]
    },
    storyId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Story',
        required:[true,"storyId is required"]
    },
    itemId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'StoryItem',
        required:[true,"itemId is required"]
    }
},{
    timestamps:true
})


storyViewSchema.index({itemId:1,viewedBy:1},{unique:1});

const StoryView = mongoose.model('StoryView',storyViewSchema);
module.exports = StoryView;