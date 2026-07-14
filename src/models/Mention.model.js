const mongoose = require('mongoose');

const MentionSchema = new mongoose.Schema({
    entityType:{
        type: String,
        enum:["comment","story","post"],
        required: [true, "Entity type is required"]
    },
    entityId:{
        type:String,
        required: [true, "Entity ID is required"]
    },
    mentionedUsed:{
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


const Mention = mongoose.model('Mention', MentionSchema);
module.exports = Mention;