const mongoose = require('mongoose');

const MentionSchema = new mongoose.Schema({
    entityType:{
        type: String,
        enum:["comment","story","post"],
        required: [true, "Entity type is required"]
    },
    entityId:{
        type:mongoose.Schema.Types.ObjectId,
        required: [true, "Entity ID is required"]
    },
    mentionedUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: [true, "Mentioned user is required"]
    },
    mentionedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: [true, "Mentioned by user is required"]
    }
},{
    timestamps: true,
});

MentionSchema.index({mentionedUser:1,entityType:1,entityId:1});
MentionSchema.index({mentionedBy:1});

const Mention = mongoose.model('Mention', MentionSchema);
module.exports = Mention;