const mongoose = require("mongoose");

const followSchema = new mongoose.Schema({
    status:{
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        required: [true, "Status is required"]
    },
    userBeingFollowed:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User being followed is required"]
    },
    followedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Followed by is required"]
    }
},{
    timestamps: true
})


const Follow = mongoose.model("Follow", followSchema);
module.exports = Follow;