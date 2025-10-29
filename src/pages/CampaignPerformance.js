import React, { useEffect, useState } from 'react';
import { Select, Card, Spin, message } from 'antd';
import { Line } from '@ant-design/charts';
import { fetchCampaigns } from '../services/campaignService';
import { fetchPerformances } from '../services/campaignPerformanceService';

const CampaignPerformance = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [performances, setPerformances] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCampaigns()
      .then(setCampaigns)
      .catch(() => message.error('Erreur chargement campagnes'));
  }, []);

  useEffect(() => {
    if (selectedCampaignId) {
      setLoading(true);
      fetchPerformances(selectedCampaignId)
        .then(setPerformances)
        .catch(() => message.error('Erreur chargement performances'))
        .finally(() => setLoading(false));
    }
  }, [selectedCampaignId]);

  const data = performances.map(p => ({
    date: p.date,
    vues: p.views,
    clics: p.clicks,
  })).flatMap(p => [
    { date: p.date, type: 'Vues', value: p.vues },
    { date: p.date, type: 'Clics', value: p.clics },
  ]);

  const config = {
    data,
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    animation: { appear: { animation: 'path-in', duration: 500 } },
  };

  return (
    <Card title="Performance Campagne" style={{ maxWidth: 900, margin: 'auto' }}>
      <Select
        placeholder="Sélectionner une campagne"
        style={{ marginBottom: 16, width: '100%' }}
        options={campaigns.map(c => ({ label: c.title, value: c.id }))}
        onChange={setSelectedCampaignId}
        value={selectedCampaignId}
      />
      {loading ? <Spin /> : <Line {...config} />}
    </Card>
  );
};

export default CampaignPerformance;
