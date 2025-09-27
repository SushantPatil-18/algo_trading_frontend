import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

// Dashboard API
export const dashboardAPI = {
  getDashboard: () => api.get('/dashboard'),
  getBotAnalytics: (botId) => api.get(`/dashboard/bots/${botId}/analytics`),
};

// Strategies API
export const strategiesAPI = {
  getStrategies: () => api.get('/strategies'),
  getStrategiesByCategory: (category) => api.get(`/strategies/category/${category}`),
  getStrategy: (strategyId) => api.get(`/strategies/${strategyId}`),
  createTradingBot: (data) => api.post('/strategies/bots', data),
  getTradingBots: () => api.get('/strategies/bots/my'),
  testStrategy: (botId) => api.post(`/strategies/bots/${botId}/test`),
  validateSettings: (strategyId, settings) => api.post(`/strategies/${strategyId}/validate`, { settings }),
};

// Bots API
export const botsAPI = {
  startBot: (botId) => api.post(`/bots/${botId}/start`),
  stopBot: (botId) => api.post(`/bots/${botId}/stop`),
  pauseBot: (botId) => api.post(`/bots/${botId}/pause`),
  resumeBot: (botId) => api.post(`/bots/${botId}/resume`),
  getBotDetails: (botId) => api.get(`/bots/${botId}`),
  updateBotSettings: (botId, data) => api.put(`/bots/${botId}/settings`, data),
  deleteBot: (botId) => api.delete(`/bots/${botId}`),
};

// Exchange API
export const exchangeAPI = {
  addExchangeAccount: (data) => api.post('/exchange/accounts', data),
  getExchangeAccounts: () => api.get('/exchange/accounts'),
  deleteExchangeAccount: (accountId) => api.delete(`/exchange/account/${accountId}`),
  testAccountConnection: (accountId) => api.post(`/exchange/account/${accountId}/test`),
};

// Settings API
export const settingsAPI = {
  updateEmailSettings: (data) => api.put('/settings/email', data),
  testEmail: () => api.post('/settings/email/test'),
};

export default api;