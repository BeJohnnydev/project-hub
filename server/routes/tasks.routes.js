 const express = require('express');
    const { createTask, updateTaskPosition, deleteTask } = require('../controllers/tasks.controller');
    const authenticateToken = require('../middleware/auth.middleware');
    
    const router = express.Router({ mergeParams: true });

    // The route for creating a task is POST to the base /
    router.post('/', authenticateToken, createTask);

    // The route for updating a task is PUT to /:taskId
    router.put('/:taskId', authenticateToken, updateTaskPosition);

    router.delete('/:taskId', authenticateToken, deleteTask);

    module.exports = router;