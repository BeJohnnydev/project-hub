const express = require('express');
const { createList } = require('../controllers/lists.controller');
const authenticateToken = require('../middleware/auth.middleware');
const router = express.Router({ mergeParams: true });

router.post('/', authenticateToken, createList);

module.exports = router;