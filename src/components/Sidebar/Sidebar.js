// src/components/Sidebar/Sidebar.js
import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import menuItems from './menuItems';

const { Sider } = Layout;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const selectedKey = menuItems
    .flatMap(item => (item.children ? item.children : item))
    .find(sub => sub.path === location.pathname)?.key;

  const onMenuClick = ({ key }) => {
    const target = menuItems
      .flatMap(item => (item.children ? item.children : item))
      .find(sub => sub.key === key);
    if (target?.path) navigate(target.path);
  };

  const generateMenuItems = (items) =>
    items.map(item => ({
      key: item.key,
      icon: item.icon,
      label: item.label,
      children: item.children ? generateMenuItems(item.children) : null,
    }));

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      width={230}
      style={{
        minHeight: '100vh',
        background: '#fff',
        borderRight: '1px solid #f0f0f0',
      }}
    >
      <div
        className="logo"
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fff',
          fontWeight: 'bold',
          fontSize: 18,
        }}
      >
        <span style={{ color: '#1890ff' }}>Admin Ibaara</span>
      </div>

      <Menu
        mode="inline"
        theme="light"
        selectedKeys={[selectedKey]}
        onClick={onMenuClick}
        items={generateMenuItems(menuItems)}
        style={{ marginTop: 10 }}
      />
    </Sider>
  );
};

export default Sidebar;
