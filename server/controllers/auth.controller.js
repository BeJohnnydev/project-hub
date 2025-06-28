// server/controllers/auth.controller.js
const supabase = require('../supabaseClient');

// Controller for User Signup
const signupUser = async (req, res) => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            // If Supabase returns an error, send it to the client
            return res.status(400).json({ error: error.message });
        }

        // On success, Supabase sends a confirmation email.
        // The user object is in data.user
        res.status(201).json({ message: 'Signup successful! Please check your email to confirm.', user: data.user });

    } catch (error) {
        res.status(500).json({ error: 'An unexpected error occurred.' });
    }
};

// Controller for User Login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            return res.status(401).json({ error: error.message }); // 401 for unauthorized
        }

        // On success, data contains the session object, including the access_token
        res.status(200).json({ message: 'Login successful!', session: data.session });

    } catch (error) {
        res.status(500).json({ error: 'An unexpected error occurred.' });
    }
};

module.exports = { signupUser, loginUser };