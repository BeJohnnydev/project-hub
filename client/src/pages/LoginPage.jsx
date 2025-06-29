// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  // Create state variables to hold the email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  // Get the login function and loading state from our context
  const { login } = useAuth();
  const navigate = useNavigate(); // For navigation after login
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Start loading
    setError(null); // Clear previous errors

    try {
      // Call the login function from our api service
      const response = await login(email, password);
      navigate('/dashboard');
      // On success, the response object from axios is in response.data
      console.log('Login Successful!', response.data);
      // In a real app, we would save the token from response.data.session.access_token
      // and redirect the user to the dashboard.

    } catch (err) {
      // If the API call fails, axios throws an error
      console.error('Login failed:', err);
      // Set an error message to display to the user
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false); // Stop loading, whether successful or not
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading} // Disable input while loading
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading} // Disable input while loading
          />
        </div>
        {/* Display the error message if it exists */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;