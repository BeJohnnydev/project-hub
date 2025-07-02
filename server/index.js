const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/projects.routes');
const listRoutes = require('./routes/lists.routes');
const taskRoutes = require('./routes/tasks.routes');

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/auth', authRoutes);
app.use('/api/projects', projectRoutes);

// Keep the nested routes for creation context
app.use('/api/projects/:projectId/lists', listRoutes);
app.use('/api/projects/:projectId/lists/:listId/tasks', taskRoutes); // This will now handle POST

// Add the new top-level route for task operations like DELETE and PUT
app.use('/api/tasks', taskRoutes);


app.get('/', (req, res) => {
    res.json({ message: 'Hello from the Project Hub server!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
