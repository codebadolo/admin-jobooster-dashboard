import React, { useState } from 'react';
import { DatePicker, Button, Row, Col, Card, Statistic, Typography } from 'antd';
import { Line } from '@ant-design/charts';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Title } = Typography;

const sampleStats = {
  users: {
    total_users: 1200,
    active_users: 900,
  },
  transactions: {
    total_transactions: 3400,
    total_volume: 12500000,
  },
  visibility: {
    total_profile_views: 27000,
    total_contact_clicks: 4200,
    conversion_rate: 15.5,
  },
  messaging: {
    total_conversations: 1800,
    total_messages: 9000,
  },
  kyc: [
    { document_type: 'Carte Nationale d\'Identité', submitted_count: 600, verified_count: 580, pending_count: 20 },
    { document_type: 'Passeport', submitted_count: 300, verified_count: 290, pending_count: 10 },
  ],
  advertising: {
    performance: [
      { date: '2025-10-01', views: 5000, clicks: 300 },
      { date: '2025-10-05', views: 5200, clicks: 350 },
      { date: '2025-10-10', views: 4800, clicks: 310 },
      { date: '2025-10-15', views: 5300, clicks: 400 },
      { date: '2025-10-20', views: 4900, clicks: 370 },
      { date: '2025-10-25', views: 5100, clicks: 390 },
    ],
  },
};

const Dashboard = () => {
  const [range, setRange] = useState([moment().startOf('month'), moment()]);

  const advertisingChartData = sampleStats.advertising.performance.map(item => ({
    date: moment(item.date).format('DD MMM'),
    views: item.views,
    clicks: item.clicks,
  }));

  const advertisingChartConfig = {
    data: advertisingChartData,
    xField: 'date',
    yField: ['views', 'clicks'],
    tooltip: { showMarkers: false },
    smooth: true,
    height: 200,
    legend: { position: 'top' },
  };

  const onRangeChange = (dates) => {
    setRange(dates);
    // En vrai, ici vous pouvez déclencher le fetch API avec ces dates
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Filtrer par période</Title>
      <RangePicker value={range} onChange={onRangeChange} />
      <Button type="primary" style={{ marginLeft: 8 }}>
        Appliquer
      </Button>

      <Row gutter={24} style={{ marginTop: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="Utilisateurs totaux" value={sampleStats.users.total_users} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Utilisateurs actifs" value={sampleStats.users.active_users} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Transactions totales" value={sampleStats.transactions.total_transactions} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Volume total transaction (XOF)" value={sampleStats.transactions.total_volume} />
          </Card>
        </Col>
      </Row>

      <Row gutter={24} style={{ marginTop: 24 }}>
        <Col span={8}>
          <Card title="Visibilité">
            <Statistic title="Vues profils" value={sampleStats.visibility.total_profile_views} />
            <Statistic title="Clics contacts" value={sampleStats.visibility.total_contact_clicks} style={{ marginTop: 16 }} />
            <Statistic title="Taux conversion (%)" value={sampleStats.visibility.conversion_rate.toFixed(2)} style={{ marginTop: 16 }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Messagerie">
            <Statistic title="Conversations totales" value={sampleStats.messaging.total_conversations} />
            <Statistic title="Messages totaux" value={sampleStats.messaging.total_messages} style={{ marginTop: 16 }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Vérification KYC">
            {sampleStats.kyc.map(doc => (
              <div key={doc.document_type} style={{ marginBottom: 12 }}>
                <b>{doc.document_type}</b><br />
                Soumis : {doc.submitted_count} — Validés : {doc.verified_count} — En attente : {doc.pending_count}
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: 32 }}>
        <Col span={24}>
          <Card title="Performance campagnes (vues vs clics)">
            <Line {...advertisingChartConfig} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
