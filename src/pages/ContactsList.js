import React, { useEffect, useState } from 'react';
import {
  Table, Button, Modal, Form, Input, Select, message, Breadcrumb, Card, Row, Col, Statistic,
} from 'antd';
import {
  DownloadOutlined, HomeOutlined, ContactsOutlined, MailOutlined, PhoneOutlined, LinkedinOutlined,
  MessageOutlined, QuestionCircleOutlined, UserOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import * as XLSX from 'xlsx';
import {
  fetchContacts, createContact, updateContact, deleteContact,
} from '../services/userService';

const { Option } = Select;

const contactTypeIcons = {
  email: <MailOutlined style={{ fontSize: 18 }} />,
  phone: <PhoneOutlined style={{ fontSize: 18 }} />,
  linkedin: <LinkedinOutlined style={{ fontSize: 18 }} />,
  whatsapp: <MessageOutlined style={{ fontSize: 18 }} />,
  other: <QuestionCircleOutlined style={{ fontSize: 18 }} />,
};

const contactTypes = {
  email: 'Email',
  phone: 'Numéro de téléphone',
  linkedin: 'LinkedIn',
  whatsapp: 'WhatsApp',
  other: 'Autre',
};

const ContactsList = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  // Charger contacts
  const loadContacts = async () => {
    setLoading(true);
    try {
      const data = await fetchContacts();
      setContacts(data);
      setFilteredContacts(data);
    } catch (error) {
      message.error('Erreur lors du chargement des contacts');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadContacts();
  }, []);

  // Recherche globale
  const handleSearch = (e) => {
    const text = e.target.value.toLowerCase();
    setSearchText(text);

    if (!text) {
      setFilteredContacts(contacts);
      return;
    }

    const filtered = contacts.filter((c) => {
      const userName = c.user_profile
        ? `${c.user_profile.first_name} ${c.user_profile.last_name}`.toLowerCase()
        : '';
      const typeLabel = contactTypes[c.contact_type]?.toLowerCase() || '';
      return (
        (c.value && c.value.toLowerCase().includes(text)) ||
        (c.label && c.label.toLowerCase().includes(text)) ||
        userName.includes(text) ||
        typeLabel.includes(text)
      );
    });
    setFilteredContacts(filtered);
  };

  // Stats dynamiques
  const stats = {
    totalContacts: filteredContacts.length,
    totalEmails: filteredContacts.filter(c => c.contact_type === 'email').length,
    totalPhones: filteredContacts.filter(c => c.contact_type === 'phone').length,
    totalLinkedin: filteredContacts.filter(c => c.contact_type === 'linkedin').length,
  };

const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(
    filteredContacts.map(({ id, contact_type, value, label, created_at, updated_at, user_profile }) => ({
      ID: id,
      Type: contactTypes[contact_type] || contact_type,
      Valeur: value,
      Label: label,
      Utilisateur: user_profile ? `${user_profile.first_name} ${user_profile.last_name}` : 'Inconnu',
      Compétences: user_profile && Array.isArray(user_profile.skills) && user_profile.skills.length > 0
        ? user_profile.skills.map(s => s.skill?.name || '').filter(Boolean).join(', ')
        : 'Aucune compétence',
      'Créé le': moment(created_at).format('DD/MM/YYYY HH:mm'),
      'Mis à jour le': moment(updated_at).format('DD/MM/YYYY HH:mm'),
    }))
  );
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Contacts');
  XLSX.writeFile(workbook, 'contacts.xlsx');
};


  // Colonnes sans actions
  const columns = [
    {
      title: 'Type',
      dataIndex: 'contact_type',
      key: 'contact_type',
      filters: Object.entries(contactTypes).map(([key, label]) => ({ text: label, value: key })),
      onFilter: (value, record) => record.contact_type === value,
      render: (type) => (
        <>
          {contactTypeIcons[type]}
          {' '}
          {contactTypes[type] || type}
        </>
      ),
    },
    {
      title: 'Valeur',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: 'Label',
      dataIndex: 'label',
      key: 'label',
    },
    {
      title: 'Utilisateur',
      key: 'user',
      render: (_, record) => record.user_profile ? `${record.user_profile.first_name} ${record.user_profile.last_name}` : 'Inconnu',
    },
{
  title: 'Compétences',
  key: 'skills',
  render: (_, record) => {
    const skills = record.user_profile?.skills;
    if (Array.isArray(skills) && skills.length > 0) {
      return skills.map(us => us.skill.name).filter(Boolean).join(', ');
    }
    return '-';
  },
}
,
{
  title: 'Rôle',
  dataIndex: ['user_profile', 'role'],
  key: 'role',
  render: role => {
    const roleLabels = {
      admin: 'Administrateur',
      client: 'Client',
      prestataire: 'Prestataire',
    };
    return roleLabels[role] || role;
  },
}


    ,{
      title: 'Créé le',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
      render: date => moment(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Mis à jour le',
      dataIndex: 'updated_at',
      key: 'updated_at',
      sorter: (a, b) => new Date(a.updated_at) - new Date(b.updated_at),
      render: date => moment(date).format('DD/MM/YYYY HH:mm'),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      {/* Breadcrumb et bouton Export sur même ligne */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Breadcrumb>
            <Breadcrumb.Item href="/">
              <HomeOutlined />
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/users">Utilisateurs</Breadcrumb.Item>
            <Breadcrumb.Item>
              <ContactsOutlined /> Contacts
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col>
                 <Row justify="space-between" align="" style={{ marginBottom: 16 }}>   <Input
        style={{ marginBottom: 16, maxWidth: 400 }}
        prefix={<DownloadOutlined />}
        placeholder="Rechercher dans tous les contacts"
        value={searchText}
        onChange={handleSearch}
        allowClear
      />
          <Button type="primary" icon={<DownloadOutlined />} onClick={exportToExcel}>
            Export Excel
          </Button>
           </Row>
        </Col>
      </Row>

      {/* Barre de recherche juste au-dessus du tableau */}


      {/* Cards statistiques */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Contacts totaux"
              value={stats.totalContacts}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Emails"
              value={stats.totalEmails}
              prefix={<MailOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Téléphones"
              value={stats.totalPhones}
              prefix={<PhoneOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="LinkedIn"
              value={stats.totalLinkedin}
              prefix={<LinkedinOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Tableau */}
      <Card>
        <Table
          rowKey="id"
          dataSource={filteredContacts}
          columns={columns}
          loading={loading}
          size='small'
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default ContactsList;
