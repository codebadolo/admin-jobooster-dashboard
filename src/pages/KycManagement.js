import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, message, Tag, Card, Row, Col, Typography, Statistic, Popconfirm } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import axiosInstance from '../services/axiosInstance';

const { Title } = Typography;

const KycManagement = () => {
  const [kycData, setKycData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDoc, setModalDoc] = useState(null);
  const [stats, setStats] = useState({ total: 0, verified: 0, pending: 0 });

  const fetchKycData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/users/admin/kyc-documents/');
      setKycData(response.data);
      const total = response.data.length;
      const verified = response.data.filter(doc => doc.verified).length;
      setStats({ total, verified, pending: total - verified });
    } catch (error) {
      message.error("Erreur lors du chargement des documents KYC.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKycData();
  }, []);

  const handleValidate = async (id) => {
    try {
      await axiosInstance.patch(`/users/admin/kyc-documents/${id}/`, { verified: true });
      message.success("Document validé !");
      fetchKycData();
    } catch {
      message.error("Erreur lors de la validation.");
    }
  };

  const handleReject = async (id) => {
    try {
      await axiosInstance.patch(`/users/admin/kyc-documents/${id}/`, { verified: false });
      message.success("Document rejeté.");
      fetchKycData();
    } catch {
      message.error("Erreur lors du rejet.");
    }
  };

  const openModal = (doc) => {
    setModalDoc(doc);
    setModalVisible(true);
  };

  const columns = [
    {
      title: 'Email',
      dataIndex: 'user_email',
      key: 'user_email',
      sorter: (a, b) => (a.user_email ?? '').localeCompare(b.user_email ?? ''),
      width: 220,
    },
    {
      title: 'Prénom',
      dataIndex: ['user_profile', 'first_name'],
      key: 'first_name',
      sorter: (a, b) => (a.user_profile?.first_name ?? '').localeCompare(b.user_profile?.first_name ?? ''),
      width: 150,
    },
    {
      title: 'Nom',
      dataIndex: ['user_profile', 'last_name'],
      key: 'last_name',
      sorter: (a, b) => (a.user_profile?.last_name ?? '').localeCompare(b.user_profile?.last_name ?? ''),
      width: 150,
    },
    {
      title: 'Type document',
      dataIndex: 'document_type',
      key: 'document_type',
      width: 120,
      render: text => text?.toUpperCase() || '-'
    },
    {
      title: 'Fichier',
      dataIndex: 'document_file',
      key: 'document_file',
      render: (file, record) =>
        file ? (
          <Button type="link" onClick={() => openModal(record)}>Voir</Button>
        ) : (
          <Tag color="red">Aucun fichier</Tag>
        ),
      width: 100,
    },
    {
      title: 'Validé',
      dataIndex: 'verified',
      key: 'verified',
      render: val => val ? <Tag color="green">Oui</Tag> : <Tag color="orange">Non</Tag>,
      filters: [
        { text: 'Oui', value: true },
        { text: 'Non', value: false },
      ],
      onFilter: (value, record) => record.verified === value,
      width: 80,
    },
    {
      title: 'Créé le',
      dataIndex: 'created_at',
      key: 'created_at',
      render: text => new Date(text).toLocaleDateString(),
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
      width: 120,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 160,
      render: (_, record) => (
        <>
          <Popconfirm
            title="Valider ce document ?"
            onConfirm={() => handleValidate(record.id)}
            okText="Oui"
            cancelText="Non"
            disabled={record.verified}
          >
            <Button
              type="primary"
              size="small"
              icon={<CheckOutlined />}
              disabled={record.verified}
            >
              Valider
            </Button>
          </Popconfirm>

          <Popconfirm
            title="Rejeter ce document ?"
            onConfirm={() => handleReject(record.id)}
            okText="Oui"
            cancelText="Non"
            disabled={!record.verified}
          >
            <Button
              danger
              size="small"
              icon={<CloseOutlined />}
              style={{ marginLeft: 8 }}
              disabled={!record.verified}
            >
              Rejeter
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <Title level={2} style={{ marginBottom: 24 }}>Gestion des Vérifications KYC</Title>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card><Statistic title="Total Documents" value={stats.total} /></Card>
        </Col>
        <Col span={8}>
          <Card><Statistic title="Documents Validés" value={stats.verified} valueStyle={{ color: '#3f8600' }} /></Card>
        </Col>
        <Col span={8}>
          <Card><Statistic title="Documents en Attente" value={stats.pending} valueStyle={{ color: '#cf1322' }} /></Card>
        </Col>
      </Row>

      <Table
        dataSource={kycData}
        columns={columns}
        rowKey="id"
        loading={loading}
        size='small'
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
        bordered
      />

      <Modal
        visible={modalVisible}
        title={`Prévisualisation - ${modalDoc?.document_type.toUpperCase() || ''}`}
        footer={null}
        onCancel={() => setModalVisible(false)}
        width={700}
      >
        {modalDoc?.document_file ? (
          modalDoc.document_file.endsWith('.pdf') ? (
            <iframe
              src={modalDoc.document_file}
              style={{ width: '100%', height: 500, border: 'none' }}
              title="Document PDF"
            />
          ) : (
            <img
              src={modalDoc.document_file}
              alt="Document KYC"
              style={{ width: '100%' }}
            />
          )
        ) : (
          <p>Aucun fichier à afficher</p>
        )}
      </Modal>
    </>
  );
};

export default KycManagement;
