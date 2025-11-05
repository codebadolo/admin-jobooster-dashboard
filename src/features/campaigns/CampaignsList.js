import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, DatePicker, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import campaignService from '../../api/campaignService';

const { Option } = Select;
const { RangePicker } = DatePicker;

const CampaignsList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [form] = Form.useForm();

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

  const openModal = (campaign = null) => {
    setEditingCampaign(campaign);
    form.resetFields();
    if (campaign) form.setFieldsValue({ ...campaign });
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingCampaign(null);
  };

  const onFinish = async (values) => {
    try {
      if (editingCampaign) {
        await campaignService.update(editingCampaign.id, values);
        message.success('Campagne mise à jour');
      } else {
        await campaignService.create(values);
        message.success('Campagne créée');
      }
      fetchCampaigns();
      closeModal();
    } catch (err) {
      message.error('Erreur lors de l’enregistrement');
    }
  };

  const handleDelete = async (id) => {
    try {
      await campaignService.delete(id);
      message.success('Campagne supprimée');
      fetchCampaigns();
    } catch {
      message.error('Erreur lors de la suppression');
    }
  };

  const columns = [
    { title: 'Titre', dataIndex: 'title', key: 'title' },
    { title: 'Annonceur', dataIndex: ['advertiser', 'email'], key: 'advertiser' },
    { title: 'Budget', dataIndex: 'budget', key: 'budget' },
    { title: 'Statut', dataIndex: 'status', key: 'status' },
    { title: 'Date Début', dataIndex: 'start_date', key: 'start_date' },
    { title: 'Date Fin', dataIndex: 'end_date', key: 'end_date' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openModal(record)} />
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
    <>
      <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 16 }} onClick={() => openModal()}>
        Nouvelle Campagne
      </Button>

      <Table
        dataSource={campaigns}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingCampaign ? 'Modifier Campagne' : 'Nouvelle Campagne'}
        visible={modalVisible}
        onCancel={closeModal}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item name="title" label="Titre" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="budget" label="Budget" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="status" label="Statut" rules={[{ required: true }]}>
            <Select>
              <Option value="draft">Brouillon</Option>
              <Option value="active">Active</Option>
              <Option value="paused">Suspendue</Option>
              <Option value="completed">Terminée</Option>
              <Option value="cancelled">Annulée</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CampaignsList;
