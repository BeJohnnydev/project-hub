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

    module.exports = { createTask };
    