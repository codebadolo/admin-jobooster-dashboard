import React, { useEffect, useState, useMemo } from 'react';
import {
  Table, Tag, message, Spin, Breadcrumb, Input, Button, Space, Row, Col, Card, Statistic
} from 'antd';
import {
  HomeOutlined, FileExcelOutlined, EyeOutlined,
  SyncOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const statusColors = {
  en_attente: 'orange',
  en_cours: 'blue',
  terminee: 'green',
  annulee: 'red',
};

const MissionsList = () => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const fetchMissions = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('users/missions/');
      setMissions(response.data);
    } catch {
      message.error('Erreur lors du chargement des missions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  // Statistiques
  const totalMissions = missions.length;
  const missionsEnCours = missions.filter(m => m.status === 'en_cours').length;
  const missionsTerminees = missions.filter(m => m.status === 'terminee').length;
  const missionsAnnulees = missions.filter(m => m.status === 'annulee').length;

  // Recherche globale
  const filteredMissions = useMemo(() => {
    return missions.filter(mission => {
      const search = searchText.toLowerCase();
      return (
        mission.title.toLowerCase().includes(search) ||
        mission.client?.email.toLowerCase().includes(search) ||
        (mission.prestataire?.email.toLowerCase().includes(search))
      );
    });
  }, [missions, searchText]);

  // Export Excel
  const handleExport = () => {
    const dataToExport = filteredMissions.map(({ title, client, prestataire, status, start_date, end_date, price, geographic_zone }) => ({
      Titre: title,
      Client: client?.email || '-',
      Prestataire: prestataire?.email || '-',
      Statut: status,
      'Date Début': start_date ? new Date(start_date).toLocaleDateString() : '-',
      'Date Fin': end_date ? new Date(end_date).toLocaleDateString() : '-',
      Prix: price,
      'Zone géographique': geographic_zone,
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Missions");
    const wbout = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "missions.xlsx");
  };

  const columns = [
    { title: 'Titre', dataIndex: 'title', key: 'title', sorter: (a,b) => a.title.localeCompare(b.title), ...getColumnSearchProps('title') },
    { title: 'Client', dataIndex: ['client', 'email'], key: 'client', sorter: (a,b) => (a.client?.email || '').localeCompare(b.client?.email || ''), ...getColumnSearchProps(['client', 'email']) },
    { title: 'Prestataire', dataIndex: ['prestataire', 'email'], key: 'prestataire', sorter: (a,b) => (a.prestataire?.email || '').localeCompare(b.prestataire?.email || ''), ...getColumnSearchProps(['prestataire', 'email']), render: text => text || 'Non assigné' },
    { title: 'Zone géographique', dataIndex: 'geographic_zone', key: 'zone', filters: [...new Set(missions.map(m => m.geographic_zone))].map(zone => ({ text: zone, value: zone })), onFilter: (value, record) => record.geographic_zone === value },
    { title: 'Statut', dataIndex: 'status', key: 'status', filters: Object.keys(statusColors).map(key => ({ text: key, value: key })), onFilter: (value, record) => record.status === value, render: status => <Tag color={statusColors[status]}>{status}</Tag> },
    { title: 'Date Début', dataIndex: 'start_date', key: 'start_date', sorter: (a,b) => new Date(a.start_date) - new Date(b.start_date), render: date => date ? new Date(date).toLocaleDateString() : '-' },
    { title: 'Date Fin', dataIndex: 'end_date', key: 'end_date', sorter: (a,b) => new Date(a.end_date) - new Date(b.end_date), render: date => date ? new Date(date).toLocaleDateString() : '-' },
    { title: 'Prix (XOF)', dataIndex: 'price', key: 'price', sorter: (a,b) => parseFloat(a.price) - parseFloat(b.price) },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button type="link" icon={<EyeOutlined />} onClick={() => navigate(`/missions/${record.id}`)} />
      ),
    },
  ];

  function getColumnSearchProps(dataIndex) {
    return {
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input placeholder={`Rechercher...`} value={selectedKeys[0]} onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])} onPressEnter={() => confirm()} style={{ marginBottom: 8, display: 'block' }} />
          <Space>
            <Button type="primary" onClick={() => confirm()} size="small" style={{ width: 90 }}>Rechercher</Button>
            <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>Réinitialiser</Button>
          </Space>
        </div>
      ),
      filterIcon: filtered => <Button size="small" type={filtered ? "primary" : "default"}>🔍</Button>,
      onFilter: (value, record) => {
        if (Array.isArray(dataIndex)) {
          return dataIndex.reduce((acc, cur) => {
            const data = cur ? record[cur] : record;
            return acc || (data ? data.toString().toLowerCase().includes(value.toLowerCase()) : false);
          }, false);
        } else {
          const data = record[dataIndex];
          return data ? data.toString().toLowerCase().includes(value.toLowerCase()) : false;
        }
      }
    };
  }

  return (
    <div>
      <Row align="middle" justify="space-between" style={{ marginBottom: 16 }}>
        <Col>
          <Breadcrumb>
            <Breadcrumb.Item href="/"><HomeOutlined /></Breadcrumb.Item>
            <Breadcrumb.Item>Missions</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col>
          <Space>
            <Input.Search placeholder="Recherche globale"
              onChange={e => setSearchText(e.target.value)}
              allowClear
              style={{ width: 300 }}
            />
            <Button icon={<FileExcelOutlined />} onClick={handleExport} type="primary">
              Exporter au format Excel
            </Button>
          </Space>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Missions totales"
              value={totalMissions}
              prefix={<SyncOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Missions en cours"
              value={missionsEnCours}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Missions terminées"
              value={missionsTerminees}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Missions annulées"
              value={missionsAnnulees}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={filteredMissions}
        rowKey="id"
        size="small"
        loading={loading}
        pagination={{ pageSize: 20 }}
      />
    </div>
  );
};

export default MissionsList;
