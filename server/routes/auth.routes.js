// server/routes/auth.routes.js
const express = require('express');
const { signupUser, loginUser } = require('../controllers/auth.controller');
const router = express.Router();

// Define the routes
router.post('/signup', signupUser);
router.post('/login', loginUser);

module.exports = router;