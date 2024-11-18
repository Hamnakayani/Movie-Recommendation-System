//Controllers/usercontroller.js
const User = require('../Models/user');
const Movie = require('../Models/movie');

// Update User Profile
const updateUserProfile = async (req, res) => {
  try {
    const { favoriteGenres, favoriteActors } = req.body;

    const updatedUser = await User.findByIdAndUpdate(req.user.id, {
      $set: { 'preferences.favoriteGenres': favoriteGenres, 'preferences.favoriteActors': favoriteActors }
    }, { new: true });

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add to Wishlist
const addToWishlist = async (req, res) => {
  try {
    const { movieId } = req.body;
    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    const user = await User.findById(req.user.id);
    user.wishlist.push(movieId);
    await user.save();

    res.status(200).json({ message: 'Movie added to wishlist' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const setReminder = async (req, res) => {
  try {
    const { userId, movieId, reminderDate } = req.body;

    // Check if reminder date is in the future
    if (new Date(reminderDate) <= new Date()) {
      return res.status(400).json({ message: 'Reminder date must be in the future' });
    }

    // Find user and add the reminder
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add reminder
    user.reminders.push({ movie: movieId, reminderDate });
    await user.save();

    return res.status(200).json({ message: 'Reminder set successfully' });
  } catch (error) {
    console.error('Error setting reminder:', error.message);
    return res.status(500).json({ error: 'Failed to set reminder' });
  }
};
module.exports = { updateUserProfile, getUserProfile, addToWishlist,setReminder };
