import axiosInstance from './axiosInstance';

const API_BASE = 'users/'; // base API users
const ADMIN_BASE = `${API_BASE}admin/`;
const SKILLS_BASE = 'skills/';

// -------- Contacts --------

// Récupérer tous les contacts (admin)
export const fetchContacts = () =>
  axiosInstance.get(`${ADMIN_BASE}contacts/`).then(res => res.data);

// Créer un contact (utilisateur courant)
export const createContact = (contactData) =>
  axiosInstance.post(`${API_BASE}contacts/`, contactData).then(res => res.data);

// Mettre à jour un contact par id
export const updateContact = (contactId, contactData) =>
  axiosInstance.put(`${API_BASE}contacts/${contactId}/`, contactData).then(res => res.data);

// Supprimer un contact
export const deleteContact = (contactId) =>
  axiosInstance.delete(`${API_BASE}contacts/${contactId}/`).then(res => res.data);

// -------- Profiles --------

// Récupérer profil utilisateur courant
export const getProfile = () =>
  axiosInstance.get(`${API_BASE}profile/me/`).then(res => res.data);

// Mettre à jour profil utilisateur courant
export const updateProfile = (profileData) =>
  axiosInstance.put(`${API_BASE}profile/me/`, profileData).then(res => res.data);

// -------- Utilisateur courant --------

// Récupérer utilisateur connecté
export const getCurrentUser = () =>
  axiosInstance.get(`${API_BASE}me/`).then(res => res.data);

// Mettre à jour utilisateur connecté (profil résumé)
export const updateUserProfile = (profileData) =>
  axiosInstance.put(`${API_BASE}profile/me/`, profileData).then(res => {
    setCurrentUser(res.data);
    return res.data;
  });

// Mettre à jour les tokens et infos en localStorage après login ou update
export const setCurrentUser = (userData) => {
  // Stockage local si besoin
  localStorage.setItem('userToken', userData.token || localStorage.getItem('userToken'));
  localStorage.setItem('userRole', userData.role || localStorage.getItem('userRole'));
  localStorage.setItem('userEmail', userData.email || localStorage.getItem('userEmail'));
};

// -------- CVs --------

// Récupérer tous les CVs (admin ou utilisateur)
export const fetchCVs = () =>
  axiosInstance.get(`${SKILLS_BASE}users-cvs/`).then(res => res.data);

// Créer un CV
export const createCV = (cvData) =>
  axiosInstance.post(`${SKILLS_BASE}cvs/`, cvData).then(res => res.data);

// Mettre à jour un CV
export const updateCV = (cvId, cvData) =>
  axiosInstance.put(`${SKILLS_BASE}cvs/${cvId}/`, cvData).then(res => res.data);

// Supprimer un CV
export const deleteCV = (cvId) =>
  axiosInstance.delete(`${SKILLS_BASE}cvs/${cvId}/`).then(res => res.data);

// -------- KYC Documents --------

// Récupérer tous les documents KYC de l’utilisateur courant
export const fetchKycDocuments = () =>
  axiosInstance.get(`${API_BASE}kyc-documents/`).then(res => res.data);

// Soumettre un nouveau document KYC
export const createKycDocument = (docData) =>
  axiosInstance.post(`${API_BASE}kyc-documents/`, docData).then(res => res.data);

// Mettre à jour un document KYC
export const updateKycDocument = (docId, docData) =>
  axiosInstance.put(`${API_BASE}kyc-documents/${docId}/`, docData).then(res => res.data);

// Supprimer un document KYC
export const deleteKycDocument = (docId) =>
  axiosInstance.delete(`${API_BASE}kyc-documents/${docId}/`).then(res => res.data);

// -------- Badges --------

// Récupérer badges utilisateurs (admin ou courant)
export const fetchUserBadges = () =>
  axiosInstance.get(`${API_BASE}badges/`).then(res => res.data);

// -------- Payment Methods --------

// Récupérer méthodes de paiement de l’utilisateur courant
export const fetchPaymentMethods = () =>
  axiosInstance.get(`${API_BASE}payment-methods/`).then(res => res.data);

// Créer méthode paiement
export const createPaymentMethod = (paymentData) =>
  axiosInstance.post(`${API_BASE}payment-methods/`, paymentData).then(res => res.data);

// Mettre à jour méthode paiement
export const updatePaymentMethod = (paymentId, paymentData) =>
  axiosInstance.put(`${API_BASE}payment-methods/${paymentId}/`, paymentData).then(res => res.data);

// Supprimer méthode paiement
export const deletePaymentMethod = (paymentId) =>
  axiosInstance.delete(`${API_BASE}payment-methods/${paymentId}/`).then(res => res.data);

export default {
  fetchContacts,
  createContact,
  updateContact,
  deleteContact,

  getProfile,
  updateProfile,

  getCurrentUser,
  updateUserProfile,
  setCurrentUser,

  fetchCVs,
  createCV,
  updateCV,
  deleteCV,

  fetchKycDocuments,
  createKycDocument,
  updateKycDocument,
  deleteKycDocument,

  fetchUserBadges,

  fetchPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
};
