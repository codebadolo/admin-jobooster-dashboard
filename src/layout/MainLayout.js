// src/layout/MainLayout.js
import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import Topbar from '../components/Topbar/Topbar';

const { Content } = Layout;

const MainLayout = ({ onLogout }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout>
        <Topbar onLogout={onLogout} style={{ marginBottom: 12}} />
        <Content style={{ margin: '2px 2px', padding:20, background: '#fff' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
