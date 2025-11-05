// src/components/Sidebar/menuItems.js
import {
  DashboardOutlined,
  UserOutlined,
  ProjectOutlined,
  DollarOutlined,
  ProfileOutlined,
  NotificationOutlined,
  TeamOutlined,
  SettingOutlined,
  SolutionOutlined,
  AppstoreOutlined,
  CheckCircleOutlined,
  StarOutlined,
} from '@ant-design/icons';

const menuItems = [
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
    path: '/',
  },
  {
    key: 'users',
    icon: <UserOutlined />,
    label: 'Utilisateurs',
    children: [
      { key: 'users-list', label: 'Liste', path: '/users' },
      { key: 'users-cvs', label: 'CVs', path: '/users/cvs' },
      { key: 'users-contacts', label: 'Contacts', path: '/users/contacts' },
      { key: 'users-promotions', label: 'Promotions', path: '/users/promotions' },
      { key: 'users-kyc', label: 'KYC', path: '/users/kyc' },
    ],
  },
 {
  key: 'advertising',
  label: 'Advertising',
  icon: <NotificationOutlined />,
  children: [
    { key: 'campaigns-list', label: 'Campagnes', path: '/campaigns/list' },
    { key: 'campaign-performance', label: 'Performances', path: '/campaigns/performance' },
    { key: 'advertisements-list', label: 'Annonces', path: '/advertisements/list' },
    { key: 'promotions-list', label: 'Promotions', path: '/promotions' },
    { key: 'geozones-list', label: 'Zones Géographiques', path: '/geozones/list' },
    { key: 'advertising-dashboard', label: 'Dashboard', path: '/advertising' },
  ]
}
,

  {
    key: 'transactions',
    icon: <DollarOutlined />,
    label: 'Transactions',
    children: [
      { key: 'transactions-list', label: 'Liste', path: '/transactions/list' },
    ],
  },
  {
    key: 'skills',
    icon: <CheckCircleOutlined />,
    label: 'Compétences',
    children: [
      { key: 'skills-list', label: 'Liste', path: '/skills/list' },
      { key: 'skills-manage', label: 'Gérer', path: '/skills/manage' },
    ],
  },
  {
    key: 'profile',
    icon: <ProfileOutlined />,
    label: 'Profil',
    children: [
      { key: 'admin-profile', label: 'Profil Admin', path: '/admin/profile' },
      { key: 'profile-page', label: 'Mon Profil', path: '/profile' },
    ],
  },
  {
    key: 'settings',
    icon: <SettingOutlined />,
    label: 'Paramètres',
    path: '/settings',
  },
];

export default menuItems;
