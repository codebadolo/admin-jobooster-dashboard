import React, { useEffect, useState } from 'react';
import {
  Layout, Descriptions, Card, Avatar, Spin, message, Row, Col,
  Statistic, Breadcrumb, Tag, Progress, Modal, Rate, Badge
} from 'antd';
import {
  UserOutlined, MailOutlined, GlobalOutlined, CheckCircleOutlined,
  CrownOutlined, ProfileOutlined, ReadOutlined, StarOutlined,
  LinkedinOutlined, FacebookOutlined, PhoneOutlined, TwitterOutlined
} from '@ant-design/icons';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';

const { Header, Content, Sider } = Layout;

const iconByContactType = {
  linkedin: <LinkedinOutlined style={{ color: '#0077b5' }} />,
  facebook: <FacebookOutlined style={{ color: '#4267B2' }} />,
  email: <MailOutlined style={{ color: '#444' }} />,
  phone: <PhoneOutlined style={{ color: '#4caf50' }} />,
  twitter: <TwitterOutlined style={{ color: '#1DA1F2' }} />,
  website: <GlobalOutlined />,
};

const levelToPercent = { debutant: 30, intermediaire: 60, expert: 90 };

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

// Fonction pour label badge selon note moyenne
const ratingBadge = (rating) => {
  if (rating >= 4.5) return <Badge status="success" text="Excellent" />;
  if (rating >= 3.5) return <Badge status="processing" text="Bon" />;
  if (rating >= 2.5) return <Badge status="warning" text="Moyen" />;
  return <Badge status="error" text="Faible" />;
};

