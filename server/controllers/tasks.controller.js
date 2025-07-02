    const supabase = require('../supabaseClient');

    const createTask = async (req, res) => {
      const { name } = req.body;
      const { listId } = req.params;
      const { user } = req; // From auth middleware

      if (!name) {
        return res.status(400).json({ error: 'Task name is required.' });
      }

      try {
        // To be secure, we must verify the user owns the project this list belongs to.
        // This is a more complex query that joins tables.
        const { data: listData, error: listError } = await supabase
          .from('lists')
          .select(`
            id,
            projects ( user_id )
          `)
          .eq('id', listId)
          .single();

        if (listError || !listData || listData.projects.user_id !== user.id) {
          return res.status(404).json({ error: 'List not found or you do not have permission.' });
        }

        // Get the current max position for the new task
        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select('position')
          .eq('list_id', listId)
          .order('position', { ascending: false })
          .limit(1)
          .single();
        
        if (tasksError && tasksError.code !== 'PGRST116') throw tasksError;
        
        const newPosition = tasksData ? tasksData.position + 1 : 0;

        // Now, create the task
        const { data, error } = await supabase
          .from('tasks')
          .insert([{ name, list_id: listId, position: newPosition }])
          .select()
          .single();

        if (error) throw error;
        res.status(201).json(data);

      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An unexpected error occurred.' });
      }
    };

    const updateTaskPosition = async (req, res) => {
      const { user } = req;
      const { taskId } = req.params;
      const { list_id, position } = req.body;

      try {
        // First, verify the user owns the task they are trying to move
        const { data: taskData, error: permError } = await supabase
          .from('tasks')
          .select('lists(projects(user_id))')
          .eq('id', taskId)
          .single();

        if (permError || !taskData || taskData.lists.projects.user_id !== user.id) {
          return res.status(404).json({ error: 'Task not found or permission denied.' });
        }

        // Update the task with the new list_id and position
        const { data, error } = await supabase
          .from('tasks')
          .update({ list_id, position })
          .eq('id', taskId)
          .select()
          .single();

        if (error) throw error;

        res.status(200).json(data);
      } catch (error) {
        console.error("Error updating task position:", error);
        res.status(500).json({ error: 'An unexpected error occurred.' });
      }
    };

     const deleteTask = async (req, res) => {
      const { user } = req;
      const { taskId } = req.params;

      try {
        // Security check: Verify the user owns the task they are trying to delete.
        const { data: taskData, error: permError } = await supabase
          .from('tasks')
          .select('id, lists(projects(user_id))')
          .eq('id', taskId)
          .single();

        if (permError || !taskData || taskData.lists.projects.user_id !== user.id) {
          return res.status(404).json({ error: 'Task not found or permission denied.' });
        }

        // If the check passes, delete the task.
        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', taskId);

        if (error) throw error;

        res.status(204).send(); // 204 No Content on successful deletion

      } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ error: 'An unexpected error occurred.' });
      }
    };

    module.exports = { createTask, updateTaskPosition, deleteTask };
