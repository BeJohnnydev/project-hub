// src/services/api.js
import axios from 'axios';

// Create an axios instance with a base URL for our backend
const apiClient = axios.create({
  baseURL: 'http://localhost:8000', // The address of our Node.js server
  headers: {
    'Content-Type': 'application/json',
  },
});

// We can define all our API calls as functions here
export const login = (email, password) => {
  return apiClient.post('/auth/login', { email, password });
};

// We will add more functions here later (e.g., for projects)