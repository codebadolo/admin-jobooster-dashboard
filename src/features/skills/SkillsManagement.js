import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Popconfirm, Typography, Select, Switch } from 'antd';
import axiosInstance from '../../api/axiosInstance';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const SkillsManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEntity, setEditingEntity] = useState(null);
  const [isCategory, setIsCategory] = useState(true);
  const [form] = Form.useForm();

  // Charger catégories + compétences
  const fetchData = async () => {
    setLoading(true);
    try {
      const resCategories = await axiosInstance.get('skills/categories/');
      const resSkills = await axiosInstance.get('skills/skills/');
      const data = resCategories.data.map(cat => ({
        key: `cat-${cat.id}`,
        ...cat,
        children: resSkills.data
          .filter(skill => skill.category?.id === cat.id)
          .map(skill => ({
            key: `skill-${skill.id}`,
            ...skill,
            category: undefined,
          })),
      }));
      setCategories(data);
    } catch {
      message.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openModal = (entity, category = true) => {
    setIsCategory(category);
    setEditingEntity(entity || null);
    form.resetFields();
    if (entity) {
      const values = { ...entity };
      if (!category && entity.category) values.category_id = entity.category.id;
      form.setFieldsValue(values);
    }
    setModalVisible(true);
  };

  const closeModal = () => { setModalVisible(false); setEditingEntity(null); };

  const onFinish = async (values) => {
    try {
      if (isCategory) {
        if (editingEntity) await axiosInstance.put(`skills/categories/${editingEntity.id}/`, values);
        else await axiosInstance.post('skills/categories/', values);
        message.success(isCategory ? "Catégorie enregistrée" : "Compétence enregistrée");
      } else {
        const payload = { ...values, category: values.category_id };
        delete payload.category_id;
        if (editingEntity) await axiosInstance.put(`skills/skills/${editingEntity.id}/`, payload);
        else await axiosInstance.post('skills/skills/', payload);
        message.success("Compétence enregistrée");
      }
      fetchData();
      closeModal();
    } catch { message.error("Erreur lors de l'enregistrement"); }
  };

  const handleDelete = async (id, category = true) => {
    try {
      if (category) await axiosInstance.delete(`skills/categories/${id}/`);
      else await axiosInstance.delete(`skills/skills/${id}/`);
      message.success(category ? "Catégorie supprimée" : "Compétence supprimée");
      fetchData();
    } catch { message.error("Erreur lors de la suppression"); }
  };

  const handleValidateToggle = async (record, checked) => {
    try {
      await axiosInstance.patch(`skills/skills/${record.id}/`, { is_validated: checked });
      message.success(`Compétence ${checked ? 'validée' : 'invalidée'}`);
      fetchData();
    } catch { message.error("Erreur lors de la mise à jour de la validation"); }
  };

  const columns = [
    { title: 'Nom', dataIndex: 'name', key: 'name', render: (text, record) => record.children ? <b>{text}</b> : text },
    { title: 'Validée', dataIndex: 'is_validated', key: 'is_validated', render: (val, record) => record.children ? null : (<Switch checked={val} onChange={checked => handleValidateToggle(record, checked)} />), width: 100 },
    { title: 'Actions', key: 'actions', render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openModal(record, !record.children)} />
          <Popconfirm
            title={`Supprimer cette ${record.children ? 'catégorie' : 'compétence'} ?`}
            onConfirm={() => handleDelete(record.id, !!record.children)}
            okText="Oui"
            cancelText="Non"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Gestion des Compétences et Catégories</Title>
      <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 16 }} onClick={() => openModal(null, true)}>Nouvelle Catégorie</Button>
      <Button type="default" icon={<PlusOutlined />} style={{ marginBottom: 16, marginLeft: 8 }} onClick={() => openModal(null, false)}>Nouvelle Compétence</Button>

      <Table
        dataSource={categories}
        columns={columns}
        loading={loading}
        rowKey="key"
        expandable={{ defaultExpandAllRows: true }}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingEntity ? (isCategory ? "Modifier Catégorie" : "Modifier Compétence") : (isCategory ? "Nouvelle Catégorie" : "Nouvelle Compétence")}
        visible={modalVisible}
        onCancel={closeModal}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="name"
            label={isCategory ? "Nom de la catégorie" : "Nom de la compétence"}
            rules={[{ required: true, message: 'Ce champ est requis' }]}
          >
            <Input />
          </Form.Item>
          {!isCategory && (
            <Form.Item
              name="category_id"
              label="Catégorie"
              rules={[{ required: true, message: "Sélectionnez une catégorie" }]}
            >
              <Select placeholder="Sélectionnez une catégorie">
                {categories.map(cat => (<Option key={cat.id} value={cat.id}>{cat.name}</Option>))}
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default SkillsManagement;
