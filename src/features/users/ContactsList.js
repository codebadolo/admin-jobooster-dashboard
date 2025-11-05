import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

import {
  fetchContacts,
  createContact,
  updateContact,
  deleteContact,
} from '../../api/userService'; // remplace par le bon chemin vers ton service

const { Option } = Select;

const contactTypeOptions = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Numéro de téléphone' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'other', label: 'Autre' },
];

const ContactsList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  const [form] = Form.useForm();

  // Charger contacts
  const loadContacts = async () => {
    setLoading(true);
    try {
      const data = await fetchContacts();
      setContacts(data);
    } catch (error) {
      message.error('Erreur lors du chargement des contacts');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadContacts();
  }, []);

  // Ouvrir modal modifier ou ajouter
  const openModal = (contact = null) => {
    setEditingContact(contact);
    if (contact) {
      form.setFieldsValue(contact);
    } else {
      form.resetFields();
    }
    setModalVisible(true);
  };

  // Fermer modal
  const closeModal = () => {
    setModalVisible(false);
    setEditingContact(null);
    form.resetFields();
  };

  // Soumettre formulaire
  const handleFinish = async (values) => {
    try {
      if (editingContact) {
        await updateContact(editingContact.id, values);
        message.success('Contact modifié avec succès');
      } else {
        await createContact(values);
        message.success('Contact créé avec succès');
      }
      closeModal();
      loadContacts();
    } catch (error) {
      message.error("Erreur lors de l'enregistrement du contact");
    }
  };

  // Supprimer contact
  const confirmDelete = async (id) => {
    try {
      await deleteContact(id);
      message.success('Contact supprimé');
      loadContacts();
    } catch (error) {
      message.error('Erreur lors de la suppression');
    }
  };

  const columns = [
    {
      title: 'Type',
      dataIndex: 'contact_type',
      key: 'contact_type',
      filters: contactTypeOptions.map(({ value, label }) => ({ text: label, value })),
      onFilter: (value, record) => record.contact_type === value,
      render: (text) => {
        const found = contactTypeOptions.find(o => o.value === text);
        return found ? found.label : text;
      },
    },
    {
      title: 'Valeur',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: 'Libellé',
      dataIndex: 'label',
      key: 'label',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => openModal(record)} />
          <Popconfirm
            title="Confirmer la suppression ?"
            onConfirm={() => confirmDelete(record.id)}
            okText="Oui" cancelText="Non"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: 16 }}
        onClick={() => openModal()}
      >
        Ajouter un contact
      </Button>

      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={contacts}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingContact ? "Modifier Contact" : "Ajouter Contact"}
        visible={modalVisible}
        onCancel={closeModal}
        okText="Enregistrer"
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{ contact_type: 'email' }}
        >
          <Form.Item
            name="contact_type"
            label="Type de contact"
            rules={[{ required: true, message: 'Veuillez sélectionner un type' }]}
          >
            <Select>
              {contactTypeOptions.map(({ value, label }) => (
                <Option key={value} value={value}>{label}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="value"
            label="Valeur"
            rules={[{ required: true, message: 'Veuillez entrer la valeur' }]}
          >
            <Input placeholder="ex: email@exemple.com ou +225xxxxxxxx" />
          </Form.Item>

          <Form.Item
            name="label"
            label="Libellé (optionnel)"
          >
            <Input placeholder="ex: Personnel, Pro, WhatsApp..." />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ContactsList;
