import axios from 'axios';

const apiBaseUrl = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('Phectrio_admin_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired/invalid admin sessions
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isProtectedAdminRoute =
        window.location.pathname.startsWith('/admin') &&
        window.location.pathname !== '/admin/login';

      if (isProtectedAdminRoute) {
        localStorage.removeItem('Phectrio_admin_token');
        localStorage.removeItem('Phectrio_admin_user');

        window.location.href = '/admin/login?expired=true';
      }
    }

    return Promise.reject(error);
  }
);

// Inquiry
export const submitInquiry = async (data) => {
  const res = await api.post('/inquiries', data);
  return res.data;
};

// Authentication
export const adminLogin = async (credentials) => {
  const res = await api.post('/auth/login', credentials);
  return res.data;
};

export const verifyAdminSession = async () => {
  const res = await api.get('/auth/me');
  return res.data;
};

// Admin
export const getAdminStats = async () => {
  const res = await api.get('/admin/stats');
  return res.data;
};

export const getAdminInquiries = async (params = {}) => {
  const res = await api.get('/admin/inquiries', { params });
  return res.data;
};

export const updateInquiryStatus = async (id, status) => {
  const res = await api.patch(`/admin/inquiries/${id}`, { status });
  return res.data;
};

export const deleteInquiry = async (id) => {
  const res = await api.delete(`/admin/inquiries/${id}`);
  return res.data;
};

// Projects
export const getProjects = async (params = {}) => {
  const res = await api.get('/projects', { params });
  return res.data;
};

export const createProject = async (projectData) => {
  const res = await api.post('/projects', projectData);
  return res.data;
};

export const deleteProject = async (id) => {
  const res = await api.delete(`/projects/${id}`);
  return res.data;
};

export const reSeedData = async () => {
  const res = await api.post('/admin/seed');
  return res.data;
};

export default api;