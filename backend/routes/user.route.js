const express = require('express');
const { register, login, profile, updateUser, getMe } = require('../controller/user.controller.js');
const { isAuthenticated } = require('../middlewares/isAuthenticated.js');
const { upload } = require('../middlewares/upload.middleware.js');

const userRouter = express.Router();


userRouter.post('/register', register);
userRouter.post('/login', login);
// userRouter.patch('/profile', isAuthenticated, profile);
userRouter.post('/profile', isAuthenticated, upload.single('resume'), profile);
userRouter.patch('/update', isAuthenticated, updateUser);
userRouter.get('/me', isAuthenticated, getMe);


module.exports = { userRouter };