//Controllers/moviecontroller.js

const Movie = require('../Models/movie');
const authenticateJWT = require('../Middleware/authMiddleware');

// Get All Movies
const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Movie by ID
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Rate Movie
const rateMovie = async (req, res) => {
  try {
    const { movieId, rating } = req.body;
    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    movie.rating = (movie.rating + rating) / 2;  
    await movie.save();

    res.status(200).json({ message: 'Movie rated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const addMovie = async (req, res) => {
  try {
    const {
      title,
      genre,
      director,
      cast,
      releaseDate,
      runtime,
      synopsis,
      averageRating,
      trivia,
      goofs,
      soundtrack,
      actorProfiles,
      directorProfile,
      ageRating,
      parentalGuidance,
      boxOffice,
      awards,
      nominations
    } = req.body;

    
    if (!title || !genre || !director || !releaseDate || !runtime || !synopsis || !ageRating) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    
    const newMovie = new Movie({
      title,
      genre,
      director,
      cast,
      releaseDate,
      runtime,
      synopsis,
      averageRating: averageRating || 0,
      trivia: trivia || [],
      goofs: goofs || [],
      soundtrack: soundtrack || [],
      actorProfiles: actorProfiles || [],
      directorProfile,
      ageRating,
      parentalGuidance,
      boxOffice: boxOffice || { openingWeekend: 0, totalEarnings: 0, internationalRevenue: 0 },
      awards: awards || [],
      nominations: nominations || []
    });

    await newMovie.save();
    res.status(201).json({ message: 'Movie added successfully', movieId: newMovie._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to add movie' });
  }
};


  const updateMovie = async (req, res) => {
    try {
      const { movieId } = req.params;
      const updateData = req.body;
  
      const updatedMovie = await Movie.findByIdAndUpdate(movieId, updateData, { new: true });
  
      if (!updatedMovie) {
        return res.status(404).json({ message: 'Movie not found' });
      }
  
      res.status(200).json({ message: 'Movie updated successfully', movie: updatedMovie });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update movie' });
    }
  };
  const deleteMovie = async (req, res) => {
    try {
      const { movieId } = req.params;
  
      const deletedMovie = await Movie.findByIdAndDelete(movieId);
  
      if (!deletedMovie) {
        return res.status(404).json({ message: 'Movie not found' });
      }
  
      res.status(200).json({ message: 'Movie deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete movie' });
    }
  };
  const addReviewToMovie = async (req, res) => {
    try {
      const { movieId } = req.params;
      const { review, rating } = req.body; 
      
      // Find the movie by ID
      const movie = await Movie.findById(movieId);
      if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
      }
  
      
      movie.reviews.push({ review, rating, user: req.user.id });
      await movie.save();
  
      return res.status(201).json({ message: 'Review added successfully', movie });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error adding review' });
    }
  };
  
  const getUpcomingReleases = async (req, res) => {
    try {
      
      const currentDate = new Date();
  
      
      const upcomingMovies = await Movie.find({ releaseDate: { $gt: currentDate } })
                                        .sort({ releaseDate: 1 }) 
                                        .limit(10);
  
      if (upcomingMovies.length === 0) {
        return res.status(404).json({ message: 'No upcoming releases found' });
      }
  
      return res.status(200).json(upcomingMovies);
    } catch (error) {
      console.error('Error fetching upcoming movies:', error.message);
      return res.status(500).json({ error: 'Failed to fetch upcoming movies' });
    }
  };
  
module.exports = { getAllMovies, getMovieById, rateMovie,addMovie,updateMovie,deleteMovie,addReviewToMovie,getUpcomingReleases };
