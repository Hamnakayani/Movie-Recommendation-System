//Controllers/reviewController.js
const Movie = require('../Models/movie');

const addOrUpdateReview = async (req, res) => {
  try {
    const { movieId } = req.params; 
    const { rating, reviewText } = req.body; 
    const userId = req.user._id; 

    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    
    const existingReview = movie.reviews.find((review) => review.user.toString() === userId.toString());

    if (existingReview) {
    
      existingReview.rating = rating;
      existingReview.reviewText = reviewText;
    } else {
     
      const newReview = { user: userId, rating, reviewText };
      movie.reviews.push(newReview);
      movie.totalReviews += 1;
    }

    // Recalculate average rating
    const totalRating = movie.reviews.reduce((acc, review) => acc + review.rating, 0);
    movie.averageRating = totalRating / movie.reviews.length;

    // Recalculate popularity based on the number of reviews and average rating
    movie.popularity = movie.totalReviews * movie.averageRating;

    await movie.save();
    res.status(200).json({ message: 'Review added/updated successfully', movie });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add/update review' });
  }
};

const viewReviews = async (req, res) => {
  try {
    const { movieId } = req.params; // Movie ID from request

    const movie = await Movie.findById(movieId).populate('reviews.user', 'username'); // Populate to show usernames
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    // Sort reviews by rating first, then by likes
    const sortedReviews = movie.reviews.sort((a, b) => b.rating - a.rating || b.likes - a.likes);

    // Get the top-rated and most-discussed reviews
    const topRatedReview = sortedReviews[0]; // The highest-rated review
    const mostDiscussedReview = sortedReviews.find((review) => review.likes === Math.max(...sortedReviews.map(r => r.likes))); // Most liked review

    res.status(200).json({
      averageRating: movie.averageRating,
      totalReviews: movie.totalReviews,
      reviews: sortedReviews, 
      highlights: {
        topRatedReview,
        mostDiscussedReview,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve reviews' });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { movieId, reviewId } = req.params; 
    const userId = req.user._id; 

    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    // Find the review to delete
    const reviewIndex = movie.reviews.findIndex((review) => review._id.toString() === reviewId && review.user.toString() === userId.toString());
    if (reviewIndex === -1) return res.status(404).json({ message: 'Review not found or unauthorized' });

    movie.reviews.splice(reviewIndex, 1); 
    movie.totalReviews -= 1;

    // Recalculate average rating
    const totalRating = movie.reviews.reduce((acc, review) => acc + review.rating, 0);
    movie.averageRating = movie.reviews.length ? totalRating / movie.reviews.length : 0;

    
    movie.popularity = movie.totalReviews * movie.averageRating;

    await movie.save();
    res.status(200).json({ message: 'Review deleted successfully', movie });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete review' });
  }
};

  module.exports = { addOrUpdateReview, viewReviews, deleteReview };