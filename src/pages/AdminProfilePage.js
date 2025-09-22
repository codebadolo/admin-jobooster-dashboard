import React, { useEffect, useState } from 'react';
import {
  Card, Avatar, Typography, List, Tag, Row, Col, Spin, Divider, Button, Modal, Form, Input, message ,Descriptions 
} from 'antd';
import {
  UserOutlined, ProfileOutlined, IdcardOutlined, MailOutlined, EditOutlined, PlusOutlined 
} from '@ant-design/icons';
import authService from '../services/authService'; // Adapter chemin

const { Title, Text, Paragraph } = Typography;

const AdminProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [bioModalVisible, setBioModalVisible] = useState(false);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [skillModalVisible, setSkillModalVisible] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    authService.getCurrentUser()
      .then(data => {
        setUser(data);
        setError(null);
      })
      .catch(err => {
        console.error('Erreur chargement utilisateur:', err);
        setError('Impossible de charger le profil utilisateur.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spin size="large" tip="Chargement du profil..." style={{ marginTop: 100 }} />;
  if (error) return <Text type="danger" style={{ padding: 20 }}>{error}</Text>;
  if (!user) return <Text style={{ padding: 20 }}>Profil utilisateur introuvable.</Text>;

  // Handlers for modals
  const openBioModal = () => {
    form.setFieldsValue({ bio: user.profile.bio });
    setBioModalVisible(true);
  };
  const openContactModal = () => {
    form.setFieldsValue({ contactLabel: '', contactValue: '', contactType: '' });
    setContactModalVisible(true);
  };
  const openSkillModal = () => {
    form.setFieldsValue({ skillName: '' });
    setSkillModalVisible(true);
  };

  const handleBioSubmit = async () => {
    try {
      const values = await form.validateFields(['bio']);
      const updatedProfile = { ...user.profile, bio: values.bio };
      const updatedUser = await userService.updateUser({ ...user, profile: updatedProfile });
      setUser(updatedUser);
      setBioModalVisible(false);
      message.success('Bio mise à jour avec succès');
    } catch (error) {
      message.error('Erreur de mise à jour de la bio');
    }
  };

  const handleContactSubmit = async () => {
    try {
      const values = await form.validateFields(['contactLabel', 'contactValue', 'contactType']);
      // Implémenter la logique d'ajout du contact via API
      // Exemple : userService.createContact({ label: values.contactLabel, value: values.contactValue, contact_type: values.contactType })
      // puis recharger user avec contacts mis à jour
      setContactModalVisible(false);
      message.success('Contact ajouté avec succès (à implémenter)');
    } catch (error) {
      message.error('Erreur d\'ajout de contact');
    }
  };

  const handleSkillSubmit = async () => {
    try {
      const values = await form.validateFields(['skillName']);
      // Implémenter la logique d'ajout de compétence via API
      // Exemple : userService.createSkill({ name: values.skillName })
      // puis recharger user avec compétences mises à jour
      setSkillModalVisible(false);
      message.success('Compétence ajoutée avec succès (à implémenter)');
    } catch (error) {
      message.error('Erreur d\'ajout de compétence');
    }
  };

  return (
    <>
      <Row justify="center" style={{ padding: 24 }}>
        <Col xs={24} sm={22} md={20} lg={16} xl={14}>
          <Card bordered={false} style={{ boxShadow: '0 2px 8px #f0f1f2' }}>
            <Row gutter={24}>
              <Col xs={24} sm={8} style={{ textAlign: 'center' }}>
                {user.profile.photo ? (
                  <Avatar size={150} src={user.profile.photo} />
                ) : (
                  <Avatar size={150} icon={<UserOutlined />} />
                )}
                <Title level={2} style={{ marginTop: 16 }}>
                  {`${user.profile.first_name ?? ''} ${user.profile.last_name ?? ''}`}
                </Title>
                <Text type="secondary">{user.role || 'Rôle non défini'}</Text>
              </Col>
              <Col xs={24} sm={16}>
                <Descriptions title="Informations Utilisateur" bordered column={1} size="middle">
                  <Descriptions.Item label={<MailOutlined />}>{user.email}</Descriptions.Item>
                  <Descriptions.Item label="Bio">
                    <Paragraph>{user.profile.bio || 'Aucune bio disponible.'}</Paragraph>
                    <Button icon={<EditOutlined />} size="small" onClick={openBioModal}>
                      Modifier la bio
                    </Button>
                  </Descriptions.Item>
                  {/* Autres champs ici */}
                </Descriptions>

                <Divider orientation="left" style={{ marginTop: 32 }}>
                  Contacts
                  <Button type="link" icon={<PlusOutlined />} onClick={openContactModal}>
                    Ajouter contact
                  </Button>
                </Divider>
                {user.contacts && user.contacts.length > 0 ? (
                  <List
                    bordered
                    dataSource={user.contacts}
                    renderItem={contact => (
                      <List.Item key={contact.id}>
                        <Text strong>{contact.label}</Text>: {contact.value} ({contact.contact_type})
                      </List.Item>
                    )}
                    style={{ marginBottom: 32 }}
                  />
                ) : (
                  <Text>Aucun contact renseigné.</Text>
                )}

                <Divider orientation="left" style={{ marginBottom: 16 }}>
                  Compétences
                  <Button type="link" icon={<PlusOutlined />} onClick={openSkillModal}>
                    Ajouter compétence
                  </Button>
                </Divider>
                {user.skills && user.skills.length > 0 ? (
                  <List
                    grid={{ gutter: 16, column: 3, xs: 1, sm: 2, md: 3 }}
                    dataSource={user.skills}
                    renderItem={skill => (
                      <List.Item key={skill.id}>
                        <Tag color="blue" style={{ fontSize: 14, padding: '4px 12px' }}>
                          {skill.skill?.name || 'Compétence non renseignée'}
                        </Tag>
                      </List.Item>
                    )}
                  />
                ) : (
                  <Text>Aucune compétence renseignée.</Text>
                )}
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Modal Bio */}
      <Modal
        title="Modifier la bio"
        visible={bioModalVisible}
        onOk={handleBioSubmit}
        onCancel={() => setBioModalVisible(false)}
        okText="Enregistrer"
      >
        <Form form={form} layout="vertical" name="bioForm">
          <Form.Item name="bio" label="Bio" rules={[{ required: true, message: 'Veuillez saisir la bio' }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Contact */}
      <Modal
        title="Ajouter un contact"
        visible={contactModalVisible}
        onOk={handleContactSubmit}
        onCancel={() => setContactModalVisible(false)}
        okText="Ajouter"
      >
        <Form form={form} layout="vertical" name="contactForm">
          <Form.Item name="contactLabel" label="Label" rules={[{ required: true }]}>
            <Input placeholder="Exemple: Téléphone" />
          </Form.Item>
          <Form.Item name="contactValue" label="Valeur" rules={[{ required: true }]}>
            <Input placeholder="Exemple: +33 123 456 789" />
          </Form.Item>
          <Form.Item name="contactType" label="Type" rules={[{ required: true }]}>
            <Input placeholder="Exemple: Mobile, Travail" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Skill */}
      <Modal
        title="Ajouter une compétence"
        visible={skillModalVisible}
        onOk={handleSkillSubmit}
        onCancel={() => setSkillModalVisible(false)}
        okText="Ajouter"
      >
        <Form form={form} layout="vertical" name="skillForm">
          <Form.Item name="skillName" label="Nom de la compétence" rules={[{ required: true }]}>
            <Input placeholder="Exemple: Python, Django" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AdminProfilePage;
