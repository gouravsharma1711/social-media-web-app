const express = require('express');
const userRouter = require('./router/User.router');
const app= express();
const cookieParser = require('cookie-parser');

app.use(cookieParser())


app.use('/api/v1/',userRouter);




module.exports = app;