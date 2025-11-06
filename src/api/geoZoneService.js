import axiosInstance from './axiosInstance';

const baseURL = 'ads/admin/geozones/';

const geoZoneService = {
  list: async () => {
    const res = await axiosInstance.get(baseURL);
    return res.data;
  },

  retrieve: async (id) => {
    const res = await axiosInstance.get(`${baseURL}${id}/`);
    return res.data;
  },

  create: async (payload) => {
    const res = await axiosInstance.post(baseURL, payload);
    return res.data;
  },

  update: async (id, payload) => {
    const res = await axiosInstance.put(`${baseURL}${id}/`, payload);
    return res.data;
  },

  delete: async (id) => {
    const res = await axiosInstance.delete(`${baseURL}${id}/`);
    return res.data;
  }
};

export default geoZoneService;
