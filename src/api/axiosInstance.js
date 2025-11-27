import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.ibaara.com/api',
 //  baseURL: 'http://localhost:8000/api',
  timeout: 10000,
});

axiosInstance.defaults.withCredentials = true;

// Configurations pour CSRF
axiosInstance.defaults.xsrfCookieName = 'csrftoken';
axiosInstance.defaults.xsrfHeaderName = 'X-CSRFTOKEN';

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers['Authorization'] = 'Token ' + token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
