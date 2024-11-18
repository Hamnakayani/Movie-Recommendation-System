const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  source: { type: String, required: true },
  link: { type: String, required: true }, 
  date: { type: Date, default: Date.now },
  category: { type: String, enum: ['movie', 'actor', 'project', 'industry'], required: true }, 
});

module.exports = mongoose.model('News', newsSchema);
