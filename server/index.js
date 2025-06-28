// index.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8000; // Choose a port for your server

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Allow the server to parse JSON in request bodies

// A simple test route to make sure the server is running
app.get('/', (req, res) => {
    res.json({ message: 'Hello from the server!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});