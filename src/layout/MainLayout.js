import React, { useState } from 'react';
import { Layout } from 'antd';
import Sidebar from '../components/Sidebar/Sidebar';
import Topbar from '../components/Topbar/Topbar';
import { Outlet } from 'react-router-dom';
const { Content } = Layout;

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} />
      <Layout>
        <Topbar collapsed={collapsed} onToggleSidebar={toggleSidebar} />
        <Content style={{ margin: '16px', padding: 24, background: '#fff' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
