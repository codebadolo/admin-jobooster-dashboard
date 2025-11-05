import axiosInstance from './axiosInstance';

const API_URL = 'admin/'; // préfixe pour vos routes admin

// Users
export const fetchUsers = () => axiosInstance.get(`${API_URL}users/`).then(res => res.data);

export const fetchUserById = (userId) => axiosInstance.get(`${API_URL}users/${userId}/`).then(res => res.data);

export const updateUser = (userId, data) =>
  axiosInstance.put(`${API_URL}users/${userId}/`, data).then(res => res.data);

export const deleteUser = (userId) =>
  axiosInstance.delete(`${API_URL}users/${userId}/`).then(res => res.data);

// Profils
export const fetchProfiles = () => axiosInstance.get(`${API_URL}profiles/`).then(res => res.data);

export const updateProfile = (profileId, data) =>
  axiosInstance.put(`${API_URL}profiles/${profileId}/`, data).then(res => res.data);

// Similar functions can be created for other resources (CoverageZones, PaymentMethods, KycDocuments, etc.)

export default {
  fetchUsers,
  fetchUserById,
  updateUser,
  deleteUser,
  fetchProfiles,
  updateProfile,
};
