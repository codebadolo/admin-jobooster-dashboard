import axiosInstance from './axiosInstance';

export const fetchTransactions = (page=1, pageSize=10) =>
  axiosInstance.get(`paiements/transactions/?page=${page}&page_size=${pageSize}`).then(res => res.data);

export const fetchTransactionById = (id) =>
  axiosInstance.get(`/transactions/${id}/`).then(res => res.data);

export const deleteTransaction = (id) =>
  axiosInstance.delete(`/transactions/${id}/`).then(res => res.data);

export default {
  fetchTransactions,
  fetchTransactionById,
  deleteTransaction,
};
