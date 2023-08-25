const movieRouter = require('express').Router();

const { getAllMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { validationCreateNewMovie, validationDeleteMovie } = require('../middlewares/validation');

movieRouter.get('/', getAllMovies);
movieRouter.post('/', validationCreateNewMovie, createMovie);
movieRouter.delete('/:movieId', validationDeleteMovie, deleteMovie);

module.exports = movieRouter;
