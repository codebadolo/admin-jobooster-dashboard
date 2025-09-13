// src/components/Topbar/Topbar.js

import React from 'react';
import { Layout, Dropdown, Avatar, Space, Badge } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

const { Header } = Layout;

const Topbar = ({ collapsed, onToggleSidebar }) => {
  const menu = (
    <div style={{ padding: 12 }}>
      <a href="/profile" style={{ display: 'block', marginBottom: 8 }}>
        <UserOutlined /> Mon Profil
      </a>
      <a href="/logout" style={{ display: 'block' }}>
        <LogoutOutlined /> Déconnexion
      </a>
    </div>
  );

  return (
    <Header style={{
      padding: '0 16px',
      backgroundColor: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 1px 4px rgba(0,21,41,.08)',
      zIndex: 1000,
    }}>
      <div onClick={onToggleSidebar} style={{ cursor: 'pointer', fontSize: 20 }}>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </div>

      <Space size="large" align="center">
        <Badge count={5} size="small">
          <BellOutlined style={{ fontSize: '18px', cursor: 'pointer' }} />
        </Badge>

        <Dropdown overlay={menu} placement="bottomRight">
          <Space style={{ cursor: 'pointer' }}>
            <Avatar icon={<UserOutlined />} />
            <span style={{ fontWeight: 600 }}>Utilisateur</span>
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default Topbar;
