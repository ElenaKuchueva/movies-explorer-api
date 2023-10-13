const mongoose = require('mongoose');
const validator = require('validator');
// const bcrypt = require('bcryptjs');
// const Unauthorized = require('../errors/Unauthorized');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    unique: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный формат ссылки',
    },
    required: true,
  },
  trailerLink: {
    type: String,
    unique: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный формат ссылки',
    },
    required: true,
  },
  thumbnail: {
    type: String,
    unique: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный формат ссылки',
    },
    required: true,
  },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
