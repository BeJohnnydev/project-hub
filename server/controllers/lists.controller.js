// server/controllers/lists.controller.js
const supabase = require('../supabaseClient');

const createList = async (req, res) => {
  const { name } = req.body;
  const { projectId } = req.params;
  const { user } = req;

  if (!name) {
    return res.status(400).json({ error: 'List name is required.' });
  }

  try {
    // First, verify the user owns the project they're adding a list to
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .match({ id: projectId, user_id: user.id })
      .single();

    if (projectError || !projectData) {
      return res.status(404).json({ error: 'Project not found or you do not have permission.' });
    }

    // We need to get the current max position to place the new list at the end
    const { data: listsData, error: listsError } = await supabase
      .from('lists')
      .select('position')
      .eq('project_id', projectId)
      .order('position', { ascending: false })
      .limit(1)
      .single();

    if (listsError && listsError.code !== 'PGRST116') { // Ignore error for no rows found
        throw listsError;
    }

    const newPosition = listsData ? listsData.position + 1 : 0;

    const { data, error } = await supabase
      .from('lists')
      .insert([{ name, project_id: projectId, position: newPosition }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
};

module.exports = { createList };