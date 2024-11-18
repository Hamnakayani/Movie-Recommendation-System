const express = require('express');
const router = express.Router();
const Discussion = require('../Models/Discussion');
const authenticateJWT = require('../Middleware/authMiddleware');

// Create a new discussion
router.post('/', authenticateJWT, async (req, res) => {
  try {
    const { title, description, category, relatedTo, relatedModel } = req.body;

    const newDiscussion = new Discussion({
      title,
      description,
      creator: req.user.id,
      category,
      relatedTo,
      relatedModel,
    });

    await newDiscussion.save();
    res.status(201).json({ message: 'Discussion created successfully', discussion: newDiscussion });
  } catch (error) {
    res.status(500).json({ message: 'Error creating discussion', error: error.message });
  }
});

// Fetch all discussions
router.get('/all', async (req, res) => {
  try {
    const discussions = await Discussion.find().populate('creator', 'username').sort({ createdAt: -1 });
    res.status(200).json(discussions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching discussions', error: error.message });
  }
});

// Fetch discussions by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const discussions = await Discussion.find({ category }).populate('creator', 'username').sort({ createdAt: -1 });
    res.status(200).json(discussions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching discussions by category', error: error.message });
  }
});

// Add a post to a discussion
router.post('/:id/posts', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const discussion = await Discussion.findById(id);
    if (!discussion) return res.status(404).json({ message: 'Discussion not found' });

    const newPost = { user: req.user.id, content };
    discussion.posts.push(newPost);

    await discussion.save();
    res.status(200).json({ message: 'Post added successfully', discussion });
  } catch (error) {
    res.status(500).json({ message: 'Error adding post', error: error.message });
  }
});

// Fetch posts in a discussion
router.get('/:id/posts', async (req, res) => {
  try {
    const { id } = req.params;

    const discussion = await Discussion.findById(id).populate('posts.user', 'username');
    if (!discussion) return res.status(404).json({ message: 'Discussion not found' });

    res.status(200).json(discussion.posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
});

module.exports = router;
