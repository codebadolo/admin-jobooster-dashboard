import React, { useEffect, useState, useMemo } from 'react';
import {
  Layout, Breadcrumb, Row, Col, Card, Avatar, Typography, Descriptions, List, Tag, Divider,
  Button, Modal, Form, Input, message, Spin, Rate, Upload
} from 'antd';
import {
  UserOutlined, MailOutlined, EditOutlined,
  PhoneOutlined, PlusOutlined, TagOutlined, FileTextOutlined, StarOutlined, HomeOutlined,
  LinkedinOutlined, WhatsAppOutlined, MailFilled, UploadOutlined
} from '@ant-design/icons';
import authService from '../services/authService';

const { Header, Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const contactIconMap = {
  email: <MailFilled />,
  phone: <PhoneOutlined />,
  linkedin: <LinkedinOutlined />,
  whatsapp: <WhatsAppOutlined />,
  other: <UserOutlined />,
};

const AdminProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [bioModalVisible, setBioModalVisible] = useState(false);
  const [skillModalVisible, setSkillModalVisible] = useState(false);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [cvModalVisible, setCvModalVisible] = useState(false);

  const [form] = Form.useForm();
  const [formSkill] = Form.useForm();
  const [formContact] = Form.useForm();
  const [formCv] = Form.useForm();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await authService.getCurrentUser();
        setUser(data);
        setError(null);
      } catch (e) {
        setError('Erreur chargement du profil utilisateur');
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // Modals open handlers
  const openBioModal = () => {
    form.setFieldsValue({ bio: user.profile?.bio || '' });
    setBioModalVisible(true);
  };

  const openSkillModal = () => {
    formSkill.resetFields();
    setSkillModalVisible(true);
  };

  const openContactModal = () => {
    formContact.resetFields();
    setContactModalVisible(true);
  };

  const openCvModal = () => {
    formCv.resetFields();
    setCvModalVisible(true);
  };

  // Submit handlers
  const handleBioSubmit = async () => {
    try {
      const values = await form.validateFields();
      const updated = await authService.updateProfilePartial({ bio: values.bio });
      setUser(prev => ({ ...prev, profile: { ...prev.profile, bio: updated.bio } }));
      setBioModalVisible(false);
      message.success('Bio mise à jour');
    } catch (error) {
      message.error('Erreur mise à jour bio');
    }
  };

  const handleAddSkill = async () => {
    try {
      const values = await formSkill.validateFields();
      const newSkill = await authService.addSkill(values);
      setUser(prev => ({ ...prev, skills: [...prev.skills, newSkill] }));
      setSkillModalVisible(false);
      message.success('Compétence ajoutée');
    } catch {
      message.error('Erreur ajout compétence');
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      await authService.deleteSkill(id);
      setUser(prev => ({ ...prev, skills: prev.skills.filter(s => s.id !== id) }));
      message.success('Compétence supprimée');
    } catch {
      message.error('Erreur suppression compétence');
    }
  };

  const handleAddContact = async () => {
    try {
      const values = await formContact.validateFields();
      const newContact = await authService.addContact(values);
      setUser(prev => ({ ...prev, contacts: [...prev.contacts, newContact] }));
      setContactModalVisible(false);
      message.success('Contact ajouté');
    } catch {
      message.error('Erreur ajout contact');
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      await authService.deleteContact(id);
      setUser(prev => ({ ...prev, contacts: prev.contacts.filter(c => c.id !== id) }));
      message.success('Contact supprimé');
    } catch {
      message.error('Erreur suppression contact');
    }
  };

  const handleAddCv = async () => {
    try {
      const values = await formCv.validateFields();
      // FormData pour upload fichier
      const formData = new FormData();
      formData.append('description', values.description);
      formData.append('file', values.file.file.originFileObj);

      const newCv = await authService.addCv(formData);
      setUser(prev => ({ ...prev, profile: { ...prev.profile, cvs: [...prev.profile.cvs, newCv] } }));
      setCvModalVisible(false);
      message.success('CV ajouté');
    } catch {
      message.error('Erreur ajout CV');
    }
  };

  const handleDeleteCv = async (id) => {
    try {
      await authService.deleteCv(id);
      setUser(prev => ({
        ...prev,
        profile: { ...prev.profile, cvs: prev.profile.cvs.filter(cv => cv.id !== id) }
      }));
      message.success('CV supprimé');
    } catch {
      message.error('Erreur suppression CV');
    }
  };

  const averageRating = useMemo(() => {
    if (!user?.profile?.received_ratings || user.profile.received_ratings.length === 0) return 0;
    const sum = user.profile.received_ratings.reduce((acc, r) => acc + r.rating_value, 0);
    return sum / user.profile.received_ratings.length;
  }, [user]);

  if (loading) return <Spin size="large" tip="Chargement du profil..." style={{ marginTop: 100 }} />;
  if (error) return <Text type="danger" style={{ padding: 20 }}>{error}</Text>;
  if (!user) return <Text style={{ padding: 20 }}>Profil utilisateur introuvable.</Text>;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ backgroundColor: '#001529' }}>
        <Title level={3} style={{ color: 'white', margin: '16px 24px' }}>Administration - Profil</Title>
      </Header>
      <Content style={{ padding: '24px 48px' }}>
        <Breadcrumb style={{ marginBottom: 24 }}>
          <Breadcrumb.Item href="/"><HomeOutlined /></Breadcrumb.Item>
          <Breadcrumb.Item>Administration</Breadcrumb.Item>
          <Breadcrumb.Item>Profil Utilisateur</Breadcrumb.Item>
        </Breadcrumb>

        <Row gutter={[24, 24]} justify="center">
          {/* Colonne Profil, avatar et bio */}
          <Col xs={24} sm={24} md={8}>
            <Card bordered={false} style={{ boxShadow: '0 4px 12px rgb(0 0 0 / 0.1)' }}>
              <div style={{ textAlign: 'center' }}>
                {user.profile?.photo ? (
                  <Avatar size={140} src={user.profile.photo} />
                ) : (
                  <Avatar size={140} icon={<UserOutlined />} />
                )}
                <Title level={2} style={{ margin: '16px 0' }}>
                  {`${user.profile?.first_name ?? ''} ${user.profile?.last_name ?? ''}`}
                </Title>
                <Text type="secondary" style={{ fontSize: 16, fontWeight: 'bold' }}>
                  {user.role || 'Rôle non défini'}
                </Text>
              </div>

              <Divider orientation="left">Bio</Divider>
              <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
                {user.profile?.bio || 'Aucune bio disponible.'}
              </Paragraph>
              <Button icon={<EditOutlined />} type="primary" block onClick={openBioModal}>
                Modifier la bio
              </Button>
            </Card>
          </Col>

          {/* Colonne Informations, contacts, compétences, etc */}
          <Col xs={24} sm={24} md={16}>
            <Card bordered={false} style={{ boxShadow: '0 4px 12px rgb(0 0 0 / 0.1)' }}>
              <Descriptions title="Informations générales" bordered column={1} size="small" layout="horizontal">
                <Descriptions.Item label={<MailOutlined />}>Email</Descriptions.Item>
                <Descriptions.Item>{user.email}</Descriptions.Item>
                <Descriptions.Item label="Sexe">{user.profile?.sex || 'Non renseigné'}</Descriptions.Item>
                <Descriptions.Item label="Zone géographique">{user.profile?.geographic_zone || 'Non renseigné'}</Descriptions.Item>
                <Descriptions.Item label="Tranche d'âge">{user.profile?.age_range || 'Non renseigné'}</Descriptions.Item>
              </Descriptions>

              <Divider orientation="left" style={{ marginTop: 24 }}>
                <PhoneOutlined /> Contacts
                <Button type="link" icon={<PlusOutlined />} style={{ float: 'right' }} onClick={openContactModal}>
                  Ajouter contact
                </Button>
              </Divider>
              {user.contacts?.length > 0 ? (
                <List
                  bordered
                  dataSource={user.contacts}
                  renderItem={contact => (
                    <List.Item key={contact.id} actions={[
                      <Button danger type="link" size="small" onClick={() => handleDeleteContact(contact.id)}>Supprimer</Button>
                    ]}>
                      {contactIconMap[contact.contact_type] || <UserOutlined />} &nbsp;
                      <Text strong>{contact.label}</Text>: {contact.value} ({contact.contact_type})
                    </List.Item>
                  )}
                  style={{ marginBottom: 20 }}
                />
              ) : (
                <Text>Aucun contact renseigné.</Text>
              )}

              <Divider orientation="left" style={{ marginTop: 24 }}>
                <TagOutlined /> Compétences
                <Button type="link" icon={<PlusOutlined />} style={{ float: 'right' }} onClick={openSkillModal}>
                  Ajouter compétence
                </Button>
              </Divider>
              {user.skills?.length > 0 ? (
                <List
                  grid={{ gutter: 12, column: 3, xs: 1, sm: 2, md: 3 }}
                  dataSource={user.skills}
                  renderItem={skill => (
                    <List.Item key={skill.id} actions={[
                      <Button danger type="link" size="small" onClick={() => handleDeleteSkill(skill.id)}>Supprimer</Button>
                    ]}>
                      <Tag color="blue" style={{ fontSize: 14, padding: '6px 14px' }}>
                        {skill.skill?.name || 'Compétence non renseignée'}
                      </Tag>
                      <div>
                        <Text><b>Années d'expérience:</b> {skill.years_experience}</Text><br />
                        <Text type="secondary">{skill.details || ''}</Text>
                      </div>
                    </List.Item>
                  )}
                />
              ) : (
                <Text>Aucune compétence renseignée.</Text>
              )}

              <Divider orientation="left" style={{ marginTop: 24 }}>
                <FileTextOutlined /> CVs
                <Button type="link" icon={<PlusOutlined />} style={{ float: 'right' }} onClick={openCvModal}>
                  Ajouter CV
                </Button>
              </Divider>
              {user.profile?.cvs && user.profile.cvs.length > 0 ? (
                <List
                  bordered
                  dataSource={user.profile.cvs}
                  renderItem={cv => (
                    <List.Item key={cv.id} actions={[
                      <Button danger type="link" size="small" onClick={() => handleDeleteCv(cv.id)}>Supprimer</Button>
                    ]}>
                      <a href={cv.file} target="_blank" rel="noopener noreferrer">
                        {cv.description || 'CV sans description'}
                      </a>
                    </List.Item>
                  )}
                  style={{ marginBottom: 20 }}
                />
              ) : (
                <Text>Aucun CV disponible.</Text>
              )}

              <Divider orientation="left" style={{ marginTop: 24 }}>
                <StarOutlined /> Notes Reçues
                {averageRating > 0 && (
                  <div style={{ float: 'right' }}>
                    <Rate disabled allowHalf defaultValue={averageRating} />
                    <Text style={{ marginLeft: 8 }}>{averageRating.toFixed(1)} / 5</Text>
                  </div>
                )}
              </Divider>
              {user.profile?.received_ratings && user.profile.received_ratings.length > 0 ? (
                <List
                  bordered
                  dataSource={user.profile.received_ratings}
                  renderItem={rating => (
                    <List.Item key={rating.id}>
                      <List.Item.Meta
                        avatar={
                          rating.rater_profile?.photo_url ? (
                            <Avatar src={rating.rater_profile.photo_url} />
                          ) : (
                            <Avatar icon={<UserOutlined />} />
                          )
                        }
                        title={`${rating.rater_profile?.first_name || ''} ${rating.rater_profile?.last_name || ''}`}
                        description={
                          <>
                            <Rate disabled defaultValue={rating.rating_value} />
                            <br />
                            <Text>{rating.comment || 'Pas de commentaire'}</Text>
                          </>
                        }
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <Text>Aucune note reçue.</Text>
              )}
            </Card>
          </Col>
        </Row>

        {/* Modals */}
        {/* Modal Bio */}
        <Modal
          title="Modifier la bio"
          open={bioModalVisible}
          onOk={handleBioSubmit}
          onCancel={() => setBioModalVisible(false)}
          okText="Enregistrer"
          cancelText="Annuler"
        >
          <Form form={form} layout="vertical" name="bioForm">
            <Form.Item
              name="bio"
              label="Bio"
              rules={[{ required: true, message: 'Veuillez saisir une bio' }]}
            >
              <Input.TextArea rows={5} />
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal Add Skill */}
        <Modal
          title="Ajouter une compétence"
          open={skillModalVisible}
          onOk={handleAddSkill}
          onCancel={() => setSkillModalVisible(false)}
          okText="Ajouter"
          cancelText="Annuler"
        >
          <Form form={formSkill} layout="vertical" name="skillForm">
            <Form.Item
              name="skill"
              label="Compétence (ID)"
              rules={[{ required: true, message: 'Veuillez saisir une compétence' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="level"
              label="Niveau"
              rules={[{ required: true, message: 'Veuillez saisir un niveau' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="years_experience"
              label="Années d'expérience"
              rules={[{ required: true, message: 'Veuillez saisir les années d\'expérience' }]}
            >
              <Input type="number" min={0} />
            </Form.Item>
            <Form.Item
              name="details"
              label="Détails"
              rules={[{ required: false }]}
            >
              <Input.TextArea />
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal Add Contact */}
        <Modal
          title="Ajouter un contact"
          open={contactModalVisible}
          onOk={handleAddContact}
          onCancel={() => setContactModalVisible(false)}
          okText="Ajouter"
          cancelText="Annuler"
        >
          <Form form={formContact} layout="vertical" name="contactForm">
            <Form.Item
              name="label"
              label="Nom du contact"
              rules={[{ required: true, message: 'Veuillez saisir un label' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="value"
              label="Valeur"
              rules={[{ required: true, message: 'Veuillez saisir une valeur' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="contact_type"
              label="Type"
              rules={[{ required: true, message: 'Veuillez saisir un type' }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal Add CV */}
        <Modal
          title="Ajouter un CV"
          open={cvModalVisible}
          onOk={handleAddCv}
          onCancel={() => setCvModalVisible(false)}
          okText="Ajouter"
          cancelText="Annuler"
        >
          <Form form={formCv} layout="vertical" name="cvForm" encType="multipart/form-data">
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Veuillez saisir une description' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="file"
              label="Fichier CV"
              valuePropName="file"
              getValueFromEvent={e => e.fileList[0]}
              rules={[{ required: true, message: 'Veuillez joindre un fichier' }]}
            >
              <Upload beforeUpload={() => false} maxCount={1}>
                <Button icon={<UploadOutlined />}>Cliquez pour joindre</Button>
              </Upload>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default AdminProfilePage;
