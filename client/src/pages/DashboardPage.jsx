import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProjects, createProject, deleteProject } from '../services/api';

function DashboardPage() {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    getProjects()
      .then(response => setProjects(response.data))
      .catch(_ => setError('Failed to fetch projects.'));
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    setIsCreating(true);
    setError(null);
    try {
      const response = await createProject(newProjectName);
      setProjects(prevProjects => [...prevProjects, response.data]);
      setNewProjectName('');
    } catch {
      setError('Failed to create project.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteProject = async (projectId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(projectId);
        setProjects(projects.filter(p => p.id !== projectId));
      } catch {
        setError('Failed to delete project.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">Project Hub</h1>
          <button
            onClick={logout}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6 pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Your Projects</h3>
            <div className="mt-3 sm:mt-0 sm:ml-4">
              <form onSubmit={handleCreateProject} className="flex gap-2">
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="  New project name..."
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  disabled={isCreating}
                />
                <button
                  type="submit"
                  disabled={isCreating}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                >
                  {isCreating ? '...' : 'Create'}
                </button>
              </form>
            </div>
          </div>
          
          {error && <p className="text-red-600 mb-4">{error}</p>}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.length > 0 ? (
              projects.map((project) => (
                <Link
                  to={`/project/${project.id}`}
                  key={project.id}
                  className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-medium text-gray-900 truncate">{project.name}</p>
                      <button
                        onClick={(e) => handleDeleteProject(project.id, e)}
                        className="text-gray-400 hover:text-red-500 p-1 rounded-full focus:outline-none"
                        title="Delete Project"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Created: {new Date(project.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">You don't have any projects yet. Create your first one!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;

