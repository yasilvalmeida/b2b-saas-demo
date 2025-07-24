import axios from 'axios'
import { useAuth } from '@/hooks/use-auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = useAuth.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = useAuth.getState().refreshToken
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          })
          
          const { accessToken } = response.data
          useAuth.getState().login({
            ...useAuth.getState(),
            accessToken,
          })

          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return api(originalRequest)
        } catch (refreshError) {
          useAuth.getState().logout()
          window.location.href = '/login'
          return Promise.reject(refreshError)
        }
      }
    }

    return Promise.reject(error)
  }
)

// API endpoints
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  register: (userData: { name: string; email: string; password: string; organizationName: string }) =>
    api.post('/auth/register', userData),
  me: () => api.get('/auth/me'),
}

export const dealsApi = {
  getAll: (filters?: any) => api.get('/deals', { params: filters }),
  getById: (id: string) => api.get(`/deals/${id}`),
  create: (data: any) => api.post('/deals', data),
  update: (id: string, data: any) => api.patch(`/deals/${id}`, data),
  changeStage: (id: string, data: any) => api.patch(`/deals/${id}/stage`, data),
  delete: (id: string) => api.delete(`/deals/${id}`),
}

export const commissionsApi = {
  getAll: (filters?: any) => api.get('/commissions', { params: filters }),
  getSummary: () => api.get('/commissions/summary'),
  getByUser: () => api.get('/commissions/by-user'),
}

export const usersApi = {
  getAll: () => api.get('/users'),
  getProfile: () => api.get('/users/profile'),
  update: (id: string, data: any) => api.patch(`/users/${id}`, data),
  create: (data: any) => api.post('/users', data),
  delete: (id: string) => api.delete(`/users/${id}`),
} 