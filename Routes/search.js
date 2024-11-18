const express = require('express');
const {
  searchMovies,
  getTopMoviesOfTheMonth,
  getTopMoviesByGenre
} = require('../Controllers/searchController');
const router = express.Router();

// Search and filter movies
router.get('/search', searchMovies);

// Get top movies of the month
router.get('/top-of-the-month', getTopMoviesOfTheMonth);

// Get top 10 movies by genre
router.get('/top-by-genre', getTopMoviesByGenre);

module.exports = router;
