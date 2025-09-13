import axios from 'axios';

const API_URL = 'http://localhost:8000/api/users/'; // Adapter selon backend

const login = async (email, password) => {
  const response = await axios.post(`${API_URL}login/`, { email, password });
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

const getCurrentUser = () => {
  return {
    token: localStorage.getItem('userToken'),
    role: localStorage.getItem('userRole'),
    email: localStorage.getItem('userEmail'),
  };
};

export default {
  login,
  logout,
  getCurrentUser,
};
