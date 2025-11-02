import axios from 'axios';

const API_URL = 'https://api.ibaara.com/api/';  // Base URL de votre API DRF

const getToken = () => localStorage.getItem('userToken');

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true,  // Important : permet d'envoyer cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ajout de l’interceptor pour injections headers Auth et CSRF
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = 'Token ' + token;
    }
    const csrftoken = getCookie('csrftoken');
    if (csrftoken) {
      config.headers['X-CSRFTOKEN'] = csrftoken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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
  const response = await axiosInstance.patch(`current-user/me/update-profile/`, partialData);
  return response.data;
};

// Contacts
const getContacts = async () => {
  const response = await axiosInstance.get('current-user/me/contacts/');
  return response.data;
};

const addContact = async (contactData) => {
  const response = await axiosInstance.post('current-user/me/add-contact/', contactData);
  return response.data;
};

const deleteContact = async (contactId) => {
  await axiosInstance.delete(`current-user/me/delete-contact/?pk=${contactId}`);
};

// Compétences
const getSkills = async () => {
  const response = await axiosInstance.get('current-user/me/skills/');
  return response.data;
};

const addSkill = async (skillData) => {
  const response = await axiosInstance.post('current-user/me/add-skill/', skillData);
  return response.data;
};

const deleteSkill = async (skillId) => {
  await axiosInstance.delete(`current-user/me/delete-skill/?pk=${skillId}`);
};

// CVs
const getCvs = async () => {
  const response = await axiosInstance.get('current-user/me/cvs/');
  return response.data;
};

// Pour upload un fichier, cvData doit être un FormData
const addCv = async (cvData) => {
  const response = await axiosInstance.post('current-user/me/add-cv/', cvData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

const deleteCv = async (cvId) => {
  await axiosInstance.delete(`users/current-user/me/delete-cv/?pk=${cvId}`);
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
