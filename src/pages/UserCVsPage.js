import React, { useEffect, useState, useMemo } from 'react';
import { Table, Button, Spin, message, Breadcrumb, Input, Space, Row, Col } from 'antd';
import { DownloadOutlined, FileExcelOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const UserCVsPage = () => {
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  // Chargement des CVs - URL corrigée
  const fetchCvs = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('skills/admin/cvs/');
      setCvs(response.data);
    } catch {
      message.error('Erreur lors du chargement des CVs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCvs();
  }, []);

  // Recherche globale sur plusieurs champs, traitements adaptés
  const filteredCvs = useMemo(() => {
    return cvs.filter(cv => {
      const search = searchText.toLowerCase();
      const descriptionMatch = cv.description?.toLowerCase().includes(search) ?? false;
      const firstNameMatch = cv.profile?.first_name?.toLowerCase().includes(search) ?? false;
      const lastNameMatch = cv.profile?.last_name?.toLowerCase().includes(search) ?? false;
      const geographicZones = Array.isArray(cv.profile?.coverage_zones)
        ? cv.profile.coverage_zones.map(z => z.name.toLowerCase()).join(' ')
        : '';
      const geoZoneMatch = geographicZones.includes(search);
      return descriptionMatch || firstNameMatch || lastNameMatch || geoZoneMatch;
    });
  }, [cvs, searchText]);

  // Export Excel adapté aux champs et formats
  const handleExport = () => {
    const dataToExport = filteredCvs.map(cv => ({
      Description: cv.description || '',
      'Date mise en ligne': cv.uploaded_at ? new Date(cv.uploaded_at).toLocaleDateString() : '',
      Prénom: cv.profile?.first_name || '',
      Nom: cv.profile?.last_name || '',
      'Zones géographiques': Array.isArray(cv.profile?.coverage_zones)
        ? cv.profile.coverage_zones.map(zone => zone.name).join(', ')
        : '',
      'Nombre de compétences': cv.profile?.skills?.length || 0,
      'Lien du fichier': cv.file || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "CVs");
    const wbout = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "UserCVs.xlsx");
  };

  const columns = [
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      sorter: (a, b) => (a.description || '').localeCompare(b.description || ''),
    },
    {
      title: 'Date mise en ligne',
      dataIndex: 'uploaded_at',
      key: 'uploaded_at',
      render: date => (date ? new Date(date).toLocaleDateString() : '-'),
      sorter: (a, b) => new Date(a.uploaded_at) - new Date(b.uploaded_at),
    },
    {
      title: 'Prénom',
      dataIndex: ['profile', 'first_name'],
      key: 'first_name',
      sorter: (a, b) => (a.profile?.first_name || '').localeCompare(b.profile?.first_name || ''),
    },
    {
      title: 'Nom',
      dataIndex: ['profile', 'last_name'],
      key: 'last_name',
      sorter: (a, b) => (a.profile?.last_name || '').localeCompare(b.profile?.last_name || ''),
    },
    {
      title: 'Zone géographique',
      dataIndex: ['profile', 'coverage_zones'],
      key: 'coverage_zones',
      render: zones => zones && Array.isArray(zones) ? zones.map(z => z.name).join(', ') : '-',
      sorter: (a, b) => {
        const aZones = a.profile?.coverage_zones?.map(z => z.name).join(', ') || '';
        const bZones = b.profile?.coverage_zones?.map(z => z.name).join(', ') || '';
        return aZones.localeCompare(bZones);
      }
    },
    {
      title: 'Compétences',
      key: 'skills',
      render: (_, record) => {
        const skills = record.profile?.skills || [];
        if (skills.length === 0) return '-';
        return skills.map(s => s.skill.name).join(', ');
      }
    },
    {
      title: 'Lien',
      dataIndex: 'file',
      key: 'file',
      render: url => (
        <Button type="link" href={url} target="_blank" icon={<DownloadOutlined />} />
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Breadcrumb>
            <Breadcrumb.Item href="/"><HomeOutlined /> Accueil</Breadcrumb.Item>
            <Breadcrumb.Item>Utilisateurs</Breadcrumb.Item>
            <Breadcrumb.Item>CVs</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col>
          <Space>
            <Input.Search
              placeholder="Recherche globale"
              onChange={e => setSearchText(e.target.value)}
              allowClear
              style={{ width: 300 }}
            />
            <Button icon={<FileExcelOutlined />} onClick={handleExport} type="primary">
              Exporter
            </Button>
          </Space>
        </Col>
      </Row>

      {loading ? (
        <Spin size="large" tip="Chargement..." />
      ) : (
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredCvs}
          size='small'
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
        />
      )}
    </div>
  );
};

export default UserCVsPage;
