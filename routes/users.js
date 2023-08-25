const userRouter = require('express').Router();

const { getUserInfo, updateUserInfo } = require('../controllers/users');
const { validationGetUserInfo, validationUpdateUser } = require('../middlewares/validation');

userRouter.get('/me', validationGetUserInfo, getUserInfo);
userRouter.patch('/me', validationUpdateUser, updateUserInfo);

module.exports = userRouter;
