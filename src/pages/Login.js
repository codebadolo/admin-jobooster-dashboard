// src/pages/Login.js

import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import axiosInstance from '../services/axiosInstance';

const { Title } = Typography;

const Login = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
    const response = await axiosInstance.post('users/login/', {
  email: values.email,
  password: values.password
});

      localStorage.setItem('userToken', response.data.token);
      localStorage.setItem('userRole', response.data.role);
      localStorage.setItem('userEmail', response.data.email);
      message.success('Connexion réussie');
      onLoginSuccess();
    } catch (error) {
      message.error('Email ou mot de passe invalide');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 40, background: '#fff', borderRadius: 8 }}>
      <Title level={2} style={{ textAlign: 'center' }}>Connexion Admin</Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Entrez votre email!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Mot de passe" name="password" rules={[{ required: true, message: 'Entrez votre mot de passe!' }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Se connecter
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
