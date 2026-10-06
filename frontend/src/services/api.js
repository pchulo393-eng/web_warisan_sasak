import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + '/api',
  headers: {
    'Accept': 'application/json',
  }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Jangan set Content-Type kalau body adalah FormData (biarkan browser set boundary otomatis)
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const heritageApi = {
  getAll: (params) => api.get('/heritage', { params }),
  getById: (id) => api.get(`/heritage/${id}`),
  getGeoJson: () => api.get('/heritage/geojson'),
  create: (data) => api.post('/admin/heritage', data),
  update: (id, data) => api.put(`/admin/heritage/${id}`, data),
  delete: (id) => api.delete(`/admin/heritage/${id}`),
  uploadPhoto: (heritageId, formData) => api.post(`/admin/heritage/${heritageId}/photos`, formData),
  deletePhoto: (heritageId, fotoId) => api.delete(`/admin/heritage/${heritageId}/photos/${fotoId}`),
  setPrimaryPhoto: (heritageId, fotoId) => api.patch(`/admin/heritage/${heritageId}/photos/${fotoId}/primary`),
  reAnalyzePhoto: (heritageId, fotoId) => api.post(`/admin/heritage/${heritageId}/photos/${fotoId}/reanalyze`),
  getMetrics: () => api.get('/metrics'),
};

export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

export default api;
