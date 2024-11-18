//Models/movie.js
const mongoose = require('mongoose');
// Review Schema
const reviewSchema = new mongoose.Schema({
  rating: { type: Number, min: 1, max: 5 },
  reviewText: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  likes: { type: Number, default: 0 }, 
});
// Movie Schema
const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: [String], required: true },
  director: { type: String, required: true },
  cast: { type: [String], required: true },
  releaseDate: { type: Date, required: true },
  runtime: { type: String, required: true },
  synopsis: { type: String, required: true },
  averageRating: { type: Number, default: 0, min: 0, max: 10 },
  totalReviews: { type: Number, default: 0 }, 
  popularity: { type: Number, default: 0 },
  reviews: [reviewSchema], 
  releaseYear: { type: Number },
  country: { type: String },
  language: { type: String },
  trivia: { type: [String] }, 
  goofs: { type: [String] }, 
  soundtrack: { type: [String] }, 
  actorProfiles: [
    {
      actorName: { type: String, required: true },
      bio: { type: String },
      awards: { type: [String] },
      filmography: { type: [String] },
    },
  ],
  directorProfile: {
    name: { type: String, required: true },
    bio: { type: String },
    awards: { type: [String] },
    filmography: { type: [String] },
  },
  ageRating: { type: String, required: true }, 
  parentalGuidance: { type: String },
  boxOffice: {
    openingWeekend: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    internationalRevenue: { type: Number, default: 0 }
  },
  awards: [
    {
      awardName: { type: String },
      year: { type: Number },
      category: { type: String },
      result: { type: String } 
    }
  ],
  nominations: [
    {
      awardName: { type: String },
      year: { type: Number },
      category: { type: String },
      result: { type: String } 
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);
