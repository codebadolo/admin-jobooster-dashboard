import axiosInstance from './axiosInstance';

const API_BASE = 'users/admin/geozones/';

export const fetchGeoZones = () =>
  axiosInstance.get(API_BASE).then(res => res.data);

export default { fetchGeoZones };
