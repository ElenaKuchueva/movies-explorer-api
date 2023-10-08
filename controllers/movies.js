const Movie = require("../models/movie");
const { STATUS_CREATED } = require("../errors/err");

const BadRequest = require("../errors/badRequest");
const Forbidden = require("../errors/Forbidden");
const NotFound = require("../errors/notFound");

module.exports.getAllMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(() => {
      next(new NotFound("Фильмы не найдены"));
    });
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie
    .create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
      owner: req.user._id,
    })
    .then((movie) => res.status(STATUS_CREATED).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

// module.exports.createMovie = (req, res, next) => {
//   Movie.create({ owner: req.user._id, ...req.body })
//     .then((movie) => res.status(CREATED_STATUS).send(movie))
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         return next(
//           new BadRequest(
//             "Переданы некорректные данные при создании фильма!"
//           )
//         );
//       }
//       return next(err);
//     });
// };

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => {
      next(new NotFound("По указанному _id фильм не найденa"));
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
        next(new Forbidden("Эта фильм другого пользователя"));
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequest("Переданы некорректные данные"));
      } else {
        next(err);
      }
    });
};
