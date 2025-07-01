// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { useAuth } from '../context/AuthContext';
import { getProjects, createProject } from '../services/api';

function DashboardPage() {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  
  // State for the new project form
  const [newProjectName, setNewProjectName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Fetch projects when the component mounts
  useEffect(() => {
    getProjects()
      .then(response => {
        setProjects(response.data);
      })
      .catch(err => {
        setError('Failed to fetch projects.');
        console.error(err);
      });
  }, []); // The empty array [] means this effect runs only once

  // Handle the creation of a new project
  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return; // Don't create empty projects

    setIsCreating(true);
    setError(null); // Clear previous errors
    try {
      const response = await createProject(newProjectName);
      // Add the new project to our existing list in the UI for an instant update
      setProjects(prevProjects => [...prevProjects, response.data]);
      setNewProjectName(''); // Clear the input field
    } catch (err) {
      setError('Failed to create project.');
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Welcome, {user?.email}!</h1>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto mt-6 p-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">My Projects</h2>

          {/* Create New Project Form */}
          <form onSubmit={handleCreateProject} className="mb-6 flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Enter new project name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              disabled={isCreating}
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-300 whitespace-nowrap"
              disabled={isCreating}
            >
              {isCreating ? 'Creating...' : '+ Add Project'}
            </button>
          </form>

          {/* Display error if it exists */}
          {error && <p className="text-red-500 mb-4">{error}</p>}

          {/* Project List */}
          <div className="space-y-4">
            {projects.length > 0 ? (
              projects.map((project) => (
                // Each project is now a clickable Link that navigates to its detail page
                <Link to={`/project/${project.id}`} key={project.id}>
                  <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center hover:bg-gray-200 transition-colors cursor-pointer">
                    <p className="text-gray-900 font-semibold">{project.name}</p>
                    <span className="text-sm text-gray-500">Created: {new Date(project.created_at).toLocaleDateString()}</span>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500">You don't have any projects yet. Add one above!</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
