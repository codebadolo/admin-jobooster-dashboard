import axiosInstance from './axiosInstance';

const API_URL = 'users/';

const getProfile = () => {
  return axiosInstance.get('users/profile/');
};

const updateProfile = (profileData) => {
  return axiosInstance.put('users/profile/', profileData);
};

export const fetchContacts = async () => {
  const response = await axiosInstance.get(`${API_URL}contacts/`);
  return response.data;
};

export const createContact = async (contactData) => {
  const response = await axiosInstance.post(`${API_URL}contacts/`, contactData);
  return response.data;
};

export const updateContact = async (contactId, contactData) => {
  const response = await axiosInstance.put(`${API_URL}contacts/${contactId}/`, contactData);
  return response.data;
};

export const deleteContact = async (contactId) => {
  const response = await axiosInstance.delete(`${API_URL}contacts/${contactId}/`);
  return response.data;
};


export default {
  getProfile,
  updateProfile,
  fetchContacts,
  createContact,
  updateContact,
  deleteContact,  
};
