const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  shared: { type: Boolean, default: true }, 
}, { timestamps: true });

module.exports = mongoose.model('List', listSchema);
