//Routes/users.js
const express = require('express');
const { updateUserProfile, getUserProfile, addToWishlist } = require('../Controllers/usercontroller.js');
const router = express.Router();

// Update user profile
router.patch('/profile', updateUserProfile);

// Get user profile
router.get('/profile', getUserProfile);

// Add movie to wishlist
router.post('/wishlist', addToWishlist);

module.exports = router;
