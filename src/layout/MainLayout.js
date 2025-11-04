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

  // Largeur sidebar selon collapsed
  const sidebarWidth = collapsed ? 80 : 220;

  return (
    <Layout>
      <Sidebar collapsed={collapsed} />

      <Layout style={{ marginLeft: sidebarWidth, minHeight: '100vh' }}>
        <Topbar collapsed={collapsed} onToggleSidebar={toggleSidebar} />

        <Content style={{ marginTop: 64, padding: 24, background: '#fff', minHeight: 'calc(100vh - 64px)', overflowY: 'auto' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
