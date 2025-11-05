import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Button,
  DatePicker,
  InputNumber,
  Select,
  message,
  Space,
  Card,
  Spin,
} from 'antd';
import moment from 'moment';
import { useParams, useNavigate } from 'react-router-dom';
import {
  fetchCampaignById,
  createCampaign,
  updateCampaign,
} from '../../api/campaignService';
import { fetchSkillCategories } from '../../api/skillService';
import { fetchGeoZones } from '../../api/geoZoneService';


const { RangePicker } = DatePicker;
const { TextArea } = Input;

const CampaignDetailEdit = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [geoZones, setGeoZones] = useState([]);
  const [initialValues, setInitialValues] = useState(null);

  // Récupérer les catégories et zones pour les selects
  useEffect(() => {
    fetchSkillCategories().then(setCategories);
    fetchGeoZones().then(setGeoZones);
  }, []);

  // Charger données campagne si en édition
  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchCampaignById(id)
        .then((data) => {
          setInitialValues({
            ...data,
            start_end: [moment(data.start_date), moment(data.end_date)],
            category_id: data.skill_categories.length > 0 ? data.skill_categories[0].id : null,
            geo_zone: data.geo_zone?.id || null,
          });
          form.setFieldsValue({
            ...data,
            start_end: [moment(data.start_date), moment(data.end_date)],
            category_id: data.skill_categories.length > 0 ? data.skill_categories[0].id : null,
            geo_zone: data.geo_zone?.id || null,
          });
        })
        .catch(() => message.error('Erreur chargement campagne'))
        .finally(() => setLoading(false));
    }
  }, [id, form]);

  const onFinish = (values) => {
    setLoading(true);
    // Préparer payload selon modèle API
    const payload = {
      title: values.title,
      description: values.description,
      budget: values.budget,
      start_date: values.start_end[0].format('YYYY-MM-DD'),
      end_date: values.start_end[1].format('YYYY-MM-DD'),
      status: values.status,
      skill_categories: [values.category_id],
      geo_zone: values.geo_zone,
    };

    const action = id ? updateCampaign(id, payload) : createCampaign(payload);

    action
      .then(() => {
        message.success(`Campagne ${id ? 'mise à jour' : 'créée'} avec succès`);
        navigate('/campaigns');
      })
      .catch(() => {
        message.error('Erreur lors de la sauvegarde');
      })
      .finally(() => setLoading(false));
  };

  return (
    <Card title={id ? 'Modifier Campagne' : 'Créer une nouvelle Campagne'} style={{ maxWidth: 800, margin: 'auto' }}>
      {loading && !initialValues && <Spin />}
      <Form form={form} layout="vertical" onFinish={onFinish} initialValues={initialValues}>
        <Form.Item name="title" label="Titre" rules={[{ required: true, message: 'Titre requis' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item name="budget" label="Budget (FCFA)" rules={[{ required: true, message: 'Budget requis' }]}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="start_end" label="Période" rules={[{ required: true, message: 'Période requise' }]}>
          <RangePicker />
        </Form.Item>
        <Form.Item name="status" label="Statut" rules={[{ required: true }]}>
          <Select>
            <Select.Option value="draft">Brouillon</Select.Option>
            <Select.Option value="active">Active</Select.Option>
            <Select.Option value="paused">Suspendue</Select.Option>
            <Select.Option value="completed">Terminée</Select.Option>
            <Select.Option value="cancelled">Annulée</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="category_id" label="Catégorie de compétence" rules={[{ required: true }]}>
          <Select showSearch optionFilterProp="children" placeholder="Sélectionnez une catégorie">
            {categories.map((cat) => (
              <Select.Option key={cat.id} value={cat.id}>
                {cat.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="geo_zone" label="Zone Géographique" >
          <Select allowClear placeholder="Sélectionnez une zone (optionnel)">
            {geoZones.map((zone) => (
              <Select.Option key={zone.id} value={zone.id}>
                {zone.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              {id ? 'Mettre à jour' : 'Créer'}
            </Button>
            <Button onClick={() => navigate('/campaigns')}>
              Annuler
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CampaignDetailEdit;
