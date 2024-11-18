const Movie = require('../Models/movie.js');
const User = require('../Models/user.js');


const recommendMovies = async (userId) => {
    try {
        const user = await User.findById(userId).populate('ratedMovies.movie');
        if (!user) throw new Error('User not found');

        
        const favoriteGenres = user.preferences?.favoriteGenres || [];
        console.log('Favorite Genres:', favoriteGenres);

        const genreRecommendations = await Movie.find({
            genre: { $in: favoriteGenres }
        }).limit(10);
        console.log('Genre Recommendations:', genreRecommendations);

       
        const ratedMovieIds = user.ratedMovies.map((entry) => entry.movie._id);
        console.log('Rated Movie IDs:', ratedMovieIds);

        const similarRecommendations = await Movie.find({
            _id: { $nin: ratedMovieIds }, 
            genre: { $in: favoriteGenres }
        }).sort({ rating: -1 }); 
        console.log('Similar Recommendations:', similarRecommendations);

        return {
            genreRecommendations,
            similarRecommendations,
        };
    } catch (error) {
        console.error('Error in recommendMovies:', error.message);
        throw error;
    }
};


const getSimilarTitles = async (movieId) => {
    try {
        const movie = await Movie.findById(movieId);
        if (!movie) throw new Error('Movie not found');

        const genres = Array.isArray(movie.genre) ? movie.genre : [movie.genre];

        const similarTitles = await Movie.find({
            $or: [
                { genre: { $in: genres } },
                { director: movie.director }
            ],
            _id: { $ne: movieId } 
        });

        return similarTitles;
    } catch (error) {
        console.error('Error in getSimilarTitles:', error.message);
        throw new Error(error.message);
    }
};


const getTrendingMovies = async () => {
    try {
        const trendingMovies = await Movie.find()
            .sort({ views: -1 })
            .limit(10);
        return trendingMovies;
    } catch (error) {
        console.error('Error in getTrendingMovies:', error.message);
        throw error;
    }
};


const getTopRatedMovies = async () => {
    try {
        const topRatedMovies = await Movie.find()
            .sort({ rating: -1 })
            .limit(10);
        return topRatedMovies;
    } catch (error) {
        console.error('Error in getTopRatedMovies:', error.message);
        throw error;
    }
};


module.exports = {
    recommendMovies,
    getSimilarTitles,
    getTrendingMovies,
    getTopRatedMovies,
};
