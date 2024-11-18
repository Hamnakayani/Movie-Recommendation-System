//Routes/reviews.js
const express = require('express');
const { addOrUpdateReview, viewReviews, deleteReview } = require('../Controllers/reviewController');
const authenticateJWT = require('../Middleware/authMiddleware');
const Movie = require('../Models/movie');

const adminMiddleware = require('../Middleware/adminMiddleware');
const router = express.Router();

// Add or update review
router.post('/:movieId/review', authenticateJWT, addOrUpdateReview);

// View all reviews for a movie
router.get('/:movieId/reviews', viewReviews);

// Delete a review
router.delete('/:movieId/review/:reviewId', authenticateJWT, deleteReview);
router.get('/reviews', authenticateJWT, adminMiddleware, async (req, res) => {
    try {
      const reviews = await Review.find().populate('user', 'username').sort({ createdAt: -1 });
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching reviews', error: error.message });
    }
  });

  router.delete('/reviews/:id', authenticateJWT, adminMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      await Review.findByIdAndDelete(id);
      res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting review', error: error.message });
    }
  });

  
  
module.exports = router;
