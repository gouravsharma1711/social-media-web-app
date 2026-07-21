const express = require('express');
const userRouter = express.Router();
const Auth = require('../middleware/Auth.middleware');
const isVerified = require('../middleware/isVerified.middleware.js')
const {
    userSignUp,
    userLogIn,
    userLogOut,
    updateUserPassword,
    updateUserPhoneNumber,
    getCurrentUser,
    updateUserProfilePic,
    requestForOtp,
    verifyOtp,
    updateUserEmail,
    verifyAccount,
} = require('../controller/User.controller')

const uplord = require('../middleware/multer.middleware');



userRouter.route('/signup').post(uplord.none(),userSignUp);
userRouter.route('/login').post(uplord.none(),userLogIn);
userRouter.route('/logout').post(Auth,userLogOut);
userRouter.route('/change-password').post(uplord.none(),Auth,isVerified,updateUserPassword);
userRouter.route('/update-phone-number').post(uplord.none(),Auth,updateUserPhoneNumber)
userRouter.route('/').get(Auth,getCurrentUser);
userRouter.route("/update-profile").post(uplord.single("profilePic"),Auth,updateUserProfilePic)
userRouter.route("/request-for-otp").post(uplord.none(),Auth,requestForOtp)
userRouter.route('/verify-otp').post(uplord.none(),Auth,verifyOtp);
userRouter.route('/verify').post(uplord.none(),Auth,verifyAccount);
userRouter.route('/update-email').post(uplord.none(),Auth,updateUserEmail);



module.exports = userRouter;