const express = require('express');
const {
  createList,
  getUserLists,
  followList,
  getUserFollowedLists,
  getPublicLists,
  unfollowList
} = require('../Controllers/listController');
const authenticateJWT = require('../Middleware/authMiddleware');
const router = express.Router();

// Create a new list
router.post('/create', authenticateJWT, createList);

// Get all lists created by the user
router.get('/my-lists', authenticateJWT, getUserLists);

// Follow a list
router.post('/follow', authenticateJWT, followList);

// Get lists that the user is following
router.get('/followed-lists', authenticateJWT, getUserFollowedLists);

// Get public lists (to explore)
router.get('/public', getPublicLists);

// Unfollow a list
router.post('/unfollow', authenticateJWT, unfollowList);

module.exports = router;
