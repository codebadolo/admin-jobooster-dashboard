import axiosInstance from './axiosInstance';

const API_URL = 'users/';
const CV_BASE_URL = 'skills/';

export const fetchContacts = () =>
  axiosInstance.get(`${API_URL}contacts/`).then((res) => res.data);

export const createContact = (contactData) =>
  axiosInstance.post(`${API_URL}contacts/`, contactData).then((res) => res.data);

export const updateContact = (contactId, contactData) =>
  axiosInstance.put(`${API_URL}contacts/${contactId}/`, contactData).then((res) => res.data);

export const deleteContact = (contactId) =>
  axiosInstance.delete(`${API_URL}contacts/${contactId}/`).then((res) => res.data);

// Fonction pour récupérer le profil utilisateur courant
export const getProfile = () =>
  axiosInstance.get(`${API_URL}profile/me/`).then((res) => res.data);

// Fonction pour mettre à jour le profil utilisateur courant
export const updateProfile = (profileData) =>
  axiosInstance.put(`users/${API_URL}api/profile/me/`, profileData).then((res) => res.data);
//http://localhost:8000/api/users/api/profile/me/
export const getCurrentUser = () =>
  axiosInstance.get(`${API_URL}me/`).then((res) => res.data);

export const setCurrentUser = (userData) => {
  getCurrentUser = userData;
  // Stockage local si besoin
  localStorage.setItem('userToken', userData.token || localStorage.getItem('userToken'));
  localStorage.setItem('userRole', userData.role || localStorage.getItem('userRole'));
  localStorage.setItem('userEmail', userData.email || localStorage.getItem('userEmail'));
};
export const updateUserProfile = (profileData) => {
  // Exemple API call pour mettre à jour le profil
  return axiosInstance.put('users/profile/me/', profileData)
    .then(res => {
      setCurrentUser(res.data);  // met à jour l'état courant avec réponse
      return res.data;
    });
};

export const fetchCVs = () =>
axiosInstance.get('skills/users-cvs/').then(res => res.data);

export const createCV = (cvData) =>
  axiosInstance.post(`${CV_BASE_URL}cvs/`, cvData).then(res => res.data);

export const updateCV = (cvId, cvData) =>
  axiosInstance.put(`${CV_BASE_URL}cvs/${cvId}/`, cvData).then(res => res.data);

export const deleteCV = (cvId) =>
  axiosInstance.delete(`${CV_BASE_URL}cvs/${cvId}/`).then(res => res.data);

export default {
  fetchContacts,
  createContact,
  updateContact,
  deleteContact,
  getProfile,
  updateProfile,
  getCurrentUser ,
    setCurrentUser,
fetchCVs,
  createCV,
  updateCV,
  deleteCV,
  updateUserProfile
};
