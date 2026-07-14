const mongoose = require('mongoose');

const interestSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Interest name is required"],
        trim:true,
    },
    slug:{
        type:String,
        required:[true,"Interest slug is required"],
        trim:true,
        unique:true,
    }
});

interestSchema.index({slug:1});

const Interest = mongoose.model('Interest',interestSchema);
module.exports = Interest;