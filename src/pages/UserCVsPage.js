import React, { useEffect, useState } from 'react';
import { Table, Button, Spin, message, Modal } from 'antd';
import { DownloadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import userService from '../services/userService'; // Adapter chemin selon projet

const UserCVsPage = () => {
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingCvId, setDeletingCvId] = useState(null);
  const navigate = useNavigate();

  const fetchCvs = async () => {
    try {
      setLoading(true);
      const data = await userService.fetchCVs();
      setCvs(data);
    } catch (error) {
      message.error('Erreur lors du chargement des CVs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCvs();
  }, []);

  const confirmDelete = (id) => {
    Modal.confirm({
      title: 'Confirmer la suppression',
      content: 'Voulez-vous vraiment supprimer ce CV ?',
      okText: 'Supprimer',
      cancelText: 'Annuler',
      onOk: async () => {
        try {
          setDeletingCvId(id);
          await userService.deleteCV(id);
          message.success('CV supprimé avec succès.');
          fetchCvs();
        } catch (error) {
          message.error('Erreur lors de la suppression.');
        } finally {
          setDeletingCvId(null);
        }
      }
    });
  };

  const columns = [
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Date de mise en ligne',
      dataIndex: 'uploaded_at',
      key: 'uploaded_at',
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.uploaded_at) - new Date(b.uploaded_at),
    },
    {
      title: 'Lien',
      dataIndex: 'file_url',
      key: 'file_url',
      render: (url) => (
        <Button type="link" href={url} target="_blank" icon={<DownloadOutlined />}>
          Télécharger
        </Button>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="primary"
          danger
          icon={<DeleteOutlined />}
          loading={deletingCvId === record.id}
          onClick={() => confirmDelete(record.id)}
        >
          Supprimer
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Liste des CVs</h2>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: 16 }}
        onClick={() => navigate('/users/cvs/add')}
      >
        Ajouter un CV
      </Button>
      {loading ? <Spin size="large" tip="Chargement..." /> : (
        <Table
          rowKey="id"
          columns={columns}
          dataSource={cvs}
          pagination={{ pageSize: 5 }}
        />
      )}
    </div>
  );
};

export default UserCVsPage;
