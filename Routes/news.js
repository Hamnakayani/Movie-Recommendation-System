const express = require('express');
const router = express.Router();
const News = require('../Models/news');

// Route to fetch all news articles
router.get('/all', async (req, res) => {
  try {
    const news = await News.find().sort({ date: -1 }); // Sort by latest date
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching news articles', error: error.message });
  }
});

// Route to fetch news by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const news = await News.find({ category }).sort({ date: -1 });
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching news by category', error: error.message });
  }
});

// Route to add a news article (Admin only, for simplicity)
router.post('/', async (req, res) => {
  try {
    const { title, content, source, link, category } = req.body;
    const newArticle = new News({ title, content, source, link, category });
    await newArticle.save();
    res.status(200).json({ message: 'Article added successfully', article: newArticle });
  } catch (error) {
    res.status(500).json({ message: 'Error adding article', error: error.message });
  }
});

module.exports = router;
