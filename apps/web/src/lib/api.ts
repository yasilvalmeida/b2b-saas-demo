import axios from 'axios';
import { useAuth } from '@/hooks/use-auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = useAuth.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(
    '🌐 API Request:',
    config.method?.toUpperCase(),
    config.url,
    config.data
  );
  return config;
});

// Response interceptor to handle token refresh and data transformation
api.interceptors.response.use(
  (response) => {
    console.log(
      '✅ API Response:',
      response.status,
      response.config.url,
      response.data
    );
    return response;
  },
  async (error) => {
    console.error(
      '❌ API Error:',
      error.response?.status,
      error.config?.url,
      error.response?.data
    );
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const currentRefreshToken = useAuth.getState().refreshToken;
      if (currentRefreshToken) {
        try {
          const refreshResponse: any = await axios.post(
            `${API_URL}/auth/refresh`,
            {
              refreshToken: currentRefreshToken,
            }
          );

          const { accessToken, user, refreshToken } = refreshResponse.data;
          useAuth.getState().login({
            user,
            accessToken,
            refreshToken,
          });

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          useAuth.getState().logout();
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

// API endpoints
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  register: (userData: {
    name: string;
    email: string;
    password: string;
    organizationName: string;
  }) => api.post('/auth/register', userData),
  me: () => api.get('/auth/me'),
};

export const dealsApi = {
  getAll: (filters?: any) => api.get('/deals', { params: filters }),
  getById: (id: string) => api.get(`/deals/${id}`),
  create: (data: any) => api.post('/deals', data),
  update: (id: string, data: any) => api.patch(`/deals/${id}`, data),
  changeStage: (id: string, data: any) => api.patch(`/deals/${id}/stage`, data),
  delete: (id: string) => api.delete(`/deals/${id}`),
};

export const commissionsApi = {
  getAll: (filters?: any) => api.get('/commissions', { params: filters }),
  getSummary: () => api.get('/commissions/summary'),
  getByUser: () => api.get('/commissions/by-user'),
};

export const kpisApi = {
  getDashboard: (filters?: any) =>
    api.get('/kpis/dashboard', { params: filters }),
  getMetrics: (filters?: any) => api.get('/kpis/metrics', { params: filters }),
};

export const calendarApi = {
  getAll: (filters?: any) => api.get('/calendar', { params: filters }),
  getById: (id: string) => api.get(`/calendar/${id}`),
  create: (data: any) => api.post('/calendar', data),
  update: (id: string, data: any) => api.patch(`/calendar/${id}`, data),
  delete: (id: string) => api.delete(`/calendar/${id}`),
};

export const usersApi = {
  getAll: () => api.get('/users'),
  getProfile: () => api.get('/users/profile'),
  update: (id: string, data: any) => api.patch(`/users/${id}`, data),
  create: (data: any) => api.post('/users', data),
  delete: (id: string) => api.delete(`/users/${id}`),
};

export const organizationsApi = {
  getProfile: () => api.get('/organizations/profile'),
  update: (data: any) => api.patch('/organizations/profile', data),
};

export const billingApi = {
  getPlans: () => api.get('/billing/plans'),
  getSubscription: () => api.get('/billing/subscription'),
  createCheckoutSession: (data: any) =>
    api.post('/billing/checkout-session', data),
  createPortalSession: () => api.post('/billing/portal-session'),
};

export const auditApi = {
  getAll: (filters?: any) => api.get('/audit', { params: filters }),
  getById: (id: string) => api.get(`/audit/${id}`),
};
