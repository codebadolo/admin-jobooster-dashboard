import React, { useEffect, useState } from 'react';
import { Table, Tag, message, Button, Modal } from 'antd';
import axiosInstance from '../services/axiosInstance';

const statusColors = {
  initiated: 'blue',
  pending: 'gold',
  success: 'green',
  failed: 'red',
  cancelled: 'gray',
};

const AdminTransactionList = () => {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  useEffect(() => {
    fetchTransactions(pagination.current, pagination.pageSize);
  }, []);

  const fetchTransactions = async (page, pageSize) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('paiements/admin/transactions/', {
        params: { page, page_size: pageSize },
      });
      setTransactions(data.results);
      setPagination((prev) => ({ ...prev, total: data.count, current: page }));
    } catch {
      message.error('Erreur en chargeant les transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination) => {
    fetchTransactions(pagination.current, pagination.pageSize);
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Montant', dataIndex: 'amount', key: 'amount', render: (amount) => `${amount} XOF` },
    { title: 'Type', dataIndex: 'transaction_type', key: 'type' },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={statusColors[status]}>{status}</Tag>,
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'date',
      render: (date) => new Date(date).toLocaleString(),
      sorter: true,
    },
    /* Vous pouvez ajouter d'autres colonnes comme initiator, recipient, description, etc. */
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={transactions}
      loading={loading}
      pagination={pagination}
      onChange={handleTableChange}
    />
  );
};

export default AdminTransactionList;
