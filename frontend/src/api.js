import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
});

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
export const getMediaUrl = (image) => image ? `${apiBase.replace(/\/api\/?$/, '')}${image}` : null;

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('blogToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getApiError = (error) =>
  error.response?.data?.message || error.message || 'Something went wrong';

export default api;
