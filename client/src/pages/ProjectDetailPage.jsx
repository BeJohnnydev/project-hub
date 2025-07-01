import React, { useState, useEffect } from 'react';
    import { useParams, Link } from 'react-router-dom';
    import { getProjectById, createList, createTask } from '../services/api';

    // A new component for the task card itself
    function TaskCard({ task }) {
      return (
        <div className="bg-white p-3 rounded-md shadow-sm border border-gray-200">
          <p>{task.name}</p>
        </div>
      );
    }

    // A new component for the "Add Task" form
    function AddTaskForm({ listId, onTaskCreated }) {
      const [taskName, setTaskName] = useState('');
      const [isCreating, setIsCreating] = useState(false);
      const { id: projectId } = useParams();

      const handleSubmit = async (e) => {
        e.preventDefault();
        if (!taskName.trim()) return;
        setIsCreating(true);
        try {
          const response = await createTask(projectId, listId, taskName);
          onTaskCreated(listId, response.data); // Notify parent component of new task
          setTaskName('');
        } catch (error) {
          console.error("Failed to create task", error);
        } finally {
          setIsCreating(false);
        }
      };

      return (
        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="+ Add a card"
            className="w-full p-2 border-2 border-transparent focus:border-blue-500 rounded-md focus:outline-none"
          />
        </form>
      );
    }


    function ProjectDetailPage() {
      const { id } = useParams();
      const [project, setProject] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [newListName, setNewListName] = useState('');
      const [isCreatingList, setIsCreatingList] = useState(false);

      const fetchProject = async () => {
        try {
          const response = await getProjectById(id);
          // Sort lists and tasks by position
          response.data.lists.sort((a, b) => a.position - b.position);
          response.data.lists.forEach(list => {
            list.tasks.sort((a, b) => a.position - b.position);
          });
          setProject(response.data);
        } catch (err) {
          setError('Failed to fetch project details.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      useEffect(() => {
        fetchProject();
      }, [id]);

      const handleCreateList = async (e) => {
        e.preventDefault();
        if (!newListName.trim()) return;
        setIsCreatingList(true);
        try {
          const response = await createList(id, newListName);
          setProject(p => ({ ...p, lists: [...p.lists, { ...response.data, tasks: [] }] }));
          setNewListName('');
        } catch (err) {
          console.error('Failed to create list:', err);
        } finally {
          setIsCreatingList(false);
        }
      };
      
      const handleTaskCreated = (listId, newTask) => {
        setProject(currentProject => {
            const updatedLists = currentProject.lists.map(list => {
                if (list.id === listId) {
                    return { ...list, tasks: [...list.tasks, newTask] };
                }
                return list;
            });
            return { ...currentProject, lists: updatedLists };
        });
      };

      if (loading) return <p className="p-8">Loading project...</p>;
      if (error) return <p className="p-8 text-red-500">{error}</p>;

      return (
        <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
          <div className="max-w-full mx-auto">
            <Link to="/dashboard" className="text-blue-500 hover:underline mb-4 inline-block">&larr; Back to Dashboard</Link>
            <h1 className="text-3xl font-bold">{project?.name}</h1>
            
            <hr className="my-6" />

            <div className="flex gap-6 overflow-x-auto pb-4 items-start">
              {/* Display the lists and tasks */}
              {project?.lists && project.lists.map(list => (
                <div key={list.id} className="bg-gray-200 p-3 rounded-lg w-72 flex-shrink-0">
                  <h3 className="font-bold text-gray-800 px-1 mb-3">{list.name}</h3>
                  <div className="space-y-3">
                    {list.tasks.map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                  <AddTaskForm listId={list.id} onTaskCreated={handleTaskCreated} />
                </div>
              ))}

              {/* Form to create a new list */}
              <div className="w-72 flex-shrink-0">
                 <form onSubmit={handleCreateList} className="p-2">
                    <input
                      type="text"
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      placeholder="+ Add another list"
                      className="bg-gray-300/50 hover:bg-gray-300/80 placeholder-gray-600 w-full p-2 rounded-md focus:outline-none"
                      disabled={isCreatingList}
                    />
                  </form>
              </div>
            </div>
          </div>
        </div>
      );
    }

    export default ProjectDetailPage;
    