import axios from 'axios';

const API_BASE_URL = 'https://page-pulse-backend-01it.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      return Promise.reject({
        message: error.response.data.message || 'Server error occurred',
        status: error.response.status,
      });
    } else if (error.request) {
      return Promise.reject({
        message: 'No response from server. Please check your connection.',
        status: 503,
      });
    } else {
      return Promise.reject({
        message: error.message || 'An error occurred',
        status: 500,
      });
    }
  }
);

export const analyzeWebsite = async (url) => {
  try {
    const response = await api.post('/analyze', { url });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;