import axiosInstance from './axiosInstance';

const getProfile = () => {
  return axiosInstance.get('users/profile/');
};

const updateProfile = (profileData) => {
  return axiosInstance.put('users/profile/', profileData);
};

export default {
  getProfile,
  updateProfile,
};