// Calcule la moyenne des notes reçues
const averageRating = (ratings) => {
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, r) => acc + r.rating_value, 0);
  return sum / ratings.length;
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
      const res = await axiosInstance.get(`users/admin/users/${id}/`);
      setUser(res.data);
    } catch (error) {
      message.error('Erreur lors du chargement des détails utilisateur');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !user) {
    return <Spin tip="Chargement..." style={{ display: 'block', marginTop: 100, textAlign: 'center' }} />;
  }

  const {
    profile = {},
    promotions = [],
    badges = [],
    contacts = [],
    given_ratings = [],
    received_ratings = [],
    kyc_documents = [],
    payment_methods = [],
  } = user;

  const skills = profile.skills || [];
  const portfolioRealizations = profile.portfolio?.realisations || [];

  const sex = profile.sex;
  const sexLabel = sexLabels[sex] || { text: "Inconnu", color: 'default' };
  const ageRange = profile.age_range;
  const ageRangeLabel = ageRangeLabels[ageRange] || '-';

  const showModal = () => setIsModalVisible(true);
  const handleModalCancel = () => setIsModalVisible(false);

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
        <Sider width={320} style={{ background: '#fff', overflow: 'auto', height: 'calc(100vh - 64px)', position: 'sticky', top: 64, padding: 12 }}>

          <Card style={{ marginBottom: 16, textAlign: 'center' }}>
            {profile.photo ? (
              <img alt="photo-profil" src={profile.photo} style={{ width: 120, borderRadius: '50%', cursor: 'pointer' }} onClick={showModal} />
            ) : (
              <Avatar size={120} icon={<UserOutlined />} onClick={showModal} style={{ cursor: 'pointer' }} />
            )}
            <h3 style={{ marginTop: 12 }}>{profile.first_name} {profile.last_name}</h3>
            <p><MailOutlined /> {user.email}</p>
          </Card>

          <Card style={{ marginBottom: 16 }}>
            <Statistic title="Actif" value={user.is_active ? 'Oui' : 'Non'} prefix={<CheckCircleOutlined />} style={{ marginBottom: 16 }} />
            <Statistic title="Rôle" value={user.role} prefix={<CrownOutlined />} style={{ marginBottom: 16 }} />
            <Statistic title="Abonnement" value={profile.subscription_status || '-'} prefix={<ProfileOutlined />} style={{ marginBottom: 16 }} />
            <Statistic title="Vérifié" value={profile.verified_badge ? 'Oui' : 'Non'} prefix={<StarOutlined />} />
          </Card>

          <Card size="small" title="Contacts" bordered>
            {contacts.length > 0 ? contacts.map(c => (
              <p key={c.id}>{iconByContactType[c.contact_type.toLowerCase()] || <GlobalOutlined />} <b>{c.contact_type.toUpperCase()}</b>: {c.value}</p>
            )) : <p>Aucun contact</p>}
          </Card>

          <Card size="small" title="Badges" bordered style={{ marginTop: 16 }}>
            {badges.length > 0 ? badges.map(b => (
              <p key={b.id}>{b.badge_type_display} ({new Date(b.awarded_at).toLocaleDateString()})</p>
            )) : <p>Aucun badge</p>}
          </Card>

          <Card size="small" title="Promotions" bordered style={{ marginTop: 16 }}>
            {promotions.length > 0 ? promotions.map(p => (
              <p key={p.id}>{p.description} - {p.discount_percentage}% ({new Date(p.start_datetime).toLocaleDateString()} à {new Date(p.end_datetime).toLocaleDateString()})</p>
            )) : <p>Aucune promotion</p>}
          </Card>

          <Card size="small" title="Documents KYC" bordered style={{ marginTop: 16 }}>
            {kyc_documents.length > 0 ? kyc_documents.map(doc => (
              <p key={doc.id}>
                <b>{doc.document_type_display || doc.document_type}</b> - {doc.document_file ? (<a href={doc.document_file} target="_blank" rel="noopener noreferrer">Voir document</a>) : 'Pas de fichier'}<br />
                Vérifié: {doc.verified ? 'Oui' : 'Non'}<br />
                Vérifié par: {doc.verified_by_email || '-'}<br />
                Date de vérification: {doc.verified_at ? new Date(doc.verified_at).toLocaleDateString() : '-'}
              </p>
            )) : <p>Aucun document KYC disponible.</p>}
          </Card>

          <Card size="small" title="Méthodes de paiement" bordered style={{ marginTop: 16 }}>
            {payment_methods.length > 0 ? payment_methods.map(pm => (
              <p key={pm.id}><b>{pm.payment_type_display || pm.payment_type}</b> - Téléphone: {pm.phone_number} {pm.is_primary ? '(Principal)' : ''}</p>
            )) : <p>Aucune méthode de paiement disponible.</p>}
          </Card>

        </Sider>

        <Content style={{ padding: 24, overflowY: 'auto', height: 'calc(100vh - 64px)' }}>
          <Card title="Détails personnels" bordered style={{ marginBottom: 24 }}>
            <Descriptions size="middle" column={1} bordered>
              <Descriptions.Item label="Sexe"><Tag color={sexLabel.color}>{sexLabel.text}</Tag></Descriptions.Item>
              <Descriptions.Item label="Tranche d'âge">{ageRangeLabel}</Descriptions.Item>
              <Descriptions.Item label="Disponibilité">{profile.availability ? 'Disponible' : 'Indisponible'}</Descriptions.Item>
              <Descriptions.Item label="Zones de couverture">{profile.coverage_zones?.map(z => <Tag key={z.id}>{z.name}</Tag>) || '-'}</Descriptions.Item>
              <Descriptions.Item label="Biographie"><ReadOutlined /> {profile.bio || '-'}</Descriptions.Item>
              <Descriptions.Item label="Localisation">{profile.location || '-'}</Descriptions.Item>
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

          <Card title="Ratings donnés" bordered style={{ marginBottom: 24 }}>
            {given_ratings.length > 0 ? given_ratings.map(r => (
              <div key={r.id} style={{ marginBottom: 12 }}>
                <Rate disabled defaultValue={r.rating_value} />
                <p>{r.comment || '-'}</p>
                <small>Note donnée à : {r.rated_email}</small>
              </div>
            )) : <p>Aucun rating donné.</p>}
          </Card>

          <Card title="Ratings reçus" bordered style={{ marginBottom: 24 }}>
            <div style={{ marginBottom: 16 }}>
              <Rate disabled allowHalf value={averageRating(received_ratings)} />
              {ratingBadge(averageRating(received_ratings))}
              <p>Moyenne de {received_ratings.length} évaluations</p>
            </div>
            {received_ratings.length > 0 ? received_ratings.map(r => (
              <div key={r.id} style={{ marginBottom: 12 }}>
                <Rate disabled defaultValue={r.rating_value} />
                <p>{r.comment || '-'}</p>
                <small>Note donnée par : {r.rater_email}</small>
              </div>
            )) : <p>Aucun rating reçu.</p>}
          </Card>

          <Card title="Portfolio - Réalisations" bordered>
            {portfolioRealizations.length > 0 ? portfolioRealizations.map(r => (
              <p key={r.id}><b>{r.title}</b>: {r.description}</p>
            )) : (
              <p>Aucune réalisation disponible.</p>
            )}
          </Card>

          <Modal visible={isModalVisible} footer={null} onCancel={handleModalCancel} centered bodyStyle={{ padding: 0, textAlign: 'center' }}>
            {profile.photo ? (
              <img alt="photo-profil-plein" src={profile.photo} style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }} />
            ) : (
              <Avatar size={200} icon={<UserOutlined />} />
            )}
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserDetail;
