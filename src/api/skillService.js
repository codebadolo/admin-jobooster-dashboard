import axiosInstance from './axiosInstance';

const API_BASE = 'skills/skillcategories/';

export const fetchSkillCategories = () =>
  axiosInstance.get(API_BASE).then(res => res.data);

export default { fetchSkillCategories };
