//Routes/movies.js
const express = require('express');
const { getAllMovies, rateMovie, getMovieById ,addMovie,updateMovie,deleteMovie,getUpcomingReleases} = require('../Controllers/moviecontroller');
const authenticateJWT = require('../Middleware/authMiddleware');  // JWT auth middleware
const adminMiddleware = require('../Middleware/adminMiddleware'); 
const Movie = require('../Models/movie');
const router = express.Router();
router.get('/upcoming', getUpcomingReleases);
// Get all movies
router.get('/', getAllMovies);

// Get a movie by ID
router.get('/:id', getMovieById);
// router.get('/upcoming', getUpcomingReleases);
// Rate a movie
router.post('/rate', rateMovie);
// Admin routes for managing movies
router.post('/add', authenticateJWT, adminMiddleware, addMovie);
router.put('/update/:movieId', authenticateJWT, adminMiddleware, updateMovie);
router.delete('/delete/:movieId', authenticateJWT, adminMiddleware, deleteMovie);
router.get('/box-office/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const movie = await Movie.findById(id).select('title boxOffice'); 
  
      if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
      }
  
      res.status(200).json({ 
        title: movie.title, 
        boxOffice: movie.boxOffice 
      });
    } catch (error) {
      console.error('Error fetching box office details:', error.message);
      res.status(500).json({ 
        message: 'Error fetching box office details', 
        error: error.message 
      });
    }
  });
  
  // Route to fetch awards and nominations for a specific movie
  router.get('/awards/:movieId', async (req, res) => {
    try {
      const movie = await Movie.findById(req.params.movieId);
      if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
      }
  
      const awardsData = {
        awards: movie.awards,
        nominations: movie.nominations
      };
  
      res.status(200).json(awardsData);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching awards and nominations', error: error.message });
    }
  });
  
module.exports = router;
