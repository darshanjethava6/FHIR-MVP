import axios from 'axios';

// Use Vite environment variable for API base URL, with a sensible fallback
const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Patients API
export const patientsAPI = {
  getAll: () => api.get('/patients'),
  getById: (id) => api.get(`/patients/${id}`),
  create: (data) => api.post('/patients', data),
};

// Authorizations API
export const authorizationsAPI = {
  getAll: (params) => api.get('/authorizations', { params }),
  getById: (id) => api.get(`/authorizations/${id}`),
  create: (data) => api.post('/authorizations', data),
};

// Payers API
export const payersAPI = {
  getAll: () => api.get('/payers'),
  getById: (id) => api.get(`/payers/${id}`),
};

// Providers API
export const providersAPI = {
  getAll: () => api.get('/providers'),
  getById: (id) => api.get(`/providers/${id}`),
  create: (data) => api.post('/providers', data),
};

export default api;
