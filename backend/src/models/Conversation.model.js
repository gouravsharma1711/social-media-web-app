const mongoose = require('mongoose');

const conversationSchema= new mongoose.Schema({
    lastMsg:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Msg',
        required:['true',"last Msg is Required"],
        default:null
    },
    participants:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    groupAdmin:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    conversationType :{
        type:String,
        enum:['private','group'],
        default:'private'
    },
    groupName:{
        type:String,
    },
    groupImage:{
        type:String
    }
},{
    timestamps:true
})

conversationSchema.index({participants:1});
conversationSchema.index({lastMsg:1});

const Conversation = mongoose.model('Conversation',conversationSchema);
module.exports= Conversation;