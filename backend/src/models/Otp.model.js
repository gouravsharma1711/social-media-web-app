const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const otpSchema= new mongoose.Schema({
    email :{
        type:String,
        required:[true,"email is required"],
        trim:true
    },
    otp:{
        type:String,
        required:[true,"Otp is required"]
    },
    expiresAt:{
        type:Date,
        required:[true,"expiresAt is required"]
    },
    purpose:{
        type:String,
        enum:["verification","emailUpdation"],
        required:[true,"otpFor is required"]
    }
},{
    timestamps:true
});

otpSchema.pre("save",async function(){
    if (!this.isModified("otp")) {
        return;
    }

    this.otp = await bcrypt.hash(this.otp, 10);
})

otpSchema.methods.compareOtp= async function(otp){
    return await bcrypt.compare(otp,this.otp);
}


otpSchema.index({expiresAt:1},{expireAfterSeconds:0});

const Otp = mongoose.model("Otp",otpSchema);
module.exports = Otp;