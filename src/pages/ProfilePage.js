import React, { useEffect, useState } from 'react';
import { Card, Avatar, Typography, List, Tag, Row, Col, Spin, Divider } from 'antd';
import { UserOutlined, ProfileOutlined, IdcardOutlined } from '@ant-design/icons';
import { getProfile } from '../api/userService'; // Assurez-vous du bon chemin

const { Title, Text, Paragraph } = Typography;

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProfile()
      .then(data => {
        setProfile(data);
        setError(null);
      })
      .catch(err => {
        console.error('Erreur chargement profil:', err);
        setError('Impossible de charger le profil.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spin style={{ marginTop: 100 }} size="large" tip="Chargement du profil..." />;

  if (error) return <Text type="danger" style={{ padding: 20 }}>{error}</Text>;

  if (!profile) return <Text style={{ padding: 20 }}>Le profil est introuvable.</Text>;

  return (
    <Row justify="center" style={{ padding: 24 }}>
      <Col xs={24} sm={20} md={16} lg={12}>
        <Card bordered={false} style={{ boxShadow: '0 2px 8px #f0f1f2' }}>
          <Card.Meta
            avatar={
              profile.photo ? (
                <Avatar size={100} src={profile.photo} />
              ) : (
                <Avatar size={100} icon={<UserOutlined />} />
              )
            }
            title={<Title level={2}>{`${profile.first_name ?? ''} ${profile.last_name ?? ''}`}</Title>}
            description={
              <>
                <Text>
                  <IdcardOutlined style={{ marginRight: 6 }} />
                  Rôle : <Text strong>{profile.role || 'Non défini'}</Text>
                </Text>
                <Divider />
                <Text>
                  <ProfileOutlined style={{ marginRight: 6 }} />
                  Bio :
                </Text>
                <Paragraph style={{ marginTop: 8 }}>
                  {profile.bio || 'Aucune bio disponible.'}
                </Paragraph>
              </>
            }
          />

          <Divider orientation="left" style={{ marginTop: 32 }}>
            Compétences
          </Divider>
          {profile.skills && Array.isArray(profile.skills) && profile.skills.length > 0 ? (
            <List
              grid={{ gutter: 16, column: 3, xs: 1, sm: 2, md: 3 }}
              dataSource={profile.skills}
              renderItem={(item) => (
                <List.Item key={item.id}>
                  <Tag color="blue" style={{ fontSize: 14, padding: '4px 12px' }}>
                    {item.skill?.name ?? 'Compétence non renseignée'}
                  </Tag>
                </List.Item>
              )}
            />
          ) : (
            <Text>Aucune compétence renseignée.</Text>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default ProfilePage;
