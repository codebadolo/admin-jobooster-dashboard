import React, { useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

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
        {/* Route par défaut "index" qui montre le dashboard */}
        <Route index element={<Dashboard />} />

        {/* Routes liées aux utilisateurs */}
        <Route path="users" element={<UserList />} />
    <Route path="users/:id" element={<UserDetail />} />
        <Route path="users/create" element={<UserForm />} />
        <Route path="users/edit/:id" element={<UserForm />} />
    <Route path="skills/list" element={<SkillsList />} />
        {/* Vous pouvez ajouter d'autres routes ici */}
      </Route>

      {/* Redirections */}
      <Route
        path="/"
        element={authenticated ? <Navigate to="/" replace /> : <Navigate to="/login" replace />}
      />

      {/* Fallback 404 */}
      <Route path="*" element={<h2>Page non trouvée</h2>} />
    </Routes>
  );
};

export default App;
