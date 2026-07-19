const express = require('express');
const userRouter = express.Router();
const Auth = require('../middleware/Auth.middleware');
const {
    userSignUp,
    userLogIn,
    userLogOut,
    updateUserPassword,
    updateUserPhoneNumber,
    getCurrentUser,
    updateUserProfilePic
} = require('../controller/User.controller')

const uplord = require('../middleware/multer.middleware');



userRouter.route('/signup').post(uplord.none(),userSignUp);
userRouter.route('/login').post(uplord.none(),userLogIn);
userRouter.route('/logout').post(Auth,userLogOut);
userRouter.route('/change-password').post(uplord.none(),Auth,updateUserPassword);
userRouter.route('/update-phone-number').post(uplord.none(),Auth,updateUserPhoneNumber)
userRouter.route('/').get(Auth,getCurrentUser);
userRouter.route("/update-profile").post(uplord.single("profilePic"),Auth,updateUserProfilePic)



module.exports = userRouter;