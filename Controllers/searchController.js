const Movie = require('../Models/movie');


const searchMovies = async (req, res) => {
  try {
    const {
      title,
      genre,
      director,
      actor,
      ratingMin,
      ratingMax,
      popularityMin,
      popularityMax,
      releaseYear,
      releaseDecade,
      country,
      language,
      keywords
    } = req.query;

    
    const query = {};

    if (title) query.title = new RegExp(title, 'i'); 
    if (genre) query.genre = genre;
    if (director) query.director = new RegExp(director, 'i');
    if (actor) query.cast = { $in: [actor] };
    if (ratingMin || ratingMax) {
      query.rating = {};
      if (ratingMin) query.rating.$gte = parseFloat(ratingMin);
      if (ratingMax) query.rating.$lte = parseFloat(ratingMax);
    }
    if (popularityMin || popularityMax) {
      query.popularity = {};
      if (popularityMin) query.popularity.$gte = parseFloat(popularityMin);
      if (popularityMax) query.popularity.$lte = parseFloat(popularityMax);
    }
    if (releaseYear) query.releaseYear = releaseYear;
    if (releaseDecade) {
      const startYear = Math.floor(releaseDecade / 10) * 10;
      query.releaseYear = { $gte: startYear, $lt: startYear + 10 };
    }
    if (country) query.country = new RegExp(country, 'i');
    if (language) query.language = new RegExp(language, 'i');
    if (keywords) query.keywords = { $in: keywords.split(',') };

    const movies = await Movie.find(query).sort({ popularity: -1 }); 
    res.status(200).json(movies);
  } catch (error) {
    console.error('Error in searchMovies:', error.message);
    res.status(500).json({ message: 'Failed to search movies', error: error.message });
  }
};

// Get top movies of the month
const getTopMoviesOfTheMonth = async (req, res) => {
  try {
    const startOfMonth = new Date(new Date().setDate(1));
    const movies = await Movie.find({ createdAt: { $gte: startOfMonth } })
      .sort({ rating: -1 })
      .limit(10);
    res.status(200).json(movies);
  } catch (error) {
    console.error('Error in getTopMoviesOfTheMonth:', error.message);
    res.status(500).json({ message: 'Failed to fetch top movies of the month', error: error.message });
  }
};

// Get top movies by genre
const getTopMoviesByGenre = async (req, res) => {
  try {
    const { genre } = req.query;

    if (!genre) {
      return res.status(400).json({ message: 'Genre is required' });
    }

    const movies = await Movie.find({ genre: genre })
      .sort({ rating: -1 })
      .limit(10);
    res.status(200).json(movies);
  } catch (error) {
    console.error('Error in getTopMoviesByGenre:', error.message);
    res.status(500).json({ message: 'Failed to fetch top movies by genre', error: error.message });
  }
};

module.exports = {
  searchMovies,
  getTopMoviesOfTheMonth,
  getTopMoviesByGenre,
};
