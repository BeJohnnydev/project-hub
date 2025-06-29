// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProjects } from '../services/api'; 

function DashboardPage() {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState([]); // State to hold projects
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect runs when the component mounts
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getProjects();
        setProjects(response.data);
      } catch (err) {
        setError('Failed to fetch projects.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []); // The empty array [] means this effect runs only once

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {user?.email}!</p>
      <button onClick={logout}>Logout</button>
      <hr />
      <h3>My Projects</h3>
      {loading && <p>Loading projects...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {projects.map((project) => (
          <li key={project.id}>{project.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default DashboardPage;