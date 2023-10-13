const router = require('express').Router();

const { createNewUser, login } = require('../controllers/users');

const userRouter = require('./users');
const movieRouter = require('./movies');

const auth = require('../middlewares/auth');

const { validationCreateNewUser, validationLogin } = require('../middlewares/validation');

const NotFound = require('../errors/notFound');

router.post('/signup', validationCreateNewUser, createNewUser);
router.post('/signin', validationLogin, login);

router.use(auth);

router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use('*', (req, res, next) => {
  next(new NotFound('Страница не найдена'));
});

module.exports = router;
 