import React, { useEffect, useState } from 'react';
import {
  Table, Button, Input, Space, Popconfirm, message,
  Tag, Avatar, Card, Breadcrumb, Row, Col, Statistic
} from 'antd';
import {
  EditOutlined, DeleteOutlined, ExportOutlined, HomeOutlined, UserOutlined, EyeOutlined,
  UserSwitchOutlined, IdcardOutlined
} from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import axiosInstance from '../services/axiosInstance';
import { useNavigate } from 'react-router-dom';

const roleColors = {
  prestataire: 'blue',
  client: 'orange',
  admin: 'red',
};

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Appel API admin users (veillez à avoir le bon endpoint dans votre backend)
      const response = await axiosInstance.get('users/admin/users/');
      const data = Array.isArray(response.data) ? response.data : Object.values(response.data);
      setUsers(data);
    } catch (error) {
      message.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalUsers: users.length,
    totalClients: users.filter(u => u.role === 'client').length,
    totalPrestataires: users.filter(u => u.role === 'prestataire').length,
    totalAdmins: users.filter(u => u.role === 'admin').length,
  };

  const handleExport = () => {
    const dataToExport = users.map(({ email, role, is_active, profile, contacts }) => ({
      Email: email,
      Rôle: role,
      Actif: is_active ? "Oui" : "Non",
      Prénom: profile?.first_name,
      Nom: profile?.last_name,
      Zone: profile?.coverage_zones?.map(z => z.name).join(', '),
      Téléphones: (contacts?.filter(c => c.contact_type === 'phone').map(c => c.value).join(', ')) || '-',
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Utilisateurs");
    const wbout = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "utilisateurs.xlsx");
  };

  const filteredUsers = users.filter(
    (user) =>
      user.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.profile?.first_name?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.profile?.last_name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const onDelete = async (userId) => {
    try {
      await axiosInstance.delete(`admin/users/${userId}/`);
      message.success('Utilisateur supprimé');
      fetchUsers();
    } catch (error) {
      message.error('Erreur lors de la suppression');
    }
  };


  const columns = [
    {
      title: 'Photo',
      dataIndex: ['profile', 'photo'],
      key: 'photo',
      render: (photo) => (photo ? <Avatar src={photo} /> : <Avatar>{'U'}</Avatar>),
      width: 70,
    },
    {
      title: 'Nom Complet',
      key: 'fullName',
      render: (_, record) => `${record.profile?.first_name || ''} ${record.profile?.last_name || ''}`,
      sorter: (a, b) => (a.profile?.first_name || '').localeCompare(b.profile?.first_name || ''),
    },
    { title: 'Email', dataIndex: 'email', key: 'email', sorter: (a, b) => a.email.localeCompare(b.email) },
    {
      title: 'Rôle',
      dataIndex: 'role',
      key: 'role',
      filters: [
        { text: 'Prestataire', value: 'prestataire' },
        { text: 'Client', value: 'client' },
        { text: 'Administrateur', value: 'admin' },
      ],
      onFilter: (value, record) => record.role === value,
      render: (role) => <Tag color={roleColors[role]}>{role}</Tag>,
    },
    {
      title: 'Sexe',
      dataIndex: ['profile', 'sex'],
      key: 'sex',
      render: (sex) => {
        switch (sex) {
          case 'M': return <Tag color="blue">Masculin</Tag>;
          case 'F': return <Tag color="pink">Féminin</Tag>;
          case 'O': return <Tag color="purple">Autre</Tag>;
          default:  return <Tag color="default">Inconnu</Tag>;
        }
      }
    },
    {
      title: 'Tranche d\'âge',
      dataIndex: ['profile', 'age_range'],
      key: 'age_range',
      render: (ageRange) => {
        const map = {
          under_18: 'Moins de 18 ans',
          '18_25': '18-25 ans',
          '26_35': '26-35 ans',
          '36_50': '36-50 ans',
          over_50: 'Plus de 50 ans',
          unknown: '-',
        };
        return map[ageRange] || '-';
      }
    },
    {
      title: 'Disponibilité',
      dataIndex: ['profile', 'availability'],
      key: 'availability',
      render: (available) =>
        available ? <Tag color="green">Disponible</Tag> : <Tag color="red">Indisponible</Tag>,
    },
    {
      title: 'Zones de couverture',
      dataIndex: ['profile', 'coverage_zones'],
      key: 'coverageZones',
      render: (zones) => zones?.map(z => <Tag key={z.id}>{z.name}</Tag>) || '-',
    },
    {
      title: 'Abonnement',
      dataIndex: ['profile', 'subscription_status'],
      key: 'subscription',
      render: (status) => status || "-",
    },
    {
      title: 'Badge Vérifié',
      dataIndex: ['profile', 'verified_badge'],
      key: 'verified',
      render: (verified) =>
        verified ? <Tag color="green">✔️</Tag> : <Tag color="default">❌</Tag>,
    },
    {
      title: 'Téléphones',
      key: 'phones',
      render: (_, record) => {
        const phones = record.contacts?.filter(c => c.contact_type === 'phone') || [];
        return phones.map(p => <div key={p.id}>{p.value}</div>);
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined
            style={{ color: '#1890ff', cursor: 'pointer' }}
            onClick={() => navigate(`/users/edit/${record.id}`)}
            title="Modifier"
          />
          <EyeOutlined
            style={{ color: '#52c41a', cursor: 'pointer' }}
            onClick={() => navigate(`/users/${record.id}`)}
            title="Détail"
          />
          <Popconfirm
            title="Confirmer la suppression ?"
            onConfirm={() => onDelete(record.id)}
            okText="Oui"
            cancelText="Non"
          >
            <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} title="Supprimer" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col xs={24} sm={24} md={12} lg={10}>
          <Breadcrumb>
            <Breadcrumb.Item href="">
              <HomeOutlined />
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <UserOutlined />
              <span>Utilisateurs</span>
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>

        <Col xs={24} sm={24} md={12} lg={14}>
          <Space style={{ float: 'right' }}>
            <Button icon={<ExportOutlined />} onClick={handleExport} type="primary">
              Exporter Excel
            </Button>
            <Input.Search
              placeholder="Rechercher utilisateurs"
              onChange={(e) => setSearchText(e.target.value)}
              enterButton
              allowClear
              style={{ width: 250 }}
            />
            <Button type="primary" onClick={() => navigate('/users/create')}>
              Ajouter utilisateur
            </Button>
          </Space>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Utilisateurs totaux"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Clients"
              value={stats.totalClients}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Prestataires"
              value={stats.totalPrestataires}
              prefix={<UserSwitchOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Administrateurs"
              value={stats.totalAdmins}
              prefix={<IdcardOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="id"
        size='small'
        loading={loading}
        pagination={{ pageSize: 15 }}
      />
    </div>
  );
};

export default UserList;
