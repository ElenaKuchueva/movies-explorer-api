const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { STATUS_CREATED } = require('../errors/err');

const BadRequest = require('../errors/badRequest');
const NotFound = require('../errors/notFound');
const Conflict = require('../errors/Conflict');

module.exports.getUserInfo = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => {
      next(new NotFound('По указанному _id пользователь не найден'));
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
}; //

module.exports.updateUserInfo = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      next(new NotFound('Пользователь по указанному _id не найден'));
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict('Пользователь с такой почтой зарегестрирован'));
      } else if (err.name === 'ValidationError') {
        next(
          new BadRequest('Переданы некорректные данные при обновлении профиля'),
        );
      } else {
        next(err);
      }
    });
};

module.exports.createNewUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash, // записываем хеш в базу
      name,
    }))
    .then((user) => res.status(STATUS_CREATED).send({
      _id: user._id,
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict('Пользователь с такой почтой зарегестрирован'));
      } else if (err.name === 'ValidationError') {
        next(
          new BadRequest(
            'Переданы некорректные данные при создании пользователя',
          ),
        );
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch(next);
};
