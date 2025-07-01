// server/controllers/projects.controller.js
const supabase = require('../supabaseClient');

const createProject = async (req, res) => {
    const { name } = req.body;
    // The user object is attached by our middleware
    const user = req.user;

    if (!name) {
        return res.status(400).json({ error: 'Project name is required.' });
    }

    try {
        // We don't need to specify the user_id here.
        // Because we set up a DEFAULT value of auth.uid() in our SQL schema,
        // Supabase will automatically assign the project to the authenticated user.
        const { data, error } = await supabase
            .from('projects')
            .insert([{ name: name }])
            .select() // .select() returns the newly created row
            .single(); // .single() returns it as an object instead of an array

        if (error) {
            // This could be a database error
            return res.status(400).json({ error: error.message });
        }

        res.status(201).json(data);

    } catch (error) {
        res.status(500).json({ error: 'An unexpected error occurred.' });
    }
};

const getProjects = async (req, res) => {
    const user = req.user;

    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*') // select all columns
            .eq('user_id', user.id); // where the user_id matches the logged-in user's id

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: 'An unexpected error occurred.' });
    }
};

const updateProject = async (req, res) => {
    const user = req.user;
    const { id } = req.params; // Get the project ID from the URL parameter
    const { name } = req.body; // Get the new name from the request body

    if (!name) {
        return res.status(400).json({ error: 'Project name is required for update.' });
    }

    try {
        const { data, error } = await supabase
            .from('projects')
            .update({ name: name })
            .match({ id: id, user_id: user.id }) // IMPORTANT: Match both project ID and user ID
            .select()
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Project not found or you do not have permission to update it.' });

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: 'An unexpected error occurred.' });
    }
};

const deleteProject = async (req, res) => {
    const user = req.user;
    const { id } = req.params;

    try {
        const { error } = await supabase
            .from('projects')
            .delete()
            .match({ id: id, user_id: user.id }); // Security check: Only delete if ID and user ID match

        if (error) throw error;

        // A successful deletion doesn't return data, so we send back a status code
        // 204 means "No Content", the standard for a successful deletion.
        res.status(204).send();

    } catch (error) {
        res.status(500).json({ error: 'An unexpected error occurred.' });
    }
};

const getProjectById = async (req, res) => {
  const { id } = req.params; // Get project ID from URL
  const { user } = req; // Get user from our auth middleware

  try {
    const { data, error } = await supabase
          .from('projects')
          .select(`
            *,
            lists (
              *,
              tasks ( * )
            )
          `) // This now fetches projects, their lists, and the tasks for each list
          .match({ id: id, user_id: user.id })
          .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Project not found or you do not have permission.' });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
};

module.exports = { createProject, getProjects, updateProject, deleteProject, getProjectById };