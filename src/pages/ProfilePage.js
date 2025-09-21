import React, { useEffect, useState } from 'react';
import { Card, Avatar, Typography, List, Tag, Row, Col, Spin } from 'antd';
import { UserOutlined, ProfileOutlined, IdcardOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Remplacez '/api/users/me' par votre endpoint API vrai
    axios.get('/api/users/me/')
      .then(response => {
        setProfile(response.data);
      })
      .catch(error => {
        console.error('Erreur chargement profil :', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <Spin style={{ marginTop: 100 }} size="large" />;

  if (!profile) return <Text>Erreur: Impossible de charger le profil.</Text>;

  return (
    <Row justify="center" style={{ padding: 24 }}>
      <Col xs={24} sm={20} md={16} lg={12}>
        <Card>
          <Card.Meta
            avatar={
              profile.photo 
                ? <Avatar size={100} src={profile.photo} />
                : <Avatar size={100} icon={<UserOutlined />} />
            }
            title={<Title level={2}>{`${profile.first_name} ${profile.last_name}`}</Title>}
            description={
              <>
                <Text><IdcardOutlined /> Rôle: {profile.role || 'Non défini'}</Text><br />
                <Text><ProfileOutlined /> Bio :</Text>
                <Paragraph>{profile.bio || 'Aucune bio disponible.'}</Paragraph>
              </>
            }
          />
          
          <div style={{ marginTop: 24 }}>
            <Title level={4}>Compétences</Title>
            {profile.skills && profile.skills.length > 0 ? (
              <List
                grid={{ gutter: 16, column: 3 }}
                dataSource={profile.skills}
                renderItem={item => (
                  <List.Item>
                    <Tag color="blue">{item.skill.name}</Tag>
                  </List.Item>
                )}
              />
            ) : (
              <Text>Aucune compétence renseignée.</Text>
            )}
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default ProfilePage;
