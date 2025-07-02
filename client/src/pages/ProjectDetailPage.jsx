import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectById, createList, createTask, updateTaskPosition, deleteTask } from '../services/api';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

function TaskCard({ task, index, onDelete }) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white p-3 rounded-md shadow-sm border border-gray-200 group relative"
        >
          <p className="text-sm text-gray-800">{task.name}</p>
          <button
            onClick={() => onDelete(task.id)}
            className="absolute top-1 right-1 w-6 h-6 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            title="Delete Task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      )}
    </Draggable>
  );
}

function AddTaskForm({ listId, onTaskCreated }) {
  const [taskName, setTaskName] = useState('');
  const { id: projectId } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskName.trim()) return;
    try {
      const response = await createTask(projectId, listId, taskName);
      onTaskCreated(listId, response.data);
      setTaskName('');
    } catch (error) {
      console.error("Failed to create task", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <input
        type="text"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder="+ Add a card"
        className="w-full px-2 py-1.5 border-2 border-transparent bg-transparent placeholder-gray-500 hover:bg-gray-300/60 focus:bg-white focus:border-indigo-500 rounded-md focus:outline-none text-sm"
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

  useEffect(() => {
    // ... (fetchProject function remains the same)
    const fetchProject = async () => {
      try {
        const response = await getProjectById(id);
        response.data.lists.sort((a, b) => a.position - b.position);
        response.data.lists.forEach(list => {
          list.tasks = list.tasks ? list.tasks.sort((a, b) => a.position - b.position) : [];
        });
        setProject(response.data);
      } catch {
        setError('Failed to fetch project details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleDragEnd = (result) => {
    // ... (handleDragEnd function remains the same)
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    const startList = project.lists.find(list => list.id === source.droppableId);
    const finishList = project.lists.find(list => list.id === destination.droppableId);
    const task = startList.tasks.find(t => t.id === draggableId);
    const newProjectState = { ...project };
    if (startList === finishList) {
      const newTasks = Array.from(startList.tasks);
      newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, task);
      const updatedList = { ...startList, tasks: newTasks };
      const listIndex = newProjectState.lists.findIndex(l => l.id === startList.id);
      newProjectState.lists[listIndex] = updatedList;
      setProject(newProjectState);
    } else {
      const startTasks = Array.from(startList.tasks);
      startTasks.splice(source.index, 1);
      const newStartList = { ...startList, tasks: startTasks };
      const finishTasks = Array.from(finishList.tasks);
      finishTasks.splice(destination.index, 0, task);
      const newFinishList = { ...finishList, tasks: finishTasks };
      const startListIndex = newProjectState.lists.findIndex(l => l.id === startList.id);
      const finishListIndex = newProjectState.lists.findIndex(l => l.id === finishList.id);
      newProjectState.lists[startListIndex] = newStartList;
      newProjectState.lists[finishListIndex] = newFinishList;
      setProject(newProjectState);
    }
    updateTaskPosition(draggableId, destination.droppableId, destination.index)
      .catch(err => {
        console.error("Failed to update task position on server", err);
      });
  };

  const handleCreateList = async (e) => {
    // ... (handleCreateList function remains the same)
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
    // ... (handleTaskCreated function remains the same)
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

  const handleDeleteTask = async (taskIdToDelete) => {
    // ... (handleDeleteTask function remains the same)
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskIdToDelete);
        setProject(currentProject => {
          const updatedLists = currentProject.lists.map(list => ({
            ...list,
            tasks: list.tasks.filter(task => task.id !== taskIdToDelete)
          }));
          return { ...currentProject, lists: updatedLists };
        });
      } catch (err) {
        console.error('Failed to delete task', err);
      }
    }
  };

  if (loading) return <p className="p-8">Loading project...</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-full mx-auto py-3 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-700">&larr; All Projects</Link>
              <span className="mx-2 text-gray-300">/</span>
              <h1 className="text-lg font-semibold text-gray-900">{project?.name}</h1>
            </div>
            {/* Future header controls can go here */}
          </div>
        </div>
      </header>
      
      <main className="p-4 sm:p-6 lg:p-8">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {project?.lists && project.lists.map(list => (
              <Droppable droppableId={list.id} key={list.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-gray-100 p-2 rounded-lg w-72 flex-shrink-0"
                  >
                    <h3 className="font-semibold text-gray-700 px-2 py-1 mb-2">{list.name}</h3>
                    <div className="space-y-2">
                      {list.tasks.map((task, index) => (
                        <TaskCard key={task.id} task={task} index={index} onDelete={handleDeleteTask} />
                      ))}
                      {provided.placeholder}
                    </div>
                    <AddTaskForm listId={list.id} onTaskCreated={handleTaskCreated} />
                  </div>
                )}
              </Droppable>
            ))}
            <div className="w-72 flex-shrink-0">
              <form onSubmit={handleCreateList} className="p-1">
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="+ Add another list"
                  className="bg-white/80 hover:bg-white placeholder-gray-500 w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
                  disabled={isCreatingList}
                />
              </form>
            </div>
          </div>
        </DragDropContext>
      </main>
    </div>
  );
}

export default ProjectDetailPage;
