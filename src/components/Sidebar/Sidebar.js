import React, { useState } from 'react';
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
  ProfileOutlined,
  ProjectOutlined,
  AppstoreOutlined ,
  FileDoneOutlined,
  TagsOutlined,
  ContactsOutlined,
  CreditCardOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const { Sider } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleCollapsed = () => setCollapsed(!collapsed);

  const pathKeyMap = {
    '/dashboard': 'dashboard',
    '/users': 'users-list',
    '/users/contacts': 'users-contacts',
    '/users/cvs': 'users-cvs',
    '/users/kyc': 'users-kyc',
    '/users/promotions': 'users-promotions',
    '/users/payments': 'users-payments',
    '/transactions/list': 'transactions-list',
    '/subscriptions': 'subscriptions',
    '/ratings': 'ratings',
     '/campaigns': 'campaigns',
    '/skills/manage': 'skills-manage',
    '/skills/list': 'skills-list',
    '/skills/mine': 'user-skills',
    '/messaging': 'messaging',
    '/advertising': 'advertising',
    '/settings': 'settings',

  };

  const selectedKey = pathKeyMap[location.pathname] || 'dashboard';

  const openKeyMap = {
    'users-list': 'users',
    'users-contacts': 'users',
    'users-cvs': 'users',
    'users-kyc': 'users',
    'users-promotions': 'users',
    'users-payments': 'users',
     'campaigns': 'advertising',
    'transactions-list': 'transactions',
    'subscriptions': 'transactions',
    'skills-manage': 'skills',
    'skills-list': 'skills',
    'user-skills': 'skills',

  };

  const defaultOpenKeys = [openKeyMap[selectedKey]].filter(Boolean);

  return (
    <Sider trigger={null} collapsible collapsed={collapsed} width={220} theme="dark">
      <div className="logo" style={{ height: 40, margin: 16, background: 'rgba(255, 255, 255, 0.3)' }} />
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        defaultOpenKeys={defaultOpenKeys}
        style={{ height: 'calc(100vh - 64px)', overflowY: 'auto' }}
      >
        <Menu.Item key="dashboard" icon={<DashboardOutlined />} onClick={() => navigate('/')}>
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
          <Menu.Item key="users-contacts" icon={<ContactsOutlined />} onClick={() => navigate('/users/contacts')}>
            Contacts
          </Menu.Item>
          <Menu.Item key="users-cvs" onClick={() => navigate('/users/cvs')}>
            CVs
          </Menu.Item>
          <Menu.Item key="users-kyc" icon={<FileDoneOutlined />} onClick={() => navigate('/users/kyc')}>
            Vérifications KYC
          </Menu.Item>
          <Menu.Item key="users-promotions" icon={<TagsOutlined />} onClick={() => navigate('/users/promotions')}>
            Promotions
          </Menu.Item>
          <Menu.Item key="users-payments" icon={<CreditCardOutlined />} onClick={() => navigate('/users/payments')}>
            Méthodes de paiement
          </Menu.Item>
        </Menu.SubMenu>
<Menu.Item
  key="campaigns"
  icon={<ProjectOutlined />}
  onClick={() => navigate('/campaigns')}
>
  Campagnes
</Menu.Item>
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

        <Menu.Item key="ratings" icon={<StarOutlined />} onClick={() => navigate('/ratings')}>
          {!collapsed ? 'Évaluations' : <Tooltip title="Évaluations"><StarOutlined /></Tooltip>}
        </Menu.Item>
<Menu.Item
  key="skills-manage"
  icon={<AppstoreOutlined />}
  onClick={() => navigate('/skills/manage')}
>
  Gestion des compétences
</Menu.Item>
        <Menu.SubMenu
          key="skills"
          icon={<WalletOutlined />}
          title={!collapsed ? 'Compétences' : <Tooltip title="Compétences"><WalletOutlined /></Tooltip>}
        >
          <Menu.Item key="skills-list" onClick={() => navigate('/skills/list')}>
            Catalogue
          </Menu.Item>
     
        </Menu.SubMenu>

      

        <Menu.Item key="messaging" icon={<MessageOutlined />} onClick={() => navigate('/messaging')}>
          {!collapsed ? 'Messagerie' : <Tooltip title="Messagerie"><MessageOutlined /></Tooltip>}
        </Menu.Item>

        <Menu.Item key="advertising" icon={<NotificationOutlined />} onClick={() => navigate('/advertising')}>
          {!collapsed ? 'Publicités' : <Tooltip title="Publicités"><NotificationOutlined /></Tooltip>}
        </Menu.Item>

        <Menu.Item key="settings" icon={<SettingOutlined />} onClick={() => navigate('/settings')}>
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
