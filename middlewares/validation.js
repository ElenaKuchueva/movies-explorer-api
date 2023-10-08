const { celebrate, Joi } = require("celebrate");

const urlRegex =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
const emailRegex = /[a-zA-Z0-9_.]+@[a-zA-Z0-9_]+\\.[a-z]{2,}/;

// auth
const validationCreateNewUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      // .email({ tlds: { allow: false } }),
      .pattern(emailRegex),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
  }),
});

const validationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      // .email({ tlds: { allow: false } }),
      .pattern(emailRegex),
    password: Joi.string().required(),
  }),
});

// user
const validationUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string()
      .required()
      // .email({ tlds: { allow: false } }),
      .pattern(emailRegex),
  }),
});

// movie
const validationCreateNewMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.number().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(urlRegex),
    trailerLink: Joi.string().required().regex(urlRegex),
    thumbnail: Joi.string().required().regex(urlRegex),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const validationDeleteMovie = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  validationCreateNewUser,
  validationLogin,
  validationUpdateUser,
  validationCreateNewMovie,
  validationDeleteMovie,
};
