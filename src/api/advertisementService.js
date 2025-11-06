import axiosInstance from './axiosInstance';

const baseURL = 'ads/admin/advertisements/';

const advertisementService = {
  list: async () => {
    const res = await axiosInstance.get(baseURL);
    return res.data;
  },

  retrieve: async (id) => {
    const res = await axiosInstance.get(`${baseURL}${id}/`);
    return res.data;
  },

  create: async (payload, config = {}) => {
    const res = await axiosInstance.post(baseURL, payload, config);
    return res.data;
  },

  update: async (id, payload, config = {}) => {
    const res = await axiosInstance.put(`${baseURL}${id}/`, payload, config);
    return res.data;
  },

  delete: async (id) => {
    const res = await axiosInstance.delete(`${baseURL}${id}/`);
    return res.data;
  },

  // --- NOUVEAUX SERVICES ---

  // Récupérer les annonces d'une campagne spécifique
  listByCampaign: async (campaignId) => {
    const res = await axiosInstance.get(`${baseURL}?campaign_id=${campaignId}`);
    return res.data;
  },

  // Upload de média pour une annonce (image/vidéo)
  uploadMedia: async (formData) => {
    const res = await axiosInstance.post(`${baseURL}upload/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};

export default advertisementService;
