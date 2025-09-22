import React, { useEffect, useState } from 'react';
import {
  Card, Avatar, Typography, List, Tag, Row, Col, Spin, Divider, Descriptions,
  Form, Input, Button, Checkbox, message
} from 'antd';
import {
  UserOutlined, ProfileOutlined, MailOutlined, TeamOutlined, CheckCircleOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import userService from '../services/userService'; // Assurez-vous que userService a updateUser

const { Title, Text, Paragraph } = Typography;

const AdminProfileEditPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    userService.getCurrentUser()
      .then(data => {
        setUser(data);
        // Initialiser les valeurs dans le formulaire
        form.setFieldsValue({
          email: data.email,
          first_name: data.profile?.first_name,
          last_name: data.profile?.last_name,
          bio: data.profile?.bio,
          geographic_zone: data.profile?.geographic_zone,
          subscription_status: data.profile?.subscription_status,
          availability: data.profile?.availability,
          verified_badge: data.profile?.verified_badge,
        });
        setError(null);
      })
      .catch(err => {
        console.error('Erreur chargement utilisateur:', err);
        setError('Impossible de charger le profil utilisateur.');
      })
      .finally(() => setLoading(false));
  }, [form]);

  if (loading) return <Spin size="large" tip="Chargement en cours..." style={{ marginTop: 100 }} />;
  if (error) return <Text type="danger" style={{ padding: 20 }}>{error}</Text>;
  if (!user) return <Text style={{ padding: 20 }}>Profil utilisateur introuvable.</Text>;

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      // Appeler API updateUser (à implémenter dans userService)
      await userService.updateUser({ ...user, profile: { ...user.profile, ...values } });
      message.success('Profil mis à jour avec succès');
      setUser(prev => ({
        ...prev,
        email: values.email,
        profile: { ...prev.profile, ...values }
      }));
    } catch (err) {
      message.error('Erreur lors de la mise à jour');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Row justify="center" style={{ padding: 24 }}>
      <Col xs={24} sm={22} md={20} lg={16} xl={14}>
        <Card bordered={false} style={{ boxShadow: '0 2px 8px #f0f1f2' }}>
          <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ availability: false, verified_badge: false }}>
            <Row gutter={24}>
              <Col xs={24} sm={8} style={{ textAlign: 'center' }}>
                {user.profile?.photo ? (
                  <Avatar size={150} src={user.profile.photo} />
                ) : (
                  <Avatar size={150} icon={<UserOutlined />} />
                )}
                <Title level={2} style={{ marginTop: 16 }}>
                  {`${user.profile?.first_name ?? ''} ${user.profile?.last_name ?? ''}`}
                </Title>
                <Text type="secondary">{user.role || 'Rôle non défini'}</Text>
              </Col>
              <Col xs={24} sm={16}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, type: 'email', message: 'Veuillez saisir un email valide' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item label="Prénom" name="first_name" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item label="Nom" name="last_name" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item label="Bio" name="bio">
                  <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item label="Zone Géographique" name="geographic_zone">
                  <Input />
                </Form.Item>
                <Form.Item label="Statut d'abonnement" name="subscription_status">
                  <Input />
                </Form.Item>
                <Form.Item name="availability" valuePropName="checked">
                  <Checkbox>Disponible</Checkbox>
                </Form.Item>
                <Form.Item name="verified_badge" valuePropName="checked">
                  <Checkbox>Badge Vérifié</Checkbox>
                </Form.Item>

                <Divider />

                <Button type="primary" htmlType="submit" loading={submitting} block>
                  Mettre à jour le profil
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default AdminProfileEditPage;
