import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Tag, Typography, message, Spin, Modal, Checkbox, Divider, Button, Collapse, Rate, Pagination } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import AdminService from '../../api/AdminUserService';

const { Title } = Typography;
const { Panel } = Collapse;

const SkillsList = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    skills: [],
    coverageZones: [],
    sex: [],
    availability: null,
    verified: null,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [allSkills, setAllSkills] = useState([]);
  const [allZones, setAllZones] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Charger prestataires
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await AdminService.fetchUsers();
      const providers = data.filter(user => user.role === 'prestataire');
      setAllUsers(providers);
      setFilteredUsers(providers);

      // Extraire compétences et zones uniques
      const skillsSet = new Set();
      const zonesSet = new Set();
      providers.forEach(user => {
        (user.profile?.skills || []).forEach(s => skillsSet.add(s.skill.name));
        (user.profile?.coverage_zones || []).forEach(z => zonesSet.add(z.name));
      });
      setAllSkills([...skillsSet]);
      setAllZones([...zonesSet]);
    } catch (error) {
      console.error(error);
      message.error("Erreur lors du chargement des prestataires.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtrage
  useEffect(() => {
    let filtered = [...allUsers];
    filtered = filtered.filter(user => user.profile);

    if (filters.skills.length > 0) {
      filtered = filtered.filter(user =>
        user.profile.skills?.some(s => filters.skills.includes(s.skill.name))
      );
    }
    if (filters.coverageZones.length > 0) {
      filtered = filtered.filter(user =>
        user.profile.coverage_zones?.some(z => filters.coverageZones.includes(z.name))
      );
    }
    if (filters.sex.length > 0) {
      filtered = filtered.filter(user => filters.sex.includes(user.profile.sex));
    }
    if (filters.availability !== null) {
      filtered = filtered.filter(user => user.profile.availability === filters.availability);
    }
    if (filters.verified !== null) {
      filtered = filtered.filter(user => user.profile.verified_badge === filters.verified);
    }

    setFilteredUsers(filtered);
    setCurrentPage(1); // reset pagination when filters change
  }, [filters, allUsers]);

  const handleFilterChange = (key, values) => setFilters({ ...filters, [key]: values });
  const clearFilters = () => setFilters({ skills: [], coverageZones: [], sex: [], availability: null, verified: null });

  const openModal = user => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  // Pagination
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div style={{ display: 'flex', padding: 24 }}>
      {/* Sidebar filtres */}
      <div style={{ width: 250, marginRight: 24, position: 'sticky', top: 24, alignSelf: 'flex-start' }}>
        <Title level={4}>Filtres</Title>
        <Button type="link" onClick={clearFilters}>Effacer tous les filtres</Button>

        <Collapse defaultActiveKey={['skills', 'zones', 'others']}>
          <Panel header="Compétences" key="skills">
            <Checkbox.Group options={allSkills} value={filters.skills} onChange={vals => handleFilterChange('skills', vals)} />
          </Panel>
          <Panel header="Zones de couverture" key="zones">
            <Checkbox.Group options={allZones} value={filters.coverageZones} onChange={vals => handleFilterChange('coverageZones', vals)} />
          </Panel>
          <Panel header="Autres filtres" key="others">
            <Divider>Genre</Divider>
            <Checkbox.Group value={filters.sex} onChange={vals => handleFilterChange('sex', vals)}>
              <Checkbox value="M">Homme</Checkbox>
              <Checkbox value="F">Femme</Checkbox>
            </Checkbox.Group>

            <Divider>Disponibilité</Divider>
            <Checkbox.Group
              value={filters.availability === null ? [] : [filters.availability]}
              onChange={vals => handleFilterChange('availability', vals[0] ?? null)}
            >
              <Checkbox value={true}>Disponible</Checkbox>
              <Checkbox value={false}>Indisponible</Checkbox>
            </Checkbox.Group>

            <Divider>Badge vérifié</Divider>
            <Checkbox.Group
              value={filters.verified === null ? [] : [filters.verified]}
              onChange={vals => handleFilterChange('verified', vals[0] ?? null)}
            >
              <Checkbox value={true}>Oui</Checkbox>
              <Checkbox value={false}>Non</Checkbox>
            </Checkbox.Group>
          </Panel>
        </Collapse>
      </div>

      {/* Liste principale */}
      <div style={{ flex: 1 }}>
        <Title level={2}>Prestataires</Title>
        {loading ? (
          <Spin tip="Chargement..." size="large" />
        ) : (
          <>
            <Row gutter={[24, 24]}>
              {paginatedUsers.map(user => {
                const profile = user.profile || {};
                const firstSkill = profile.skills?.[0];
                const averageRating = user.received_ratings?.length
                  ? (user.received_ratings.reduce((sum, r) => sum + r.rating_value, 0) / user.received_ratings.length).toFixed(1)
                  : null;

                return (
                  <Col key={user.id} xs={24} sm={12} md={8} lg={6}>
                    <Card
                      hoverable
                      cover={profile.photo && <img src={profile.photo} alt={`${profile.first_name} ${profile.last_name}`} style={{ height: 200, objectFit: 'cover' }} />}
                      onClick={() => openModal(user)}
                    >
                      <Card.Meta
                        title={`${profile.first_name} ${profile.last_name}`}
                        description={
                          <>
                            {profile.verified_badge ? <Tag icon={<CheckCircleOutlined />} color="success">Vérifié</Tag> : <Tag color="default">Non vérifié</Tag>}
                            {profile.availability ? <Tag color="blue" style={{ marginLeft: 8 }}>Disponible</Tag> : <Tag color="orange" style={{ marginLeft: 8 }}>Indisponible</Tag>}

                            <Divider style={{ margin: '8px 0' }} />
                            <p><strong>Compétence principale :</strong> {firstSkill ? <Tag color="cyan">{firstSkill.skill.name} ({firstSkill.level})</Tag> : <Tag color="gray">Aucune</Tag>}</p>
                            {averageRating && <Rate disabled allowHalf defaultValue={Number(averageRating)} style={{ fontSize: 14 }} />}
                          </>
                        }
                      />
                    </Card>
                  </Col>
                );
              })}
            </Row>

            {filteredUsers.length > pageSize && (
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredUsers.length}
                onChange={page => setCurrentPage(page)}
                style={{ marginTop: 24, textAlign: 'center' }}
              />
            )}
          </>
        )}
      </div>

      {/* Modal détails */}
      <Modal
        visible={modalVisible}
        title={selectedUser ? `${selectedUser.profile?.first_name} ${selectedUser.profile?.last_name}` : ''}
        footer={null}
        onCancel={() => setModalVisible(false)}
        width={800}
      >
        {selectedUser && (
          <>
            <Row gutter={16}>
              <Col span={8}>
                <img src={selectedUser.profile?.photo} alt={`${selectedUser.profile?.first_name} ${selectedUser.profile?.last_name}`} style={{ width: '100%', borderRadius: 8 }} />
              </Col>
              <Col span={16}>
                <p><strong>Bio:</strong> {selectedUser.profile?.bio}</p>
                <p><strong>Compétences:</strong> {selectedUser.profile?.skills?.map(s => <Tag key={s.id} color="cyan">{s.skill.name} ({s.level})</Tag>)}</p>
                <p><strong>Zones de couverture:</strong> {selectedUser.profile?.coverage_zones?.map(z => <Tag key={z.id} color="purple">{z.name}</Tag>)}</p>
                <p><strong>KYC documents:</strong> {selectedUser.kyc_documents?.length || 0}</p>
                <p><strong>Contacts:</strong> {selectedUser.contacts?.map(c => `${c.contact_type_display}: ${c.value}`).join(', ')}</p>
              </Col>
            </Row>
          </>
        )}
      </Modal>
    </div>
  );
};

export default SkillsList;
