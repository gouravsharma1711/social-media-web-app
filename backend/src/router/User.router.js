const express = require('express');
const userRouter = express.Router();
const Auth = require('../middleware/Auth.middleware');
const {
    userSignUp,
    userLogIn,
    userLogOut,
    updateUserPassword
} = require('../controller/User.controller')


userRouter.route('/users/signup').post(userSignUp);
userRouter.route('/users/login').post(userLogIn);
userRouter.route('/users/logout').post(Auth,userLogOut);
userRouter.route('/users/change-password').post(Auth,updateUserPassword);



module.exports = userRouter;