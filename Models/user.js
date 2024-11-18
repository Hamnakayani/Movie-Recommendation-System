//Models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user', enum: ['user', 'admin'] } ,
  preferences: {
    favoriteGenres: [String],
    favoriteActors: [String],
  },
  ratedMovies: [
    {
        movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
        rating: { type: Number, min: 1, max: 5 },
    },],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
  createdLists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'List' }],
  reminders: [
    {
      movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
      
      isNotified: { type: Boolean, default: false }, 
    },
  ],
});

module.exports = mongoose.model('User', userSchema);
