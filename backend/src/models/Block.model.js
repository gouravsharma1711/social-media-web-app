const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema({
    blockBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    blockedUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
});

blockSchema.index({blockBy:1,blockedUser:1},{unique:1});

const Block = mongoose.model('Block', blockSchema);
module.exports = Block;