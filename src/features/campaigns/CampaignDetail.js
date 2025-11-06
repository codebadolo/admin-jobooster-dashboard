import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Typography,
  Spin,
  message,
  Row,
  Col,
  Image,
  Modal,
  Form,
  Input,
  Select,
  Button,
  Popconfirm,
  Upload,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, InboxOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import campaignService from '../../api/campaignService';
import advertisementService from '../../api/advertisementService';

const { Title, Text } = Typography;
const { Option } = Select;
const { Dragger } = Upload;

const CampaignDetail = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [ads, setAds] = useState([]);
  const [performances, setPerformances] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal annonce
  const [adModalVisible, setAdModalVisible] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [adForm] = Form.useForm();

  // --- Fetch campaign and ads ---
  const fetchCampaign = async () => {
    setLoading(true);
    try {
      const data = await campaignService.retrieve(id);
      setCampaign(data);
      setPerformances(data.performances || []);

      const adsData = await advertisementService.listByCampaign(id);
      setAds(adsData || []);
    } catch (err) {
      console.error(err);
      message.error('Erreur lors du chargement de la campagne');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  // --- Handle Ads ---
  const openAdModal = (ad = null) => {
    setEditingAd(ad);
    adForm.resetFields();
    if (ad) {
      adForm.setFieldsValue({
        media_type: ad.media_type,
        caption: ad.caption,
        link_url: ad.link_url,
      });
    }
    setAdModalVisible(true);
  };

  const closeAdModal = () => {
    setAdModalVisible(false);
    setEditingAd(null);
  };

  const saveAd = async (values) => {
    try {
      const formData = new FormData();
      formData.append('media_type', values.media_type);
      formData.append('caption', values.caption || '');
      formData.append('link_url', values.link_url || '');
      formData.append('campaign_id', id);

      if (values.media_file && values.media_file.file) {
        formData.append('media_file', values.media_file.file);
      }

      if (editingAd) {
        await advertisementService.update(editingAd.id, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        message.success('Annonce mise à jour');
      } else {
        await advertisementService.create(formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        message.success('Nouvelle annonce créée');
      }

      closeAdModal();
      fetchCampaign();
    } catch (err) {
      console.error(err);
      message.error('Erreur lors de l’enregistrement de l’annonce');
    }
  };

  const deleteAd = async (adId) => {
    try {
      await advertisementService.delete(adId);
      message.success('Annonce supprimée');
      fetchCampaign();
    } catch {
      message.error('Erreur lors de la suppression');
    }
  };

  if (loading || !campaign) return <Spin size="large" />;

  const performanceData = performances.map((p) => ({
    date: p.date,
    views: p.views,
    clicks: p.clicks,
    click_rate: parseFloat(p.click_rate.toFixed(2)),
  }));

  return (
    <>
      <Title level={2}>{campaign.title}</Title>

      {/* Campaign Details */}
      <Card title="Détails de la campagne" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col span={12}><Text strong>Description:</Text> <Text>{campaign.description}</Text></Col>
          <Col span={12}><Text strong>Budget:</Text> <Text>{campaign.budget}</Text></Col>
          <Col span={12}><Text strong>Statut:</Text> <Text>{campaign.status}</Text></Col>
          <Col span={12}><Text strong>Date:</Text> <Text>{campaign.start_date} → {campaign.end_date}</Text></Col>
          <Col span={12}><Text strong>Annonceur:</Text> <Text>{campaign.advertiser.email}</Text></Col>
          <Col span={12}><Text strong>Catégories:</Text> <Text>{campaign.skill_categories?.map(c => c.name).join(', ')}</Text></Col>
        </Row>
      </Card>

      {/* Ads Management */}
      <Card
        title="Annonces liées"
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => openAdModal()}>Nouvelle annonce</Button>}
        style={{ marginBottom: 24 }}
      >
        {ads.length === 0 ? <Text>Aucune annonce pour cette campagne.</Text> : (
          <Row gutter={[16, 16]}>
            {ads.map(ad => (
              <Col key={ad.id} xs={24} sm={12} md={8}>
                <Card
                  hoverable
                  cover={
                    ad.media_type === 'image' ? (
                      <Image src={ad.media_file} alt={ad.caption} />
                    ) : ad.media_type === 'video' ? (
                      <video controls width="100%">
                        <source src={ad.media_file} type="video/mp4" />
                        Votre navigateur ne supporte pas la lecture vidéo.
                      </video>
                    ) : null
                  }
                  actions={[
                    <EditOutlined key="edit" onClick={() => openAdModal(ad)} />,
                    <Popconfirm
                      title="Supprimer cette annonce ?"
                      onConfirm={() => deleteAd(ad.id)}
                      okText="Oui"
                      cancelText="Non"
                    >
                      <DeleteOutlined key="delete" />
                    </Popconfirm>
                  ]}
                >
                  <Text strong>Type:</Text> {ad.media_type.toUpperCase()} <br />
                  <Text strong>Lien:</Text> <a href={ad.link_url} target="_blank" rel="noreferrer">{ad.link_url}</a> <br />
                  <Text strong>Caption:</Text> {ad.caption}
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Card>

      {/* Ads Modal with Upload */}
      <Modal
        visible={adModalVisible}
        title={editingAd ? 'Modifier l’annonce' : 'Nouvelle annonce'}
        onCancel={closeAdModal}
        onOk={() => adForm.submit()}
        destroyOnClose
      >
        <Form layout="vertical" form={adForm} onFinish={saveAd}>
          <Form.Item name="media_type" label="Type" rules={[{ required: true }]}>
            <Select>
              <Option value="image">Image</Option>
              <Option value="video">Vidéo</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="media_file"
            label="Fichier"
            rules={[{ required: !editingAd, message: 'Veuillez ajouter un fichier !' }]}
          >
            <Dragger beforeUpload={() => false} accept="image/*,video/*" maxCount={1}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Cliquez ou glissez le fichier ici</p>
            </Dragger>
          </Form.Item>

          <Form.Item name="link_url" label="Lien">
            <Input />
          </Form.Item>

          <Form.Item name="caption" label="Caption">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Campaign Performance */}
      <Card title="Statistiques de la campagne">
        <Table
          dataSource={performanceData}
          columns={[
            { title: 'Date', dataIndex: 'date', key: 'date' },
            { title: 'Vues', dataIndex: 'views', key: 'views' },
            { title: 'Clics', dataIndex: 'clicks', key: 'clicks' },
            { title: 'Taux de clic (%)', dataIndex: 'click_rate', key: 'click_rate' },
          ]}
          rowKey="date"
          pagination={{ pageSize: 5 }}
          style={{ marginBottom: 24 }}
        />

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="views" stroke="#8884d8" />
            <Line type="monotone" dataKey="clicks" stroke="#82ca9d" />
            <Line type="monotone" dataKey="click_rate" stroke="#ffc658" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </>
  );
};

export default CampaignDetail;
