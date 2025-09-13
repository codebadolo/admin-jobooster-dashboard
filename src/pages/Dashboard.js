import React from 'react';
import { Row, Col, Card, Typography, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Dashboard = () => {
  // Exemple de statistiques, à adapter selon besoin
  const stats = [
    { title: 'Utilisateurs actifs', value: 1128, prefix: <ArrowUpOutlined />, color: '#3f8600' },
    { title: 'Utilisateurs inactifs', value: 315, prefix: <ArrowDownOutlined />, color: '#cf1322' },
    { title: 'Nouveaux inscrits', value: 87, prefix: <ArrowUpOutlined />, color: '#3f8600' },
    { title: 'Abonnements expirés', value: 13, prefix: <ArrowDownOutlined />, color: '#cf1322' },
  ];

  return (
    <>
      <Title level={2}>Dashboard Overview</Title>

      <Row gutter={[24, 24]}>
        {stats.map(({ title, value, prefix, color }, index) => (
          <Col key={index} xs={24} sm={12} md={12} lg={6}>
            <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
              <Statistic title={title} value={value} prefix={prefix} valueStyle={{ color }} />
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Dashboard;
