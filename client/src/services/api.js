// src/services/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
});

// This is an "interceptor". It runs before every request.
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = (email, password) => {
  return apiClient.post('/auth/login', { email, password });
};

// New function to get projects
export const getProjects = () => {
  return apiClient.get('/api/projects');
};

export const createProject = (name) => {
  return apiClient.post('/api/projects', { name });
};

export const getProjectById = (id) => {
  return apiClient.get(`/api/projects/${id}`);
};

export const createList = (projectId, name) => {
  return apiClient.post(`/api/projects/${projectId}/lists`, { name });
};

export const createTask = (projectId, listId, name) => {
        return apiClient.post(`/api/projects/${projectId}/lists/${listId}/tasks`, { name });
    };

export const updateTaskPosition = (taskId, listId, position) => {
  return apiClient.put(`/api/tasks/${taskId}`, { list_id: listId, position });
}

export const deleteProject = (id) => {
  return apiClient.delete(`/api/projects/${id}`);
};

export const deleteTask = (taskId) => {
      return apiClient.delete(`/api/tasks/${taskId}`);
    };