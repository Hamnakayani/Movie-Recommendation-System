const express = require('express');
const router = express.Router();
const adminMiddleware = require('../Middleware/adminMiddleware');
const Movie = require('../Models/movie');
const User = require('../Models/user'); 


router.delete('/reviews/:movieId/:reviewId', adminMiddleware, async (req, res) => {
  try {
    const { movieId, reviewId } = req.params;


    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    const reviewIndex = movie.reviews.findIndex((review) => review._id.toString() === reviewId);
    if (reviewIndex === -1) return res.status(404).json({ message: 'Review not found' });

    movie.reviews.splice(reviewIndex, 1); 
    movie.totalReviews = movie.reviews.length; 
    movie.averageRating =
      movie.reviews.reduce((sum, review) => sum + review.rating, 0) / (movie.reviews.length || 1); 
    await movie.save();

    res.status(200).json({ message: 'Review deleted successfully', movie });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review', error: error.message });
  }
});


router.get('/statistics', adminMiddleware, async (req, res) => {
  try {
   
    const mostPopularMovies = await Movie.find().sort({ popularity: -1 }).limit(5).select('title popularity');

    
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });

    
    const totalMovies = await Movie.countDocuments();
    const totalReviews = await Movie.aggregate([
      { $unwind: '$reviews' },
      { $count: 'totalReviews' },
    ]);

    res.status(200).json({
      mostPopularMovies,
      totalUsers,
      totalAdmins,
      totalMovies,
      totalReviews: totalReviews[0]?.totalReviews || 0,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching site statistics', error: error.message });
  }
});



router.get('/insights', adminMiddleware, async (req, res) => {
  try {
    
    const trendingGenres = await Movie.aggregate([
      { $unwind: '$genre' },
      { $group: { _id: '$genre', popularity: { $sum: '$popularity' } } },
      { $sort: { popularity: -1 } },
      { $limit: 5 },
    ]);

   
    const mostSearchedActors = await Movie.aggregate([
      { $unwind: '$actorProfiles' },
      { $group: { _id: '$actorProfiles.actorName', popularity: { $sum: '$popularity' } } },
      { $sort: { popularity: -1 } },
      { $limit: 5 },
    ]);

   
    const engagementPatterns = await Movie.aggregate([
      {
        $project: {
          title: 1,
          reviewsCount: { $size: '$reviews' },
          popularity: 1,
        },
      },
      { $sort: { reviewsCount: -1, popularity: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json({
      trendingGenres,
      mostSearchedActors,
      engagementPatterns,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching insights', error: error.message });
  }
});

module.exports = router;
