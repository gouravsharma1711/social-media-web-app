const mongoose = require("mongoose");


const msgSchema = new mongoose.Schema({
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Sender is required"]
    },
    text:{
        type: String,
        trim: true,
        required: [true, "Text is required"]
    },
    seen:{
        type: Boolean,
        default: false
    },
    delivered:{
        type: Boolean,
        default: false
    },
    conversationId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: [true, "Conversation ID is required"]
    }
},{
    timestamps:true
})

msgSchema.index({sender:1});
msgSchema.index({conversationId:1,createdAt:1});

const Msg = mongoose.model("Msg", msgSchema);
module.exports = Msg;