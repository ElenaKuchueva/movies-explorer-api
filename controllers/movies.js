const Movie = require('../models/movie');
const { STATUS_CREATED } = require('../errors/err');

const BadRequest = require('../errors/badRequest');
const Forbidden = require('../errors/Forbidden');
const NotFound = require('../errors/notFound');

module.exports.getAllMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const owner = req.user._id;
  Movie.create({ owner, ...req.body })
    .then((movie) => res.status(STATUS_CREATED).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => {
      next(new NotFound('По указанному _id фильм не найденa'));
    })
    .then((movie) => {
      const owner = movie.owner.toString();
      if (req.user._id === owner) {
        movie
          .deleteOne(movie)
          .then(() => {
            res.send(movie);
          })
          .catch(next);
      } else {
        next(new Forbidden('Эта фильм другого пользователя'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
