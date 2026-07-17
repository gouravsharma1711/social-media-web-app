const express = require('express');
const userRouter = express.Router();
const Auth = require('../middleware/Auth.middleware');
const {randomFunction} = require('../controller/User.controller')

userRouter.route('/random').get(Auth,randomFunction);



module.exports = userRouter;