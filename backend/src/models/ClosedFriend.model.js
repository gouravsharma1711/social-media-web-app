const mongoose = require("mongoose");

const closedFriendSchema = new mongoose.Schema({
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Owner ID is required"]
    },
    friend:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Friend ID is required"]
    }
},{
    timestamps: true,
})

closedFriendSchema.index({owner:1,friend:1},{unique:1});

const ClosedFriend = mongoose.model("ClosedFriend", closedFriendSchema);
module.exports = ClosedFriend;