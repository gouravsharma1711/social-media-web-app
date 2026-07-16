const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Created by is required"]
    },
    items:{
        type:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'StoryItem'
        }]
    },

},{
    timestamps:true
})

storySchema.index({createdBy:1});

const Story = mongoose.model("Story", storySchema);
module.exports = Story;