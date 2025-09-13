import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import MainLayout from './layout/MainLayout';
import UserList from './pages/UserList';
import UserDetail from './pages/UserDetail';
import UserForm from './pages/UserForm';
import Dashboard from './pages/Dashboard';
import SkillsList from './pages/SkillsList';

const App = () => {
  const [authenticated, setAuthenticated] = useState(!!localStorage.getItem('userToken'));

  const handleLoginSuccess = () => {
    setAuthenticated(true);
  };

  return (
    <Routes>
      <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />

      <Route
        path="/*"
        element={authenticated ? <MainLayout /> : <Navigate to="/login" replace />}
      >
        {/* route index = / */}
        <Route index  element={<Dashboard />} />

        {/* Routes utilisateurs */}
        <Route path="users" element={<UserList />} />
        <Route path="users/:id" element={<UserDetail />} />
        <Route path="users/create" element={<UserForm />} />
        <Route path="users/edit/:id" element={<UserForm />} />

        {/* Route compétences */}
        <Route path="skills/list" element={<SkillsList />} />
      </Route>

      {/* Gestion root path */}
      <Route
        path="/"
        element={
          authenticated ? <Navigate to="/" replace /> : <Navigate to="/login" replace />
        }
      />

      {/* Fallback 404 */}
      <Route path="*" element={<h2>Page non trouvée</h2>} />
    </Routes>
  );
};

export default App;
