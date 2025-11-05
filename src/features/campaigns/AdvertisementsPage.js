// src/features/campaigns/AdvertisementsPage.js
import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, message, Space } from 'antd';
import advertisementService from '../../api/advertisementService';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const AdvertisementsPage = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await advertisementService.list();
      setAds(data);
    } catch (error) {
      console.error(error);
      message.error("Erreur lors du chargement des annonces");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await advertisementService.delete(id);
      message.success("Annonce supprimée");
      fetchData();
    } catch (error) {
      console.error(error);
      message.error("Erreur lors de la suppression");
    }
  };

  const handleEdit = (id) => {
    navigate(`/advertisements/${id}`);
  };

  return (
    <Table
      dataSource={ads}
      rowKey="id"
      loading={loading}
      pagination={{ pageSize: 10 }}
      columns={[
        { title: 'Campagne', dataIndex: ['campaign', 'title'], key: 'campaign' },
        { title: 'Type', dataIndex: 'media_type', key: 'media_type' },
        { title: 'Lien', dataIndex: 'link_url', key: 'link_url' },
        { title: 'Légende', dataIndex: 'caption', key: 'caption' },
        {
          title: 'Actions',
          key: 'actions',
          render: (_, record) => (
            <Space>
              <Button
                icon={<EditOutlined />}
                onClick={() => handleEdit(record.id)}
              />
              <Popconfirm
                title="Supprimer cette annonce ?"
                onConfirm={() => handleDelete(record.id)}
                okText="Oui"
                cancelText="Non"
              >
                <Button danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </Space>
          )
        }
      ]}
    />
  );
};

export default AdvertisementsPage;
