import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Space, message, Popconfirm } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { fetchCampaigns, deleteCampaign } from '../services/campaignService';
import { useNavigate } from 'react-router-dom';

const CampaignsList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const loadCampaigns = () => {
    setLoading(true);
    fetchCampaigns()
      .then(data => {
        if (searchTerm) {
          const filtered = data.filter(c =>
            c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.advertiser.email.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setCampaigns(filtered);
        } else {
          setCampaigns(data);
        }
      })
      .catch(() => message.error("Erreur au chargement des campagnes"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCampaigns();
  }, [searchTerm]);

  const handleDelete = (id) => {
    deleteCampaign(id)
      .then(() => {
        message.success("Campagne supprimée");
        loadCampaigns();
      })
      .catch(() => message.error("Erreur suppression campagne"));
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
    { title: 'Titre', dataIndex: 'title', key: 'title' },
    { title: 'Annonceur', dataIndex: ['advertiser', 'email'], key: 'advertiser' },
    { title: 'Budget (FCFA)', dataIndex: 'budget', key: 'budget' },
    { title: 'Statut', dataIndex: 'status', key: 'status' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => navigate(`/campaigns/${record.id}`)}>Voir / Modifier</Button>
          <Popconfirm
            title="Confirmer suppression ?"
            onConfirm={() => handleDelete(record.id)}
            okText="Oui"
            cancelText="Non"
          >
            <Button danger type="link">Supprimer</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ background: '#fff', padding: 24 }}>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Rechercher par titre ou annonceur"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          prefix={<SearchOutlined />}
          allowClear
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/campaigns/create')}>
          Nouvelle Campagne
        </Button>
      </Space>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={campaigns}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default CampaignsList;
