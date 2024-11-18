const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const discussionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  relatedTo: { type: mongoose.Schema.Types.ObjectId, refPath: 'relatedModel' }, 
  relatedModel: { type: String, enum: ['Movie', 'Actor'] },
  posts: [postSchema], 
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Discussion', discussionSchema);
