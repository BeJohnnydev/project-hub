import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectById, createList, createTask, updateTaskPosition } from '../services/api';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

// Sub-component for a single task card
function TaskCard({ task, index }) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white p-3 rounded-md shadow-sm border border-gray-200"
        >
          <p>{task.name}</p>
        </div>
      )}
    </Draggable>
  );
}

// Sub-component for the "Add Task" form within each list
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
      onTaskCreated(listId, response.data); // Notify parent of the new task
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
        className="w-full p-2 border-2 border-transparent focus:border-blue-500 rounded-md focus:outline-none bg-gray-200 hover:bg-gray-300"
      />
    </form>
  );
}

// The main page component
function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newListName, setNewListName] = useState('');
  const [isCreatingList, setIsCreatingList] = useState(false);

  // Fetch all project data when the page loads
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await getProjectById(id);
        // Ensure lists and tasks are sorted by their position
        response.data.lists.sort((a, b) => a.position - b.position);
        response.data.lists.forEach(list => {
          list.tasks = list.tasks ? list.tasks.sort((a, b) => a.position - b.position) : [];
        });
        setProject(response.data);
      } catch (err) {
        setError('Failed to fetch project details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  // This function is called when a drag operation ends
  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const startList = project.lists.find(list => list.id === source.droppableId);
    const finishList = project.lists.find(list => list.id === destination.droppableId);
    const task = startList.tasks.find(t => t.id === draggableId);

    // --- Optimistic UI Update ---
    // This updates the UI instantly without waiting for the API call to finish.
    const newProjectState = { ...project };

    // Case 1: Reordering in the same list
    if (startList === finishList) {
      const newTasks = Array.from(startList.tasks);
      newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, task);
      const updatedList = { ...startList, tasks: newTasks };
      const listIndex = newProjectState.lists.findIndex(l => l.id === startList.id);
      newProjectState.lists[listIndex] = updatedList;
      setProject(newProjectState);
    } else {
      // Case 2: Moving to a different list
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
    
    // --- API Call ---
    // Persist the change to the backend.
    updateTaskPosition(draggableId, destination.droppableId, destination.index)
      .catch(err => {
        console.error("Failed to update task position on server", err);
        // In a real app, you might revert the state here to show an error to the user.
      });
  };
  
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
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
        <div className="max-w-full mx-auto">
          <Link to="/dashboard" className="text-blue-500 hover:underline mb-4 inline-block">&larr; Back to Dashboard</Link>
          <h1 className="text-3xl font-bold">{project?.name}</h1>
          <hr className="my-6" />
          <div className="flex gap-6 overflow-x-auto pb-4 items-start">
            {project?.lists && project.lists.map(list => (
              <Droppable droppableId={list.id} key={list.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-gray-200 p-3 rounded-lg w-72 flex-shrink-0"
                  >
                    <h3 className="font-bold text-gray-800 px-1 mb-3">{list.name}</h3>
                    <div className="space-y-3">
                      {list.tasks.map((task, index) => (
                        <TaskCard key={task.id} task={task} index={index} />
                      ))}
                      {provided.placeholder}
                    </div>
                    <AddTaskForm listId={list.id} onTaskCreated={handleTaskCreated} />
                  </div>
                )}
              </Droppable>
            ))}
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
    </DragDropContext>
  );
}

export default ProjectDetailPage;
