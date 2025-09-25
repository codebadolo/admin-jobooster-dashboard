import React, { useEffect, useState } from 'react';
import {
  Layout, Descriptions, Card, Avatar, Spin, message, Row, Col,
  Statistic, Breadcrumb, Space, Progress, Modal, Tag
} from 'antd';
import {
  UserOutlined, MailOutlined, GlobalOutlined, CheckCircleOutlined,
  CrownOutlined, ProfileOutlined, ReadOutlined, StarOutlined,
  LinkedinOutlined, FacebookOutlined, PhoneOutlined, TwitterOutlined
} from '@ant-design/icons';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';

const { Header, Content } = Layout;

const iconByContactType = {
  linkedin: <LinkedinOutlined style={{ color: '#0077b5' }} />,
  facebook: <FacebookOutlined style={{ color: '#4267B2' }} />,
  email: <MailOutlined style={{ color: '#444' }} />,
  phone: <PhoneOutlined style={{ color: '#4caf50' }} />,
  twitter: <TwitterOutlined style={{ color: '#1DA1F2' }} />,
  website: <GlobalOutlined />,
};

const levelToPercent = {
  debutant: 30,
  intermediaire: 60,
  expert: 90,
};

const sexLabels = {
  M: { text: "Masculin", color: 'blue' },
  F: { text: "Féminin", color: 'pink' },
  O: { text: "Autre", color: 'purple' },
};

const ageRangeLabels = {
  under_18: 'Moins de 18 ans',
  '18_25': '18-25 ans',
  '26_35': '26-35 ans',
  '36_50': '36-50 ans',
  over_50: 'Plus de 50 ans',
  unknown: '-',
};

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => { fetchUser(); }, [id]);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`users/admin-users/${id}/`);
      setUser(response.data);
    } catch (error) {
      message.error('Erreur lors du chargement des détails utilisateur');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !user) {
    return <Spin tip="Chargement..." style={{ display: 'block', marginTop: 100, textAlign: 'center' }} />;
  }

  const skills = user.skills || [];

  const showModal = () => setIsModalVisible(true);
  const handleModalCancel = () => setIsModalVisible(false);

  const sex = user.profile?.sex;
  const sexLabel = sexLabels[sex] || { text: "Inconnu", color: 'default' };
  const ageRange = user.profile?.age_range;
  const ageRangeLabel = ageRangeLabels[ageRange] || '-';

  return (
    <Layout style={{ height: '100vh' }}>
      <Header style={{ background: '#fff', padding: 16 }}>
        <Breadcrumb>
          <Breadcrumb.Item><Link to="/"><UserOutlined /> Dashboard</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to="/users">Utilisateurs</Link></Breadcrumb.Item>
          <Breadcrumb.Item>Détail utilisateur</Breadcrumb.Item>
        </Breadcrumb>
      </Header>

      <Layout>
        <Layout.Sider
          width={320}
          style={{ background: '#fff', overflow: 'auto', height: 'calc(100vh - 64px)', position: 'sticky', top: 64, padding: 12 }}
        >
          <Card style={{ marginBottom: 16, textAlign: 'center' }}>
            {user.profile?.photo ? (
              <img
                alt="photo-profile"
                src={user.profile.photo}
                style={{ width: 120, borderRadius: '50%', cursor: 'pointer' }}
                onClick={showModal}
              />
            ) : (
              <Avatar size={120} icon={<UserOutlined />} onClick={showModal} style={{ cursor: 'pointer' }} />
            )}
            <h3 style={{ marginTop: 12 }}>
              {user.profile?.first_name} {user.profile?.last_name}
            </h3>
            <p><MailOutlined /> {user.email}</p>
          </Card>

          <Card style={{ marginBottom: 16 }}>
            <Statistic
              title="Actif"
              value={user.is_active ? 'Oui' : 'Non'}
              prefix={<CheckCircleOutlined />}
              style={{ marginBottom: 16 }}
            />
            <Statistic
              title="Rôle"
              value={user.role}
              prefix={<CrownOutlined />}
              style={{ marginBottom: 16 }}
            />
            <Statistic
              title="Abonnement"
              value={user.profile?.subscription_status || '-'}
              prefix={<ProfileOutlined />}
              style={{ marginBottom: 16 }}
            />
            <Statistic
              title="Vérifié"
              value={user.profile?.verified_badge ? 'Oui' : 'Non'}
              prefix={<StarOutlined />}
            />
          </Card>

          <Card size="small" title="Contacts" bordered>
            {user.contacts && user.contacts.length > 0 ? (
              user.contacts.map(contact => (
                <p key={contact.id}>
                  {iconByContactType[contact.contact_type.toLowerCase()] || <GlobalOutlined />}
                  {' '}
                  <b>{contact.contact_type.toUpperCase()}:</b> {contact.value}
                </p>
              ))
            ) : (
              <p>Aucun contact</p>
            )}
          </Card>
        </Layout.Sider>

        <Layout.Content style={{ padding: '24px', overflowY: 'auto', height: 'calc(100vh - 64px)' }}>

          <Card title="Détails Personnels" bordered style={{ marginBottom: 24 }}>
            <Descriptions size="middle" column={1} bordered>
              <Descriptions.Item label="Sexe">
                <Tag color={sexLabel.color}>{sexLabel.text}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Tranche d'âge">
                {ageRangeLabel}
              </Descriptions.Item>
              <Descriptions.Item label="Disponibilité">
                {user.profile?.availability ? 'Disponible' : 'Indisponible'}
              </Descriptions.Item>
              <Descriptions.Item label="Zone Géographique">
                <GlobalOutlined /> {user.profile?.geographic_zone || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Biographie">
                <ReadOutlined /> {user.profile?.bio || '-'}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="Compétences" bordered style={{ marginBottom: 24 }}>
            {skills.length > 0 ? (
              <Row gutter={[16, 16]}>
                {skills.map(({ id, skill, level, years_experience, details }) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={id}>
                    <Card type="inner" title={`${skill.name} (${level})`} style={{ marginBottom: 16 }}>
                      <Progress percent={levelToPercent[level] || 0} status="active" />
                      <p><b>Années d'expérience:</b> {years_experience}</p>
                      <p>{details || skill.description || 'Pas de détails'}</p>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <p>Aucune compétence renseignée.</p>
            )}
          </Card>

          <Card title="CVs" bordered>
            {user.profile?.cvs && user.profile.cvs.length > 0 ? (
              user.profile.cvs.map(cv => (
                <p key={cv.id}>
                  <a href={cv.file_url} target="_blank" rel="noopener noreferrer">
                    {cv.description || "CV sans description"} - Télécharger
                  </a>{' '}
                  <small>({new Date(cv.uploaded_at).toLocaleDateString()})</small>
                </p>
              ))
            ) : (<p>Aucun CV disponible.</p>)}
          </Card>

          <Modal
            visible={isModalVisible}
            footer={null}
            onCancel={handleModalCancel}
            centered
            bodyStyle={{ padding: 0, textAlign: 'center' }}
          >
            {user.profile?.photo ? (
              <img
                alt="photo-profile-full"
                src={user.profile.photo}
                style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }}
              />
            ) : (
              <Avatar size={200} icon={<UserOutlined />} />
            )}
          </Modal>

        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default UserDetail;
