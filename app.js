//app.js
require('dotenv').config();  
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./Routes/auth');
const userRoutes = require('./Routes/users');
const movieRoutes = require('./Routes/movies');
const reviewRoutes = require('./Routes/reviews');
const listRoutes = require('./Routes/list'); 
const searchRoutes = require('./Routes/search');
const { notifyUsers } = require('./Controllers/notificationController');
const notificationRoutes = require('./Routes/notificationRoutes');
const newsRoutes = require('./Routes/news');
const discussionRoutes = require('./Routes/discussion');

const recommendationRoutes = require('./Routes/recommendationRoutes');
const authenticateJWT = require('./Middleware/authMiddleware');

const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);  
app.use('/api/users', authenticateJWT, userRoutes);  
app.use('/api/movies', authenticateJWT, movieRoutes);  
app.use('/api/reviews', authenticateJWT, reviewRoutes); 
app.use('/api/recommendations', authenticateJWT, recommendationRoutes);
app.use('/api/lists', authenticateJWT, listRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/discussions', discussionRoutes);
const adminRoutes = require('./Routes/admin');
app.use('/api/admin', authenticateJWT,adminRoutes);


setInterval(async () => {
  await notifyUsers();
}, 60 * 60 * 1000); 
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error(err));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
