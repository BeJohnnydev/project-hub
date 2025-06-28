// server/routes/projects.routes.js
const express = require('express');
const { createProject, getProjects, updateProject, deleteProject } = require('../controllers/projects.controller');
const authenticateToken = require('../middleware/auth.middleware');
const router = express.Router();

// Any request to this router will first be checked by our middleware
// This is a protected route.
router.post('/', authenticateToken, createProject);
router.get('/', authenticateToken, getProjects);
router.put('/:id', authenticateToken, updateProject);
router.delete('/:id', authenticateToken, deleteProject);

module.exports = router;