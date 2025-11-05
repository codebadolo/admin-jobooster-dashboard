import axiosInstance from './axiosInstance';

const API_URL = 'users/admin/'; // préfixe pour toutes les routes admin

// ------------------ Users ------------------
export const fetchUsers = () =>
  axiosInstance.get(`${API_URL}users/`).then(res => res.data);

export const fetchUserById = (userId) =>
  axiosInstance.get(`${API_URL}users/${userId}/`).then(res => res.data);

export const updateUser = (userId, data) =>
  axiosInstance.put(`${API_URL}users/${userId}/`, data).then(res => res.data);

export const deleteUser = (userId) =>
  axiosInstance.delete(`${API_URL}users/${userId}/`).then(res => res.data);

// ------------------ Profiles ------------------
export const fetchProfiles = () =>
  axiosInstance.get(`${API_URL}profiles/`).then(res => res.data);

export const updateProfile = (profileId, data) =>
  axiosInstance.put(`${API_URL}profiles/${profileId}/`, data).then(res => res.data);

// ------------------ Coverage Zones ------------------
export const fetchCoverageZones = () =>
  axiosInstance.get(`${API_URL}coveragezones/`).then(res => res.data);

export const createCoverageZone = (data) =>
  axiosInstance.post(`${API_URL}coveragezones/`, data).then(res => res.data);

export const updateCoverageZone = (zoneId, data) =>
  axiosInstance.put(`${API_URL}coveragezones/${zoneId}/`, data).then(res => res.data);

export const deleteCoverageZone = (zoneId) =>
  axiosInstance.delete(`${API_URL}coveragezones/${zoneId}/`).then(res => res.data);

// ------------------ Payment Methods ------------------
export const fetchPaymentMethods = () =>
  axiosInstance.get(`${API_URL}paymentmethods/`).then(res => res.data);

export const createPaymentMethod = (data) =>
  axiosInstance.post(`${API_URL}paymentmethods/`, data).then(res => res.data);

export const updatePaymentMethod = (methodId, data) =>
  axiosInstance.put(`${API_URL}paymentmethods/${methodId}/`, data).then(res => res.data);

export const deletePaymentMethod = (methodId) =>
  axiosInstance.delete(`${API_URL}paymentmethods/${methodId}/`).then(res => res.data);

// ------------------ KYC Documents ------------------
export const fetchKycDocuments = () =>
  axiosInstance.get(`${API_URL}kyc-documents/`).then(res => res.data);

export const verifyKycDocument = (docId) =>
  axiosInstance.post(`${API_URL}kyc-documents/${docId}/verify/`).then(res => res.data);

// Mettre à jour partiellement un document KYC
export const updateKycDocument = (id, data) =>
  axiosInstance.patch(`${API_URL}kyc-documents/${id}/`, data).then(res => res.data);

export const deleteKycDocument = (docId) =>
  axiosInstance.delete(`${API_URL}kyc-documents/${docId}/`).then(res => res.data);

// ------------------ Contacts ------------------
export const fetchContacts = () =>
  axiosInstance.get(`${API_URL}contacts/`).then(res => res.data);

export const createContact = (data) =>
  axiosInstance.post(`${API_URL}contacts/`, data).then(res => res.data);

export const updateContact = (contactId, data) =>
  axiosInstance.put(`${API_URL}contacts/${contactId}/`, data).then(res => res.data);

export const deleteContact = (contactId) =>
  axiosInstance.delete(`${API_URL}contacts/${contactId}/`).then(res => res.data);

// ------------------ Badges ------------------
export const fetchBadges = () =>
  axiosInstance.get(`${API_URL}badges/`).then(res => res.data);

export const createBadge = (data) =>
  axiosInstance.post(`${API_URL}badges/`, data).then(res => res.data);

export const updateBadge = (badgeId, data) =>
  axiosInstance.put(`${API_URL}badges/${badgeId}/`, data).then(res => res.data);

export const deleteBadge = (badgeId) =>
  axiosInstance.delete(`${API_URL}badges/${badgeId}/`).then(res => res.data);

// ------------------ Skills & Categories ------------------
export const fetchSkillCategories = () =>
  axiosInstance.get(`${API_URL}skill-categories/`).then(res => res.data);

export const createSkillCategory = (data) =>
  axiosInstance.post(`${API_URL}skill-categories/`, data).then(res => res.data);

export const updateSkillCategory = (categoryId, data) =>
  axiosInstance.put(`${API_URL}skill-categories/${categoryId}/`, data).then(res => res.data);

export const deleteSkillCategory = (categoryId) =>
  axiosInstance.delete(`${API_URL}skill-categories/${categoryId}/`).then(res => res.data);

export const fetchSkills = () =>
  axiosInstance.get(`${API_URL}skills/`).then(res => res.data);

export const createSkill = (data) =>
  axiosInstance.post(`${API_URL}skills/`, data).then(res => res.data);

export const updateSkill = (skillId, data) =>
  axiosInstance.put(`${API_URL}skills/${skillId}/`, data).then(res => res.data);

export const deleteSkill = (skillId) =>
  axiosInstance.delete(`${API_URL}skills/${skillId}/`).then(res => res.data);

// ------------------ UserSkills ------------------
export const fetchUserSkills = () =>
  axiosInstance.get(`${API_URL}user-skills/`).then(res => res.data);

export const createUserSkill = (data) =>
  axiosInstance.post(`${API_URL}user-skills/`, data).then(res => res.data);

export const updateUserSkill = (skillId, data) =>
  axiosInstance.put(`${API_URL}user-skills/${skillId}/`, data).then(res => res.data);

export const deleteUserSkill = (skillId) =>
  axiosInstance.delete(`${API_URL}user-skills/${skillId}/`).then(res => res.data);

// ------------------ CVs ------------------
export const fetchCVs = () =>
  axiosInstance.get(`${API_URL}cvs/`).then(res => res.data);

export const createCV = (data) =>
  axiosInstance.post(`${API_URL}cvs/`, data).then(res => res.data);

export const updateCV = (cvId, data) =>
  axiosInstance.put(`${API_URL}cvs/${cvId}/`, data).then(res => res.data);

export const deleteCV = (cvId) =>
  axiosInstance.delete(`${API_URL}cvs/${cvId}/`).then(res => res.data);

// Export global
export default {
  // Users
  fetchUsers, fetchUserById, updateUser, deleteUser,
  // Profiles
  fetchProfiles, updateProfile,
  // Coverage Zones
  fetchCoverageZones, createCoverageZone, updateCoverageZone, deleteCoverageZone,
  // Payment Methods
  fetchPaymentMethods, createPaymentMethod, updatePaymentMethod, deletePaymentMethod,
  // KYC Documents
  fetchKycDocuments, verifyKycDocument, updateKycDocument, deleteKycDocument,
  // Contacts
  fetchContacts, createContact, updateContact, deleteContact,
  // Badges
  fetchBadges, createBadge, updateBadge, deleteBadge,
  // Skills & Categories
  fetchSkillCategories, createSkillCategory, updateSkillCategory, deleteSkillCategory,
  fetchSkills, createSkill, updateSkill, deleteSkill,
  // UserSkills
  fetchUserSkills, createUserSkill, updateUserSkill, deleteUserSkill,
  // CVs
  fetchCVs, createCV, updateCV, deleteCV,
};
