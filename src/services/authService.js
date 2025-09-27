import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';  // Base URL de votre API DRF

const getToken = () => localStorage.getItem('userToken');

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Auth
const login = async (email, password) => {
  const response = await axios.post(`${API_URL}users/login/`, { email, password });
  if (response.data.token) {
    localStorage.setItem('userToken', response.data.token);
    localStorage.setItem('userRole', response.data.role);
    localStorage.setItem('userEmail', response.data.email);
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userEmail');
};

// Utilisateur courant
const getCurrentUser = async () => {
  const response = await axiosInstance.get(`users/current-user/me/`);
  return {
    ...response.data.user,
    ...response.data.profile,
    contacts: response.data.user.contacts || [],
    skills: response.data.profile.skills || [],
    cvs: response.data.profile.cvs || [],
    received_ratings: response.data.profile.received_ratings || [],
  };
};

// Mise à jour partielle profil (section par section)
const updateProfilePartial = async (partialData) => {
  const response = await axiosInstance.patch(`profile/`, partialData);
  return response.data;
};

// Contacts
const getContacts = async () => {
  const response = await axiosInstance.get('profile/contacts/');
  return response.data;
};

const addContact = async (contactData) => {
  const response = await axiosInstance.post('profile/add_contact/', contactData);
  return response.data;
};

const deleteContact = async (contactId) => {
  await axiosInstance.delete(`profile/delete_contact/?pk=${contactId}`);
};

// Compétences
const getSkills = async () => {
  const response = await axiosInstance.get('profile/skills/');
  return response.data;
};

const addSkill = async (skillData) => {
  const response = await axiosInstance.post('profile/add_skill/', skillData);
  return response.data;
};

const deleteSkill = async (skillId) => {
  await axiosInstance.delete(`profile/delete_skill/?pk=${skillId}`);
};

// CVs
const getCvs = async () => {
  const response = await axiosInstance.get('profile/cvs/');
  return response.data;
};

const addCv = async (cvData) => {
  // cvData devrait être un FormData si vous envoyez des fichiers
  const response = await axiosInstance.post('profile/add_cv/', cvData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

const deleteCv = async (cvId) => {
  await axiosInstance.delete(`profile/delete_cv/?pk=${cvId}`);
};

export default {
  login,
  logout,
  getCurrentUser,
  updateProfilePartial,
  getContacts,
  addContact,
  deleteContact,
  getSkills,
  addSkill,
  deleteSkill,
  getCvs,
  addCv,
  deleteCv,
};
