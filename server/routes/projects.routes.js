// server/routes/projects.routes.js
const express = require('express');
const authenticateToken = require('../middleware/auth.middleware');
const router = express.Router();
const { createProject, getProjects, updateProject, deleteProject, getProjectById } = require('../controllers/projects.controller');


// Any request to this router will first be checked by our middleware
// This is a protected route.

router.post('/', authenticateToken, createProject);
router.get('/', authenticateToken, getProjects);
router.get('/:id', authenticateToken, getProjectById);
router.put('/:id', authenticateToken, updateProject);
router.delete('/:id', authenticateToken, deleteProject);

module.exports = router;