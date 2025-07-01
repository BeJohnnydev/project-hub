// server/index.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes'); // Import our auth routes
const projectRoutes = require('./routes/projects.routes');
const app = express();
const PORT = 8000;
const listRoutes = require('./routes/lists.routes');
const taskRoutes = require('./routes/tasks.routes');



// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/auth', authRoutes); // Use the auth routes for any path starting with /auth
app.use('/api/projects', projectRoutes);
app.use('/api/projects/:projectId/lists', listRoutes);
app.use('/api/projects/:projectId/lists/:listId/tasks', taskRoutes);



// A simple test route to make sure the server is running
app.get('/', (req, res) => {
    res.json({ message: 'Hello from the Project Hub server!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});