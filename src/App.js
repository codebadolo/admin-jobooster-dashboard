// src/App.js
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout
import MainLayout from './layout/MainLayout';

// Auth
import Login from './features/auth/Login';

// Dashboard
import Dashboard from './features/dashboard/Dashboard';

// Users
import UserList from './features/users/UserList';
import UserDetail from './features/users/UserDetail';
import UserForm from './features/users/UserForm';
import ContactsList from './features/users/ContactsList';
import UserCVsPage from './features/users/UserCVsPage';

// Profile
import ProfilePage from './pages/ProfilePage';
import AdminProfilePage from './pages/AdminProfilePage';
import AdminProfileEditPage from './pages/AdminProfileEditPage';

// KYC
import KycManagement from './features/kyc/KycManagement';

// Skills
import SkillsList from './features/skills/SkillsList';
import SkillsManagement from './features/skills/SkillsManagement';

// Promotions
import PromotionsPage from './features/promotions/PromotionsPage';


// Campaigns
import CampaignsList from './features/campaigns/CampaignsList';
import CampaignDetail from './features/campaigns/CampaignDetail';
import CampaignDetailEdit from './features/campaigns/CampaignDetailEdit';
import CampaignPerformance from './features/campaigns/CampaignPerformance';
import CampaignsPage from './features/campaigns/CampaignsPage';

// Transactions
import TransactionList from './features/transactions/TransactionList';
import TransactionDetail from './features/transactions/TransactionDetail';

// Routes
import NotFoundPage from './routes/NotFoundPage';

const App = () => {
  // Vérifie si un token existe déjà
  const [authenticated, setAuthenticated] = useState(!!localStorage.getItem('userToken'));

  // Connexion réussie
  const handleLoginSuccess = () => {
    setAuthenticated(true);
  };

  // Déconnexion
  const handleLogout = () => {
    setAuthenticated(false);
    localStorage.removeItem('userToken');
  };

  return (
    <Routes>
      {/* Page de connexion */}
      <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />

      {/* Routes principales protégées */}
      <Route
        path="/*"
        element={
          authenticated ? (
            <MainLayout onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        {/* Tableau de bord */}
        <Route index element={<Dashboard />} />

        {/* Utilisateurs */}
        <Route path="users" element={<UserList />} />
        <Route path="users/create" element={<UserForm />} />
        <Route path="users/edit/:id" element={<UserForm />} />
        <Route path="users/:id" element={<UserDetail />} />
        <Route path="users/contacts" element={<ContactsList />} />
        <Route path="users/cvs" element={<UserCVsPage />} />
        <Route path="users/kyc" element={<KycManagement />} />
        <Route path="users/promotions" element={<PromotionsPage />} />

        {/* Profil */}
        <Route path="profile" element={<ProfilePage />} />
        <Route path="admin/profile" element={<AdminProfilePage />} />
        <Route path="admin/profile/edit" element={<AdminProfileEditPage />} />

        {/* Compétences */}
        {/* <Route path="skills/list" element={<SkillsList />} /> */}
        <Route path="skills/manage" element={<SkillsManagement />} />

     
        {/* Campagnes */}
        <Route path="campaigns" element={<CampaignsList />} />
        <Route path="campaigns/create" element={<CampaignDetailEdit />} />
        <Route path="campaigns/:id" element={<CampaignDetail />} />
        <Route path="campaigns/performance" element={<CampaignPerformance />} />
        <Route path="campaigns/manage" element={<CampaignsPage />} />

        {/* Transactions */}
        <Route path="transactions" element={<TransactionList />} />
        <Route path="transactions/:id" element={<TransactionDetail />} />
      </Route>

      {/* Page 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
