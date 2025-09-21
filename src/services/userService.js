import axiosInstance from './axiosInstance';

const API_URL = 'users/';

export const fetchContacts = () =>
  axiosInstance.get(`${API_URL}contacts/`).then((res) => res.data);

export const createContact = (contactData) =>
  axiosInstance.post(`${API_URL}contacts/`, contactData).then((res) => res.data);

export const updateContact = (contactId, contactData) =>
  axiosInstance.put(`${API_URL}contacts/${contactId}/`, contactData).then((res) => res.data);

export const deleteContact = (contactId) =>
  axiosInstance.delete(`${API_URL}contacts/${contactId}/`).then((res) => res.data);

export const getProfile = () => axiosInstance.get(`${API_URL}profile/`).then(res => res.data);

export const updateProfile = (profileData) =>
  axiosInstance.put(`${API_URL}profile/`, profileData).then(res => res.data);

export default {
  fetchContacts,
  createContact,
  updateContact,
  deleteContact,
  getProfile,
  updateProfile,
};
