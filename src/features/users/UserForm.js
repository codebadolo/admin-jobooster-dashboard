import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import axiosInstance from '../../api/axiosInstance';
import { useParams, useNavigate } from 'react-router-dom';

const { Option } = Select;

const UserForm = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      axiosInstance.get(`users/${id}/`).then((res) => {
        form.setFieldsValue(res.data);
      });
    }
  }, [id, isEdit, form]);

  const onFinish = async (values) => {
    try {
      if (isEdit) {
        await axiosInstance.put(`users/${id}/`, values);
        message.success('Utilisateur mis à jour');
      } else {
        await axiosInstance.post('users/', values);
        message.success('Utilisateur créé');
      }
      navigate('/users');
    } catch (error) {
      message.error('Erreur lors de la sauvegarde');
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
        <Input />
      </Form.Item>
      {!isEdit && (
        <Form.Item name="password" label="Mot de passe" rules={[{ required: true, min: 8 }]}>
          <Input.Password />
        </Form.Item>
      )}
      <Form.Item name="role" label="Rôle" rules={[{ required: true }]}>
        <Select>
          <Option value="prestataire">Prestataire</Option>
          <Option value="client">Client</Option>
          <Option value="admin">Administrateur</Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {isEdit ? 'Mettre à jour' : 'Créer'}
        </Button>
        <Button style={{ marginLeft: '10px' }} onClick={() => navigate('/users')}>
          Annuler
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UserForm;
