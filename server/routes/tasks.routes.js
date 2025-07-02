const express = require('express');
const { createTask, updateTaskPosition, deleteTask } = require('../controllers/tasks.controller');
const authenticateToken = require('../middleware/auth.middleware');

// No longer needs mergeParams since it's not a nested route for all methods
const router = express.Router();

// Note: The createTask and updateTaskPosition routes will need to be adjusted
// if we move away from nesting completely, but for now we focus on the delete fix.
// We will create a new route for delete.
router.delete('/:taskId', authenticateToken, deleteTask);
router.put('/:taskId', authenticateToken, updateTaskPosition);


// We will leave the POST route on the nested router for now
// to avoid breaking the create functionality.

module.exports = router;