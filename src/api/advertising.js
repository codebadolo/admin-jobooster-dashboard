import axiosInstance from './axiosInstance';

const API_URL = 'ads/admin/';

// GeoZone
export const fetchGeoZones = () => axiosInstance.get(`${API_URL}geozones/`).then(res => res.data);
export const createGeoZone = (data) => axiosInstance.post(`${API_URL}geozones/`, data);
export const updateGeoZone = (id, data) => axiosInstance.put(`${API_URL}geozones/${id}/`, data);
export const deleteGeoZone = (id) => axiosInstance.delete(`${API_URL}geozones/${id}/`);

// Promotion
export const fetchPromotions = () => axiosInstance.get(`${API_URL}promotions/`).then(res => res.data);
export const createPromotion = (data) => axiosInstance.post(`${API_URL}promotions/`, data);
export const updatePromotion = (id, data) => axiosInstance.put(`${API_URL}promotions/${id}/`, data);
export const deletePromotion = (id) => axiosInstance.delete(`${API_URL}promotions/${id}/`);

// Campaign
export const fetchCampaigns = () => axiosInstance.get(`${API_URL}campaigns/`).then(res => res.data);
export const createCampaign = (data) => axiosInstance.post(`${API_URL}campaigns/`, data);
export const updateCampaign = (id, data) => axiosInstance.put(`${API_URL}campaigns/${id}/`, data);
export const deleteCampaign = (id) => axiosInstance.delete(`${API_URL}campaigns/${id}/`);

// Advertisement
export const fetchAdvertisements = () => axiosInstance.get(`${API_URL}advertisements/`).then(res => res.data);
export const createAdvertisement = (data) => axiosInstance.post(`${API_URL}advertisements/`, data);
export const updateAdvertisement = (id, data) => axiosInstance.put(`${API_URL}advertisements/${id}/`, data);
export const deleteAdvertisement = (id) => axiosInstance.delete(`${API_URL}advertisements/${id}/`);

// CampaignPerformance
export const fetchCampaignPerformances = () => axiosInstance.get(`${API_URL}campaignperformances/`).then(res => res.data);
export const createCampaignPerformance = (data) => axiosInstance.post(`${API_URL}campaignperformances/`, data);
export const updateCampaignPerformance = (id, data) => axiosInstance.put(`${API_URL}campaignperformances/${id}/`, data);
export const deleteCampaignPerformance = (id) => axiosInstance.delete(`${API_URL}campaignperformances/${id}/`);
