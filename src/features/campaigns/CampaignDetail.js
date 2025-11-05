import React, { useEffect, useState } from 'react';
import { Card, Table, Typography, Spin, message } from 'antd';
import campaignService from '../../api/campaignService';
import campaignPerformanceService from '../../api/campaignPerformanceService';
import { useParams } from 'react-router-dom';

const { Title } = Typography;

const CampaignDetail = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [performances, setPerformances] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCampaign = async () => {
    setLoading(true);
    try {
      const data = await campaignService.retrieve(id);
      setCampaign(data);
    } catch {
      message.error("Erreur lors du chargement de la campagne");
    } finally {
      setLoading(false);
    }
  };

  const fetchPerformances = async () => {
    try {
      const data = await campaignPerformanceService.listByCampaign(id);
      setPerformances(data);
    } catch {
      message.error("Erreur lors du chargement des performances");
    }
  };

  useEffect(() => {
    fetchCampaign();
    fetchPerformances();
  }, [id]);

  if (loading || !campaign) return <Spin />;

  return (
    <>
      <Title level={2}>{campaign.title}</Title>
      <Card title="Détails">
        <p><b>Description:</b> {campaign.description}</p>
        <p><b>Budget:</b> {campaign.budget}</p>
        <p><b>Statut:</b> {campaign.status}</p>
        <p><b>Date:</b> {campaign.start_date} → {campaign.end_date}</p>
      </Card>

      <Card title="Performances" style={{ marginTop: 16 }}>
        <Table
          dataSource={performances}
          columns={[
            { title: 'Date', dataIndex: 'date', key: 'date' },
            { title: 'Vues', dataIndex: 'views', key: 'views' },
            { title: 'Clics', dataIndex: 'clicks', key: 'clicks' },
            { title: 'Taux (%)', dataIndex: 'click_rate', key: 'click_rate' }
          ]}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </>
  );
};

export default CampaignDetail;
