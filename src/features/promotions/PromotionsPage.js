import React, { useEffect, useState } from 'react';
import { Table, Button, message, Modal, Typography, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axiosInstance from '../../api/axiosInstance';

const { Title } = Typography;

const PromotionsPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPromotion, setModalPromotion] = useState(null);

  // Charger la liste des promotions
  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/promotions/');
      setPromotions(res.data);
    } catch (err) {
      message.error('Erreur lors du chargement des promotions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  // Ouvrir modal pour édition ou création
  const openModal = promotion => {
    setModalPromotion(promotion || null);
    setModalVisible(true);
  };

  // Fermer modal
  const closeModal = () => {
    setModalVisible(false);
    setModalPromotion(null);
  };

  // Supprimer une promotion
  const handleDelete = async id => {
    try {
      await axiosInstance.delete(`/promotions/${id}/`);
      message.success('Promotion supprimée');
      fetchPromotions();
    } catch {
      message.error('Erreur lors de la suppression');
    }
  };

  // Colonnes tableau
  const columns = [
    {
      title: 'Titre',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => (a.title ?? '').localeCompare(b.title ?? ''),
      width: 200,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Début',
      dataIndex: 'start_date',
      key: 'start_date',
      render: text => text ? new Date(text).toLocaleDateString() : '-',
      sorter: (a, b) => new Date(a.start_date) - new Date(b.start_date),
      width: 120,
    },
    {
      title: 'Fin',
      dataIndex: 'end_date',
      key: 'end_date',
      render: text => text ? new Date(text).toLocaleDateString() : '-',
      sorter: (a, b) => new Date(a.end_date) - new Date(b.end_date),
      width: 120,
    },
    {
      title: 'Pourcentage',
      dataIndex: 'discount_percent',
      key: 'discount_percent',
      render: val => `${val}%`,
      sorter: (a, b) => a.discount_percent - b.discount_percent,
      width: 100,
    },
    {
      title: 'Statut',
      dataIndex: 'active',
      key: 'active',
      render: val => val ? <span style={{ color: 'green' }}>Actif</span> : <span style={{ color: 'red' }}>Inactif</span>,
      filters: [
        { text: 'Actif', value: true },
        { text: 'Inactif', value: false },
      ],
      onFilter: (val, record) => record.active === val,
      width: 100,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 140,
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openModal(record)} />
          <Popconfirm
            title="Supprimer cette promotion ?"
            onConfirm={() => handleDelete(record.id)}
            okText="Oui"
            cancelText="Non"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Title level={2}>Gérer les Promotions</Title>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: 16 }}
        onClick={() => openModal(null)}
      >
        Nouvelle Promotion
      </Button>

      <Table
        dataSource={promotions}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 900 }}
        bordered
      />

      <Modal
        title={modalPromotion ? "Modifier la promotion" : "Nouvelle promotion"}
        visible={modalVisible}
        onCancel={closeModal}
        footer={null}
        destroyOnClose
      >
        {/* Le formulaire de création/édition promotion peut être ici (à implémenter) */}
        <p>Le formulaire de création ou modification sera ici.</p>
      </Modal>
    </>
  );
};

export default PromotionsPage;
