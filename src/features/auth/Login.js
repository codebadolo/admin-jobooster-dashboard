import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import authService from '../../api/authService'; // votre service authService
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Login = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();  // Hook pour navigation

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await authService.login(values.email, values.password);

      if (response.token) {
        message.success('Connexion réussie');
        onLoginSuccess();
        navigate('/');  // Redirection vers le dashboard (route index)
      } else {
        message.error('Réponse inattendue du serveur');
      }
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
