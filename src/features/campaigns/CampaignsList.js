import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Breadcrumb,
  Card,
  Row,
  Col,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, FileExcelOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import campaignService from '../../api/campaignService';

const { Option } = Select;

const CampaignsList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Fetch campaigns
  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const data = await campaignService.list();
      setCampaigns(data);
    } catch (err) {
      message.error('Erreur lors du chargement des campagnes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Redirect to campaign detail
  const openDetails = (campaign) => {
    navigate(`/campaigns/${campaign.id}`);
  };

  // Delete campaign
  const handleDelete = async (id) => {
    try {
      await campaignService.delete(id);
      message.success('Campagne supprimée');
      fetchCampaigns();
    } catch {
      message.error('Erreur lors de la suppression');
    }
  };

  // Export campaigns to Excel (simple CSV approach)
  const handleExportExcel = () => {
    const csvContent = [
      ['Titre', 'Annonceur', 'Budget', 'Statut', 'Date Début', 'Date Fin'],
      ...campaigns.map((c) => [
        c.title,
        c.advertiser?.email || '',
        c.budget,
        c.status,
        c.start_date,
        c.end_date,
      ]),
    ]
      .map((e) => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'campaigns.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Table columns with filters
  const columns = [
    { title: 'Titre', dataIndex: 'title', key: 'title', sorter: (a, b) => a.title.localeCompare(b.title) },
    { title: 'Annonceur', dataIndex: ['advertiser', 'email'], key: 'advertiser', filters: [...new Set(campaigns.map(c => c.advertiser?.email))].map(email => ({ text: email, value: email })), onFilter: (value, record) => record.advertiser?.email === value },
    { title: 'Budget', dataIndex: 'budget', key: 'budget', sorter: (a, b) => a.budget - b.budget },
    { title: 'Statut', dataIndex: 'status', key: 'status', filters: [
      { text: 'Brouillon', value: 'draft' },
      { text: 'Active', value: 'active' },
      { text: 'Suspendue', value: 'paused' },
      { text: 'Terminée', value: 'completed' },
      { text: 'Annulée', value: 'cancelled' },
    ], onFilter: (value, record) => record.status === value },
    { title: 'Date Début', dataIndex: 'start_date', key: 'start_date', sorter: (a, b) => new Date(a.start_date) - new Date(b.start_date) },
    { title: 'Date Fin', dataIndex: 'end_date', key: 'end_date', sorter: (a, b) => new Date(a.end_date) - new Date(b.end_date) },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => openDetails(record)}>Détails</Button>
          <Button icon={<EditOutlined />} onClick={() => message.info('Modifier non implémenté pour l’instant')} />
          <Popconfirm title="Supprimer cette campagne ?" onConfirm={() => handleDelete(record.id)} okText="Oui" cancelText="Non">
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
        <Breadcrumb.Item>Campagnes</Breadcrumb.Item>
      </Breadcrumb>

      {/* Top controls: buttons */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => message.info('Créer une nouvelle campagne')} >
            Nouvelle Campagne
          </Button>
        </Col>
        <Col>
          <Button icon={<FileExcelOutlined />} onClick={handleExportExcel}>
            Export Excel
          </Button>
        </Col>
      </Row>

      {/* Campaigns Table */}
      <Table
        dataSource={campaigns}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};

export default CampaignsList;
