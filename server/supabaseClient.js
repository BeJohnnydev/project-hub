// server/supabaseClient.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config(); // Load environment variables

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase URL or Key is missing from .env file");
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;