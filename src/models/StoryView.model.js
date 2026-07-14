const mongooose = require('mongoose');

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
})

const StoryView = mongoose.model('StoryView',storyViewSchema);
module.exports = StoryView;