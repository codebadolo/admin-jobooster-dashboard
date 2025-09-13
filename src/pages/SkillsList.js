import React, { useEffect, useState } from 'react';
import {
  Layout,
  Row,
  Col,
  Spin,
  message,
  Typography,
  Checkbox,
  Divider,
  Breadcrumb,
  Input,
  Button,
  Space,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import PrestataireCard from './PrestataireCard';

const { Sider, Content } = Layout;
const { Title, Paragraph } = Typography;
const { Search } = Input;

const SkillsList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedZones, setSelectedZones] = useState([]);
  const [skillsFilterText, setSkillsFilterText] = useState('');
  const [zonesFilterText, setZonesFilterText] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('users/admin-users/', { params: { role: 'prestataire' } });
        const allUsers = response.data.results || response.data || [];
        const filtered = allUsers.filter(u => Array.isArray(u.skills) && u.skills.length > 0);
        setUsers(filtered);
        setFilteredUsers(filtered);
      } catch (error) {
        message.error('Erreur lors du chargement des prestataires');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Compter nombre d’occurrences par compétence et zone
  const skillsCount = users.reduce((acc, u) => {
    (u.skills || []).forEach(s => {
      const name = s.skill.name;
      acc[name] = (acc[name] || 0) + 1;
    });
    return acc;
  }, {});

  const zonesCount = users.reduce((acc, u) => {
    const zone = u.profile?.geographic_zone;
    if (zone) acc[zone] = (acc[zone] || 0) + 1;
    return acc;
  }, {});

  // Filtrer options affichage par texte recherche avec counts
  const filteredSkillsOptions = Object.keys(skillsCount)
    .filter(skill => skill.toLowerCase().includes(skillsFilterText.toLowerCase()))
    .sort()
    .map(skill => ({
      label: `${skill} (${skillsCount[skill]})`,
      value: skill,
    }));

  const filteredZonesOptions = Object.keys(zonesCount)
    .filter(zone => zone.toLowerCase().includes(zonesFilterText.toLowerCase()))
    .sort()
    .map(zone => ({
      label: `${zone} (${zonesCount[zone]})`,
      value: zone,
    }));

  // Appliquer filtre sur la liste des utilisateurs
  useEffect(() => {
    let filtered = users;

    if (selectedSkills.length > 0) {
      filtered = filtered.filter(u =>
        u.skills?.some(s => selectedSkills.includes(s.skill.name))
      );
    }
    if (selectedZones.length > 0) {
      filtered = filtered.filter(u =>
        selectedZones.includes(u.profile?.geographic_zone)
      );
    }

    setFilteredUsers(filtered);
  }, [selectedSkills, selectedZones, users]);

  const resetFilters = () => {
    setSelectedSkills([]);
    setSelectedZones([]);
    setSkillsFilterText('');
    setZonesFilterText('');
  };

  // Navigation vers la page détail
  const handleSeeDetails = (user) => {
    navigate(`/users/${user.id}`);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={300} style={{ background: '#fff', padding: 24, overflowY: 'auto' }}>
        <Title level={4} style={{ color: '#1890ff', marginBottom: 24 }}>Filtres avancés</Title>

        <section style={{ marginBottom: 24 }}>
          <Title level={5} style={{ color: '#1890ff' }}>Compétences</Title>
          <Search
            placeholder="Rechercher une compétence"
            allowClear
            onChange={e => setSkillsFilterText(e.target.value)}
            value={skillsFilterText}
            style={{ marginBottom: 16 }}
          />
          <Checkbox.Group
            options={filteredSkillsOptions}
            value={selectedSkills}
            onChange={setSelectedSkills}
            style={{ display: 'flex', flexDirection: 'column', maxHeight: 250, overflowY: 'auto' }}
          />
        </section>

        <Divider />

        <section style={{ marginBottom: 24 }}>
          <Title level={5} style={{ color: '#1890ff' }}>Zones géographiques</Title>
          <Search
            placeholder="Rechercher une zone"
            allowClear
            onChange={e => setZonesFilterText(e.target.value)}
            value={zonesFilterText}
            style={{ marginBottom: 16 }}
          />
          <Checkbox.Group
            options={filteredZonesOptions}
            value={selectedZones}
            onChange={setSelectedZones}
            style={{ display: 'flex', flexDirection: 'column', maxHeight: 160, overflowY: 'auto' }}
          />
        </section>

        <Space>
          <Button type="primary" onClick={resetFilters} block>
            Réinitialiser les filtres
          </Button>
        </Space>
      </Sider>

      <Layout>
        <Content style={{ margin: 24, overflow: 'auto' }}>
          <Breadcrumb style={{ marginBottom: 24 }}>
            <Breadcrumb.Item>Accueil</Breadcrumb.Item>
            <Breadcrumb.Item>Liste Prestataires</Breadcrumb.Item>
          </Breadcrumb>

          {loading ? (
            <Spin tip="Chargement..." style={{ marginTop: 100, textAlign: 'center' }} />
          ) : filteredUsers.length === 0 ? (
            <Paragraph style={{ textAlign: 'center' }}>Aucun prestataire ne correspond aux critères.</Paragraph>
          ) : (
            <Row gutter={[24, 24]}>
              {filteredUsers.map(user => (
                <Col key={user.id} xs={24} sm={12} md={12} lg={6} style={{ display: 'flex' }}>
                  <PrestataireCard user={user} onSeeDetails={handleSeeDetails} />
                </Col>
              ))}
            </Row>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default SkillsList;
