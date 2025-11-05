import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Spin, message, Tabs, Breadcrumb, Row, Col, Statistic, Divider } from 'antd';
import { Line, Bar, Pie } from '@ant-design/charts';
import { fetchCampaignById } from '../../api/campaignService';
import { fetchCampaignPerformance } from '../../api/campaignPerformanceService';

const { TabPane } = Tabs;

const CampaignDetail = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchCampaignById(id),
      fetchCampaignPerformance(id),
    ])
      .then(([camp, perf]) => {
        setCampaign(camp);
        setPerformanceData(perf);
      })
      .catch(() => message.error('Erreur lors du chargement des données'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

  // Préparation données pour charts
  const lineData = performanceData.map(p => ([
    { date: p.date, type: 'Vues', value: p.views },
    { date: p.date, type: 'Clics', value: p.clicks },
  ])).flat();

  const clickRateData = performanceData.map(p => ({
    date: p.date,
    clickRate: p.views > 0 ? (p.clicks / p.views) * 100 : 0,
  }));

  const barData = clickRateData.map(p => ({ date: p.date, taux: p.clickRate.toFixed(2) }));

  // Total vues et clics
  const totalViews = performanceData.reduce((acc, cur) => acc + cur.views, 0);
  const totalClicks = performanceData.reduce((acc, cur) => acc + cur.clicks, 0);
  const avgClickRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : '0';

  const lineConfig = {
    data: lineData,
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    height: 300,
    color: ['#1890FF', '#52C41A'],
    tooltip: { showCrosshairs: true },
  };

  const barConfig = {
    data: barData,
    xField: 'date',
    yField: 'taux',
    height: 250,
    color: '#faad14',
    tooltip: { formatter: (datum) => ({ name: 'Taux clic (%)', value: datum.taux }) },
  };

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: 'auto' }}>
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item><Link to="/">Accueil</Link></Breadcrumb.Item>
        <Breadcrumb.Item><Link to="/campaigns">Campagnes</Link></Breadcrumb.Item>
        <Breadcrumb.Item>{campaign.title}</Breadcrumb.Item>
      </Breadcrumb>

      <Card title={`Détails de la campagne : ${campaign.title}`}>
        <p><b>Description:</b> {campaign.description || '-'}</p>
        <p><b>Budget:</b> {campaign.budget.toLocaleString()} FCFA</p>
        <p><b>Période:</b> {campaign.start_date} - {campaign.end_date}</p>
        <p><b>Statut:</b> {campaign.status}</p>
      </Card>

      <Divider orientation="left" style={{ marginTop: 32 }}>Statistiques globales</Divider>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Statistic title="Vues Totales" value={totalViews} />
        </Col>
        <Col span={8}>
          <Statistic title="Clics Totaux" value={totalClicks} />
        </Col>
        <Col span={8}>
          <Statistic title="Taux moyen clic (%)" value={avgClickRate} precision={2} suffix="%" />
        </Col>
      </Row>

      {/* Onglets graphiques */}
      <Tabs defaultActiveKey="line">
        <TabPane tab="Évolution Vues & Clics" key="line">
          <Line {...lineConfig} />
        </TabPane>
        <TabPane tab="Taux de clic (%) par jour" key="bar">
          <Bar {...barConfig} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default CampaignDetail;
