import axiosInstance from './axiosInstance';

const API_BASE = 'ads/admin/campaignperformances/';
export const fetchCampaignPerformance = (campaignId) =>
  axiosInstance.get(`${API_BASE}?campaign=${campaignId}`).then(res => res.data);

export const fetchPerformances = (campaignId) =>
  axiosInstance.get(`${API_BASE}?campaign=${campaignId}`).then(res => res.data);

export default { fetchPerformances };
