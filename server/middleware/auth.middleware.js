// server/middleware/auth.middleware.js
const supabase = require('../supabaseClient');

const authenticateToken = async (req, res, next) => {
    // 1. Get the token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format is "Bearer TOKEN"

    if (token == null) {
        return res.sendStatus(401); // No token, unauthorized
    }

    try {
        // 2. Verify the token with Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(403).json({ error: 'Invalid or expired token.' }); // Token is bad, forbidden
        }

        // 3. Attach the user object to the request for later use
        req.user = user;

        // 4. Move on to the next function (the actual endpoint logic)
        next();

    } catch (error) {
        res.status(500).json({ error: 'An unexpected error occurred during authentication.' });
    }
};

module.exports = authenticateToken;