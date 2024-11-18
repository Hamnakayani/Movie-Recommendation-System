//Routes/auth.js
const express = require('express');
const { registerUser, loginUser,loginWithToken } = require('../Controllers/authcontroller');
const authenticateJWT = require('../Middleware/authMiddleware');
const router = express.Router();

// Registration route
router.post('/register', registerUser);

// Login route
router.post('/login',  loginUser);

module.exports = router;
