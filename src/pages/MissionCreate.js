import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, DatePicker, message } from 'antd';
import axiosInstance from '../services/axiosInstance';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const MissionCreate = () => {
  const [clients, setClients] = useState([]);
  const [prestataires, setPrestataires] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      axiosInstance.get('users/?role=client'),
      axiosInstance.get('users/?role=prestataire'),
    ]).then(([clientsRes, prestatairesRes]) => {
      setClients(clientsRes.data);
      setPrestataires(prestatairesRes.data);
    }).catch(() => message.error('Erreur chargement utilisateurs'));
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axiosInstance.post('missions/', {
        ...values,
        start_date: values.start_date.format(),
        end_date: values.end_date.format(),
      });
      message.success('Mission créée');
      navigate('/missions');
    } catch {
      message.error('Erreur création mission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item name="title" label="Titre" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="description" label="Description" rules={[{ required: true }]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item name="client" label="Client" rules={[{ required: true }]}>
        <Select placeholder="Choisir un client">
          {clients.map(c => <Option key={c.id} value={c.id}>{c.email}</Option>)}
        </Select>
      </Form.Item>
      <Form.Item name="prestataire" label="Prestataire" rules={[{ required: false }]}>
        <Select placeholder="Choisir un prestataire (optionnel)">
          {prestataires.map(p => <Option key={p.id} value={p.id}>{p.email}</Option>)}
        </Select>
      </Form.Item>
      <Form.Item name="geographic_zone" label="Zone Géographique" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="start_date" label="Date de début" rules={[{ required: true }]}>
        <DatePicker showTime />
      </Form.Item>
      <Form.Item name="end_date" label="Date de fin" rules={[{ required: true }]}>
        <DatePicker showTime />
      </Form.Item>
      <Form.Item name="price" label="Prix (XOF)" rules={[{ required: true }]}>
        <Input type="number" min={0} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>Créer</Button>
      </Form.Item>
    </Form>
  );
};

export default MissionCreate;
