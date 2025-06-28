// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin } from '../services/api'; // Rename to avoid naming conflict

// 1. Create the Context
const AuthContext = createContext(null);

// 2. Create the Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // To check initial auth status

  // On initial load, check localStorage for a token
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      // Here you would typically also fetch the user profile with the token
      setToken(storedToken);
    }
    setLoading(false);
  }, []);


  const login = async (email, password) => {
    // Use the renamed apiLogin function
    const response = await apiLogin(email, password);
    const { session } = response.data;

    // Set the state
    setUser(session.user);
    setToken(session.access_token);

    // Store the token in localStorage to persist the session
    localStorage.setItem('authToken', session.access_token);
    return session.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
  };

  // The value provided to the context consumers
  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
  };

  // Don't render children until initial loading is done
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// 3. Create a custom hook for easy access to the context
export function useAuth() {
  return useContext(AuthContext);
}