import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, Popconfirm, message, Breadcrumb, Card } from 'antd';
import { DownloadOutlined, HomeOutlined, ContactsOutlined } from '@ant-design/icons';
import moment from 'moment';
import * as XLSX from 'xlsx';
import { fetchContacts, createContact, updateContact, deleteContact } from '../services/userService';

const { Option } = Select;

const contactTypes = {
  email: 'Email',
  phone: 'Numéro de téléphone',
  linkedin: 'LinkedIn',
  whatsapp: 'WhatsApp',
  other: 'Autre',
};

const ContactsList = () => {
  const [contacts, setContacts] = useState([]);
  const [groupedContacts, setGroupedContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [form] = Form.useForm();

  // Regrouper contacts par utilisateur
  const groupContactsByUser = (contacts) => {
    const grouped = {};
    contacts.forEach((contact) => {
      const profile = contact.user_profile || { first_name: 'Inconnu', last_name: '', id: 'unknown', skills: [] };
      const userId = profile.id || 'unknown';

      if (!grouped[userId]) {
        grouped[userId] = {
          key: `user-${userId}`,
          isGroup: true,
          userName: `${profile.first_name} ${profile.last_name}`,
          skills: profile.skills?.slice(0, 3).map(s => s.name).join(', ') || 'Aucune compétence',
          children: [],
        };
      }
      grouped[userId].children.push({ ...contact, key: `contact-${contact.id}`, isGroup: false });
    });
    return Object.values(grouped);
  };

  const loadContacts = async () => {
    setLoading(true);
    try {
      const data = await fetchContacts();
      setContacts(data);
      setGroupedContacts(groupContactsByUser(data));
    } catch (error) {
      message.error('Erreur lors du chargement des contacts');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const openModal = (contact = null) => {
    setCurrentContact(contact);
    setModalVisible(true);
    if (contact) {
      form.setFieldsValue(contact);
    } else {
      form.resetFields();
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteContact(id);
      message.success('Contact supprimé');
      loadContacts();
    } catch {
      message.error('Erreur lors de la suppression');
    }
  };

  const onFinish = async (values) => {
    try {
      if (currentContact) {
        await updateContact(currentContact.id, values);
        message.success('Contact modifié');
      } else {
        await createContact(values);
        message.success('Contact ajouté');
      }
      setModalVisible(false);
      loadContacts();
    } catch {
      message.error('Erreur lors de la sauvegarde');
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      contacts.map(({ id, contact_type, value, label, created_at, updated_at, user_profile }) => ({
        ID: id,
        Type: contactTypes[contact_type] || contact_type,
        Valeur: value,
        Label: label,
        Utilisateur: user_profile ? `${user_profile.first_name} ${user_profile.last_name}` : 'Inconnu',
        Compétences: user_profile?.skills?.map(s => s.name).join(', ') || 'Aucune compétence',
        'Créé le': moment(created_at).format('DD/MM/YYYY HH:mm'),
        'Mis à jour le': moment(updated_at).format('DD/MM/YYYY HH:mm'),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Contacts');
    XLSX.writeFile(workbook, 'contacts.xlsx');
  };

  const columns = [
    {
      title: 'Type',
      dataIndex: 'contact_type',
      key: 'contact_type',
      render: (text, record) => (record.isGroup ? null : (contactTypes[text] || text)),
    },
    {
      title: 'Valeur',
      dataIndex: 'value',
      key: 'value',
      render: (text, record) => (record.isGroup ? null : text),
    },
    {
      title: 'Label',
      dataIndex: 'label',
      key: 'label',
      render: (text, record) => (record.isGroup ? null : text),
    },
    {
      title: 'Utilisateur',
      key: 'user',
      render: (_, record) => record.isGroup ? (
        <div>
          <b>{record.userName}</b> <br />
          <small>{record.skills}</small>
        </div>
      ) : '',
    },
    {
      title: 'Créé le',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date, record) => (record.isGroup ? null : moment(date).format('DD/MM/YYYY HH:mm')),
    },
    {
      title: 'Mis à jour le',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (date, record) => (record.isGroup ? null : moment(date).format('DD/MM/YYYY HH:mm')),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        !record.isGroup && (
          <Space>
            <Button type="link" onClick={() => openModal(record)}>Modifier</Button>
            <Popconfirm title="Confirmer la suppression ?" onConfirm={() => handleDelete(record.id)}>
              <Button type="link" danger>Supprimer</Button>
            </Popconfirm>
          </Space>
        )
      ),
    },
  ];

  return (
    <Card
      title={
        <Breadcrumb>
          <Breadcrumb.Item href="/">
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/users">
            Utilisateurs
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <ContactsOutlined /> Contacts
          </Breadcrumb.Item>
        </Breadcrumb>
      }
      extra={
        <Button type="primary" icon={<DownloadOutlined />} onClick={exportToExcel}>
          Export Excel
        </Button>
      }
      style={{ margin: 20 }}
    >
      <Button type="primary" onClick={() => openModal()} style={{ marginBottom: 16 }}>
        Ajouter un contact
      </Button>

      <Table
        columns={columns}
        dataSource={groupedContacts}
        loading={loading}
        pagination={{ pageSize: 10 }}
        expandable={{ rowExpandable: (record) => record.isGroup }}
        rowClassName={(record) => (record.isGroup ? 'group-row' : '')}
      />

      <Modal
        title={currentContact ? 'Modifier Contact' : 'Ajouter Contact'}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="contact_type" label="Type" rules={[{ required: true, message: 'Veuillez choisir un type' }]}>
            <Select placeholder="Sélectionnez un type">
              {Object.entries(contactTypes).map(([value, label]) => (
                <Option key={value} value={value}>
                  {label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="value" label="Valeur" rules={[{ required: true, message: 'Veuillez entrer une valeur' }]}>
            <Input />
          </Form.Item>

          <Form.Item name="label" label="Label (optionnel)">
            <Input placeholder="Ex : pro, perso" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ContactsList;
