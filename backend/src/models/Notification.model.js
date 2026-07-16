const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    type:{
        type: String,
        required:[true, "Notification type is required"],
        enum:["follow","followRequest","followAccepted","like","comment","reply","mention","tag","storyLike","storyReply"],
    },
    entityType:{
        type:String,
        required:[true, "Entity type is required"],
        enum:["post","comment","story","user"]
    },
    entityId:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true, "Entity ID is required"]
    },
    isRead:{
        type:Boolean,
        default:false
    },
    msg:{
        type:String,
        default:"",

    },
    receiver:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:[true, "Receiver is required"]
    },
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:[true, "Sender is required"]
    }
},{timestamps:true});

NotificationSchema.pre('save', function(next){
    if(!this.msg){
        switch(this.type){
            case "follow": this.msg = "started following you"; 
            break;
            case "followRequest": this.msg = "sent you a follow request";
            break;
            case "followAccepted": this.msg = "accepted your follow request";
            break;
            case "like": this.msg = "liked your post";
            break;
            case "comment": this.msg = "commented on your post";
            break;
            case "reply": this.msg = "replied to your comment";
            break;
            case "mention": this.msg = "mentioned you in a post";
            break;
            case "tag": this.msg = "tagged you in a post";
            break;
            case "storyLike": this.msg = "liked your story";
            break;
        }
    }
    next();
});

NotificationSchema.index({sender:1});
NotificationSchema.index({receiver:1,createdAt:-1});
NotificationSchema.index({receiver:1,isRead:1});

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;