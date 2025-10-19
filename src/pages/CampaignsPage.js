import React, { useEffect, useState } from 'react';
import { Table, Button, Typography, Space, Popconfirm, message, Spin } from 'antd';
import axiosInstance from '../services/axiosInstance';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;

const CampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('ads/admin/advertissement/');
      setCampaigns(res.data);
    } catch (error) {
      message.error('Erreur lors du chargement des campagnes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/admin/campaigns/${id}/`);
      message.success('Campagne supprimée');
      fetchCampaigns();
    } catch {
      message.error('Erreur lors de la suppression');
    }
  };

  const columns = [
    { title: 'Titre', dataIndex: 'title', key: 'title' },
    { title: 'Description', dataIndex: 'description', key: 'description', ellipsis: true },
    {
      title: 'Budget (FCFA)',
      dataIndex: 'budget',
      key: 'budget',
      render: val => val.toLocaleString(),
      sorter: (a, b) => a.budget - b.budget,
    },
    { title: 'Statut', dataIndex: 'status', key: 'status' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => alert('Modifier Id: ' + record.id)} />
          <Popconfirm
            title="Supprimer cette campagne ?"
            onConfirm={() => handleDelete(record.id)}
            okText="Oui"
            cancelText="Non"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Gestion des Campagnes</Title>

      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          columns={columns}
          dataSource={campaigns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
        />
      )}
    </div>
  );
};

export default CampaignsPage;
