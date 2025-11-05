import React, { useEffect, useState } from 'react';
import { Table, message, Spin } from 'antd';
import promotionService from '../../api/promotionService';


const PromotionsPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await promotionService.list();
      setPromotions(data);
    } catch {
      message.error("Erreur lors du chargement des promotions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <Spin />;

  return (
    <Table
      dataSource={promotions}
      rowKey="id"
      pagination={{ pageSize: 10 }}
      columns={[
        { title: 'Prestataire', dataIndex: ['prestataire', 'email'], key: 'prestataire' },
        { title: 'Type', dataIndex: 'promotion_type', key: 'type' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
        { title: 'Réduction (%)', dataIndex: 'discount_percentage', key: 'discount' },
        { title: 'Date début', dataIndex: 'start_datetime', key: 'start' },
        { title: 'Date fin', dataIndex: 'end_datetime', key: 'end' },
        { title: 'Actif', dataIndex: 'active', key: 'active', render: val => val ? 'Oui' : 'Non' }
      ]}
    />
  );
};

export default PromotionsPage;
