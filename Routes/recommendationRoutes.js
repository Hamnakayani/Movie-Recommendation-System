const express = require('express');
const authenticateJWT = require('../Middleware/authMiddleware');
const router = express.Router();
const {
    recommendMovies,
    getSimilarTitles,
    getTrendingMovies,
    getTopRatedMovies,
} = require('../Controllers/recommendationController.JS');


router.get('/recommendations/:userId', async (req, res) => {
    console.log('Fetching recommendations for:', req.params.userId);
    try {
        const recommendations = await recommendMovies(req.params.userId);
        console.log('Recommended Movies:', recommendations);
        res.status(200).json(recommendations);
    } catch (error) {
        console.error('Error fetching recommendations:', error.message);
        res.status(500).json({ message: error.message });
    }
});



router.get('/similar/:movieId', async (req, res) => {
    try {
        const similarTitles = await getSimilarTitles(req.params.movieId);
        res.status(200).json(similarTitles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to get trending movies
router.get('/trending', async (req, res) => {
    try {
        const trendingMovies = await getTrendingMovies();
        res.status(200).json(trendingMovies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to get top-rated movies
router.get('/top-rated', async (req, res) => {
    try {
        const topRatedMovies = await getTopRatedMovies();
        res.status(200).json(topRatedMovies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// **Add the homepage route here**
router.get('/homepage', authenticateJWT, async (req, res) => {
    try {
        const recommendations = await recommendMovies(req.user._id);
        const trendingMovies = await getTrendingMovies();
        const topRatedMovies = await getTopRatedMovies();
        res.status(200).json({
            recommendations,
            trendingMovies,
            topRatedMovies,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;
