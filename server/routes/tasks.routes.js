    const express = require('express');
    const { createTask } = require('../controllers/tasks.controller');
    const authenticateToken = require('../middleware/auth.middleware');
    
    // `mergeParams: true` is essential for accessing :projectId from the parent router
    const router = express.Router({ mergeParams: true });

    router.post('/', authenticateToken, createTask);

    module.exports = router;
    
    