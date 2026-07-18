const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        unique: true,
        required: [true, "Username is required"],
        trim: true,
        minlength: [3, "Username must be at least 3 characters long"],
        maxlength: [30, "Username cannot exceed 30 characters"],
        match: [/^[a-zA-Z0-9_.]+$/, "Invalid username"]
    },
    fullName: {
        type: String,
        required: [true, "Full name is required"],
        trim: true,
        maxlength: [100, "Full name cannot exceed 100 characters"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        select: false,
        minlength: [8, "Password must be at least 8 characters long"],
        maxlength: [100, "Password cannot exceed 100 characters"]
    },
    phoneNo: {
        type: String,
        unique: true,
        required: [true, "Phone number is required"],
        trim: true,
        match: [/^[0-9]{6,15}$/, "Invalid phone number"]
    },
    countryCode: {
        type: String,
        required: [true, "Country code is required"],
        trim: true,
        match: [/^\+\d{1,4}$/, "Invalid country code"]
    },
    country: {
        type: String,
        required: [true, "Country is required"],
        trim: true
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: [true, "Gender is required"]
    },
    profileImage: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        trim: true,
        maxlength: [150, "Bio cannot exceed 150 characters"]
    },
    dob: {
        type: Date,
        required: [true, "Date of birth is required"],
        validate: {
            validator: function (value) {
                const today = new Date();
                const age = today.getFullYear() - value.getFullYear();

                return value <= today;
            },
            message: "Date of birth cannot be in the future"
        }
    },
    lastSeen: {
        type: Date,
    },
    accountType: {
        type: String,
        enum: ["creator", "normal"],
        default: "normal",
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    interests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Interest"
    }],
    refreshToken: {
        type: String,
        select: false
    },
    followersCount: {
        type: Number,
        default: 0
    },
    followingCount: {
        type: Number,
        default: 0
    },
    postCount: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true
});




userSchema.pre("save",async function () {
    if (!this.isModified("password")) {
        return;
    }

    this.password = await  bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword= async function(currPassword){
    return await bcrypt.compare(currPassword,this.password);
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
        },
        process.env.JWT_ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.JWT_ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            userName:this.userName,
            email:this.email
        },
        process.env.JWT_REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.JWT_REFRESH_TOKEN_EXPIRY
        }
    )
};


const User = mongoose.model("User", userSchema)
module.exports = User;
