const userRouter = require('express').Router();

const { getUserInfo, updateUserInfo } = require('../controllers/users');
const { validationUpdateUser } = require('../middlewares/validation');

userRouter.get('/me', getUserInfo);
userRouter.patch('/me', validationUpdateUser, updateUserInfo);

module.exports = userRouter;
