import React, { useState, useEffect } from 'react';
import { Layout, Menu, Tooltip } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  WalletOutlined,
  StarOutlined,
  MessageOutlined,
  NotificationOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const { Sider } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  // Mapping pour correspondre path à clé menu exacte
  const pathKeyMap = {
    '/dashboard': 'dashboard',
    '/users': 'users-list',
    '/users/contacts': 'users-contacts',
    '/users/admin': 'users-admin',
    '/transactions/list': 'transactions-list',
    '/subscriptions': 'subscriptions',
    '/ratings': 'ratings',
    '/skills/list': 'skills-list',
    '/skills/mine': 'user-skills',
    '/messaging': 'messaging',
    '/advertising': 'advertising',
    '/settings': 'settings',
  };

  // Détermine la clé sélectionnée à partir du pathname exact
  const selectedKey = pathKeyMap[location.pathname] || 'dashboard';

  // Détermine les sous-menus ouverts selon la clé sélectionnée
  // Exemple simple : map key prefix for submenu open keys
  const openKeyMap = {
    'users-list': 'users',
    'users-contacts': 'users',
    'users-admin': 'users',
    'transactions-list': 'transactions',
    'subscriptions': 'transactions',
    'skills-list': 'skills',
    'user-skills': 'skills',
  };
  const defaultOpenKeys = [openKeyMap[selectedKey]].filter(Boolean);

  return (
    <Sider trigger={null} collapsible collapsed={collapsed} width={220} theme="dark">
      <div
        className="logo"
        style={{ height: 40, margin: 16, background: 'rgba(255, 255, 255, 0.3)' }}
      />
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        defaultOpenKeys={defaultOpenKeys}
        style={{ height: 'calc(100vh - 64px)', overflowY: 'auto' }}
      >
        <Menu.Item
          key="dashboard"
          icon={<DashboardOutlined />}
          onClick={() => navigate('/')}
        >
          {!collapsed ? 'Tableau de bord' : <Tooltip title="Tableau de bord"><DashboardOutlined /></Tooltip>}
        </Menu.Item>

        <Menu.SubMenu
          key="users"
          icon={<UserOutlined />}
          title={!collapsed ? 'Utilisateurs' : <Tooltip title="Utilisateurs"><UserOutlined /></Tooltip>}
        >
          <Menu.Item key="users-list" onClick={() => navigate('/users')}>
            Liste des Utilisateurs
          </Menu.Item>
          <Menu.Item key="users-contacts" onClick={() => navigate('/users/contacts')}>
            Contacts
          </Menu.Item>
          <Menu.Item key="users-admin" onClick={() => navigate('/users/admin')}>
            Administration
          </Menu.Item>
        </Menu.SubMenu>

        <Menu.SubMenu
          key="transactions"
          icon={<WalletOutlined />}
          title={!collapsed ? 'Transactions' : <Tooltip title="Transactions"><WalletOutlined /></Tooltip>}
        >
          <Menu.Item key="transactions-list" onClick={() => navigate('/transactions/list')}>
            Historique Paiements
          </Menu.Item>
          <Menu.Item key="subscriptions" onClick={() => navigate('/subscriptions')}>
            Abonnements
          </Menu.Item>
        </Menu.SubMenu>

        <Menu.Item
          key="ratings"
          icon={<StarOutlined />}
          onClick={() => navigate('/ratings')}
        >
          {!collapsed ? 'Évaluations' : <Tooltip title="Évaluations"><StarOutlined /></Tooltip>}
        </Menu.Item>

        <Menu.SubMenu
          key="skills"
          icon={<WalletOutlined />}
          title={!collapsed ? 'Compétences' : <Tooltip title="Compétences"><WalletOutlined /></Tooltip>}
        >
          <Menu.Item key="skills-list" onClick={() => navigate('/skills/list')}>
            Catalogue
          </Menu.Item>
          <Menu.Item key="user-skills" onClick={() => navigate('/skills/mine')}>
            Mes compétences
          </Menu.Item>
        </Menu.SubMenu>

        <Menu.Item
          key="messaging"
          icon={<MessageOutlined />}
          onClick={() => navigate('/messaging')}
        >
          {!collapsed ? 'Messagerie' : <Tooltip title="Messagerie"><MessageOutlined /></Tooltip>}
        </Menu.Item>

        <Menu.Item
          key="advertising"
          icon={<NotificationOutlined />}
          onClick={() => navigate('/advertising')}
        >
          {!collapsed ? 'Publicités' : <Tooltip title="Publicités"><NotificationOutlined /></Tooltip>}
        </Menu.Item>

        <Menu.Item
          key="settings"
          icon={<SettingOutlined />}
          onClick={() => navigate('/settings')}
        >
          {!collapsed ? 'Paramètres' : <Tooltip title="Paramètres"><SettingOutlined /></Tooltip>}
        </Menu.Item>
      </Menu>

      <div
        style={{
          position: 'absolute',
          bottom: 16,
          width: '100%',
          textAlign: 'center',
          padding: '8px 0',
        }}
      >
        {React.createElement(
          collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
          {
            className: 'trigger',
            onClick: toggleCollapsed,
            style: { fontSize: 20, color: '#fff', cursor: 'pointer' },
          }
        )}
      </div>
    </Sider>
  );
};

export default Sidebar;
