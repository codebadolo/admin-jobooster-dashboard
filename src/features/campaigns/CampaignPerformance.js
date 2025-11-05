import React, { useEffect, useState } from 'react';
import { Table, message, Spin } from 'antd';
import campaignPerformanceService from '../../api/campaignPerformanceService';

const CampaignPerformance = () => {
  const [performances, setPerformances] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await campaignPerformanceService.list();
      setPerformances(data);
    } catch {
      message.error("Erreur lors du chargement des performances");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <Spin />;

  return (
    <Table
      dataSource={performances}
      columns={[
        { title: 'Campagne', dataIndex: ['campaign', 'title'], key: 'campaign' },
        { title: 'Date', dataIndex: 'date', key: 'date' },
        { title: 'Vues', dataIndex: 'views', key: 'views' },
        { title: 'Clics', dataIndex: 'clicks', key: 'clicks' },
        { title: 'Taux (%)', dataIndex: 'click_rate', key: 'click_rate' }
      ]}
      rowKey="id"
      pagination={{ pageSize: 10 }}
    />
  );
};

export default CampaignPerformance;
