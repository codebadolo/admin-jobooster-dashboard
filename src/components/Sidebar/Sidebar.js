import React, { useState, useEffect } from 'react';
import { Layout, Menu, Tooltip, Avatar, Divider } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  ProjectOutlined,
  WalletOutlined,
  StarOutlined,
  MessageOutlined,
  NotificationOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  ContactsOutlined,
  FileDoneOutlined,
  TagsOutlined,
  CreditCardOutlined,
  LogoutOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const { Sider } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  // Mapping de chemins vers clés
  const pathMap = {
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
    '/messaging': 'messaging',
    '/advertising': 'advertising',
    '/settings': 'settings',
  };

  // Définir la clé sélectionnée
  const selectedKey = pathMap[location.pathname] || 'dashboard';

  // Définir les clés ouvertes basées sur la sélection
  useEffect(() => {
    const openKey = (() => {
      if (selectedKey.startsWith('users')) return ['users'];
      if (selectedKey.startsWith('transactions') || selectedKey.startsWith('subscriptions')) return ['transactions'];
      if (selectedKey.startsWith('skills')) return ['skills'];
      return [];
    })();
    setOpenKeys(openKey);
  }, [selectedKey]);

  const toggleCollapsed = () => setCollapsed(!collapsed);
  const handleOpenChange = (keys) => setOpenKeys(keys);

  const renderMenuItem = (key, icon, label) => (
    <Menu.Item key={key} icon={icon} onClick={() => navigate(`/${key.replace(/-/g, '/')}`)}>
      {!collapsed ? label : <Tooltip placement="right" title={label}>{icon}</Tooltip>}
    </Menu.Item>
  );

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={220}
      theme="dark"
      style={{ transition: 'width 0.3s' }}
    >
      <div className="logo" style={{ height: 40, margin: 16, background: 'rgba(255, 255, 255, 0.3)' }} />

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
        style={{ height: 'calc(100vh - 64px)', overflowY: 'auto' }}
      >
        {renderMenuItem('dashboard', <DashboardOutlined />, 'Tableau de bord')}

        <Menu.SubMenu
          key="users"
          icon={<UserOutlined />}
          title={!collapsed ? 'Utilisateurs' : <Tooltip placement="right" title="Utilisateurs"><UserOutlined /></Tooltip>}
        >
          <Menu.Item key="users" onClick={() => navigate('/users')}>
            Liste des Utilisateurs
          </Menu.Item>
          <Menu.Item key="users/contacts" icon={<ContactsOutlined />} onClick={() => navigate('/users/contacts')}>
            Contacts
          </Menu.Item>
          <Menu.Item key="users/cvs" onClick={() => navigate('/users/cvs')}>
            CVs
          </Menu.Item>
          <Menu.Item key="users/kyc" icon={<FileDoneOutlined />} onClick={() => navigate('/users/kyc')}>
            Vérifications KYC
          </Menu.Item>
          <Menu.Item key="users/promotions" icon={<TagsOutlined />} onClick={() => navigate('/users/promotions')}>
            Promotions
          </Menu.Item>
          <Menu.Item key="users/payments" icon={<CreditCardOutlined />} onClick={() => navigate('/users/payments')}>
            Méthodes de paiement
          </Menu.Item>
        </Menu.SubMenu>

        <Menu.Item key="campaigns" icon={<ProjectOutlined />} onClick={() => navigate('/campaigns')}>
          Campagnes
        </Menu.Item>

        <Menu.SubMenu
          key="transactions"
          icon={<WalletOutlined />}
          title={!collapsed ? 'Transactions' : <Tooltip placement="right" title="Transactions"><WalletOutlined /></Tooltip>}
        >
          <Menu.Item key="transactions/list" onClick={() => navigate('/transactions/list')}>
            Historique Paiements
          </Menu.Item>
          <Menu.Item key="subscriptions" onClick={() => navigate('/subscriptions')}>
            Abonnements
          </Menu.Item>
        </Menu.SubMenu>

        <Menu.Item key="ratings" icon={<StarOutlined />} onClick={() => navigate('/ratings')}>
          {!collapsed ? 'Évaluations' : <Tooltip placement="right" title="Évaluations"><StarOutlined /></Tooltip>}
        </Menu.Item>

        <Menu.SubMenu
          key="skills"
          icon={<AppstoreOutlined />}
          title={!collapsed ? 'Compétences' : <Tooltip placement="right" title="Compétences"><AppstoreOutlined /></Tooltip>}
        >
          <Menu.Item key="skills/list" onClick={() => navigate('/skills/list')}>
            Catalogue
          </Menu.Item>
          <Menu.Item key="skills/manage" onClick={() => navigate('/skills/manage')}>
            Gestion des compétences
          </Menu.Item>
        </Menu.SubMenu>

        <Menu.Item key="messaging" icon={<MessageOutlined />} onClick={() => navigate('/messaging')}>
          {!collapsed ? 'Messagerie' : <Tooltip placement="right" title="Messagerie"><MessageOutlined /></Tooltip>}
        </Menu.Item>

        <Menu.Item key="advertising" icon={<NotificationOutlined />} onClick={() => navigate('/advertising')}>
          {!collapsed ? 'Publicités' : <Tooltip placement="right" title="Publicités"><NotificationOutlined /></Tooltip>}
        </Menu.Item>

        <Menu.Item key="settings" icon={<SettingOutlined />} onClick={() => navigate('/settings')}>
          {!collapsed ? 'Paramètres' : <Tooltip placement="right" title="Paramètres"><SettingOutlined /></Tooltip>}
        </Menu.Item>
      </Menu>

      <Divider style={{ background: '#444', margin: 'auto 12px 12px' }} />

      {/* Espace profil en bas */}
      <div style={{ position: 'absolute', bottom: 16, width: '100%', textAlign: 'center' }}>
        <Avatar size={collapsed ? 32 : 40} icon={<UserOutlined />} onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }} />
        {!collapsed && (
          <div style={{ color: '#fff', marginTop: 8, cursor: 'pointer' }} onClick={() => { localStorage.clear(); navigate('/login'); }} title="Déconnexion">
            <LogoutOutlined /> Déconnexion
          </div>
        )}
        <div style={{ paddingTop: 8, cursor: 'pointer', color: '#fff' }} onClick={toggleCollapsed} title={collapsed ? 'Dérouler le menu' : 'Réduire le menu'}>
          {collapsed ? <MenuUnfoldOutlined style={{ fontSize: 20 }} /> : <MenuFoldOutlined style={{ fontSize: 20 }} />}
        </div>
      </div>
    </Sider>
  );
};

export default Sidebar;
