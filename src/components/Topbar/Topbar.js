import React from 'react';
import { Layout, Dropdown, Avatar, Space, Badge, message } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import axiosInstance from '../../api/axiosInstance';

import { useNavigate } from 'react-router-dom';

const { Header } = Layout;

const Topbar = ({ collapsed, onToggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    axiosInstance.post('/users/logout/')
      .then(() => {
        localStorage.removeItem('userToken');
        message.success('Déconnexion réussie');
        navigate('/login');
      })
      .catch(err => {
        console.error('Erreur déconnexion:', err);
        message.error('Erreur lors de la déconnexion');
      });
  };

  const menu = (
    <div style={{ padding: 12 }}>
      <a href="admin/profile" style={{ display: 'block', marginBottom: 30 }}>
        <UserOutlined /> Mon Profil
      </a>
      <a onClick={handleLogout} style={{ display: 'block', cursor: 'pointer' }}>
        <LogoutOutlined /> Déconnexion
      </a>
    </div>
  );

  return (
    <Header style={{
      position: 'fixed',
      top: 0,
      left: collapsed ? 80 : 220,
      right: 0,
      height: 64,
      zIndex: 1100,
      padding: '0 16px',
      backgroundColor: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 1px 4px rgba(0,21,41,.08)',
      transition: 'left 0.3s',
    }}>
      <div onClick={onToggleSidebar} style={{ cursor: 'pointer', fontSize: 20 }}>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </div>

      <Space size="large" align="center">
        <Badge count={5} size="small">
          <BellOutlined style={{ fontSize: '18px', cursor: 'pointer' }} />
        </Badge>

        <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
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
