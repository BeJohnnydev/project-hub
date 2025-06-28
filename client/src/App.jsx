/// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Routes>
      {/* This route says: when the URL path is "/", render the LoginPage component */}
      <Route path="/" element={<LoginPage />} />

      {/* We will add more routes here later (e.g., for the dashboard) */}
    </Routes>
  );
}

export default App;