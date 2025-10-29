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
import KycManagement from './pages/KycManagement';
import CampaignsPage from './pages/CampaignsPage';
import PromotionsPage from './pages/PromotionsPage';
import SkillsManagement from './pages/SkillsManagement';
import CampaignsList from './pages/CampaignsList';
import CampaignDetail from './pages/CampaignDetail';
import CampaignPerformance from './pages/CampaignPerformance';

import CampaignDetailEdit from './pages/CampaignDetailEdit';
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
  

  <Route path="users/kyc" element={<KycManagement />} /> {/* Nouvelle route KYC */}
    <Route path="skills/manage" element={<SkillsManagement />} />
        {/* Route compétences */}
          <Route path="users/promotions" element={<PromotionsPage />} /> 
        <Route path="skills/list" element={<SkillsList />} />
        <Route path="profile" element={<ProfilePage />} />
          <Route path="campaigns" element={<CampaignsList />} />
<Route path="campaigns/create" element={<CampaignDetailEdit />} />
<Route path="campaigns/:id" element={<CampaignDetail />} />
<Route path="campaign-performance" element={<CampaignPerformance />} />

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
