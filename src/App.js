import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import MainLayout from './layout/MainLayout';
import UserList from './pages/UserList';
import UserDetail from './pages/UserDetail';
import ProfilePage from './pages/ProfilePage'; 
import UserForm from './pages/UserForm';
import Dashboard from './pages/Dashboard';
import SkillsList from './pages/SkillsList';
import ContactsList from './pages/ContactsList';
import AdminProfilePage from './pages/AdminProfilePage';
import UserCVsPage from './pages/UserCVsPage';
import MissionsList from './pages/MissionsList';
import MissionCreate from './pages/MissionCreate';
import MissionDetail from './pages/MissionDetail';

const App = () => {
  // Initialisez l'authentification selon la présence du token
  const [authenticated, setAuthenticated] = useState(!!localStorage.getItem('userToken'));

  // Fonction appelée après connexion réussie
  const handleLoginSuccess = () => {
    setAuthenticated(true);
  };

  // Fonction pour la déconnexion
  const handleLogout = () => {
    setAuthenticated(false);
    localStorage.removeItem('userToken');
  };

  return (
    <Routes>
      <Route 
        path="/login" 
        element={<Login onLoginSuccess={handleLoginSuccess} />} 
      />

      <Route
        path="/*"
        element={authenticated ? <MainLayout onLogout={handleLogout} /> : <Navigate to="/login" replace />}
      >
        {/* Route index = / */}
        <Route index element={<Dashboard />} />

        {/* Routes utilisateurs */}
        <Route path="users" element={<UserList />} />
        <Route path="users/:id" element={<UserDetail />} />
        <Route path="users/create" element={<UserForm />} />
        <Route path="users/edit/:id" element={<UserForm />} />
        <Route path="users/contacts" element={<ContactsList />} />
             <Route path="users/cvs" element={<UserCVsPage />} />
        <Route path="admin/profile" element={<AdminProfilePage />} />
    {/* Missions routes relatives */}
    <Route path="missions" element={<MissionsList />} />
    <Route path="missions/create" element={<MissionCreate />} />
    <Route path="missions/:id" element={<MissionDetail />} />

        {/* Route compétences */}
        <Route path="skills/list" element={<SkillsList />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Gestion root path */}
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
