import axiosInstance from './axiosInstance';

const API_BASE = 'ads/admin/campaigns/';

export const fetchCampaigns = () =>
  axiosInstance.get(API_BASE).then(res => res.data);

export const fetchCampaignById = (id) =>
  axiosInstance.get(`${API_BASE}${id}/`).then(res => res.data);

export const createCampaign = (data) =>
  axiosInstance.post(API_BASE, data).then(res => res.data);

export const updateCampaign = (id, data) =>
  axiosInstance.put(`${API_BASE}${id}/`, data).then(res => res.data);

export const deleteCampaign = (id) =>
  axiosInstance.delete(`${API_BASE}${id}/`).then(res => res.data);

export default { fetchCampaigns, fetchCampaignById, createCampaign, updateCampaign, deleteCampaign };
