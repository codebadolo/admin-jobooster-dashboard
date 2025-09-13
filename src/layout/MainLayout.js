import React, { useState } from 'react';
import { Layout } from 'antd';
import Sidebar from '../components/Sidebar/Sidebar';
import Topbar from '../components/Topbar/Topbar';
import { Outlet } from 'react-router-dom';

const { Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar latérale, collapsible */}
      <Sidebar collapsed={collapsed} />

      {/* Partie principale : barre du haut + contenu */}
      <Layout>
        <Topbar collapsed={collapsed} onToggleSidebar={toggleSidebar} />

        <Content style={{ margin: 16, padding: 24, background: '#fff', minHeight: 280 }}>
          {/* Le contenu rendu par React Router selon la route (Dashboard, Users, etc) */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
