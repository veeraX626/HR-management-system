import axios, { AxiosError } from 'axios'
import { useAuthStore } from '@/stores/auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

console.log('🔌 [API] Initializing API client');
console.log('🔌 [API] Base URL:', API_BASE_URL);

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true,
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState()
    console.log('📤 [API] Request:', config.method?.toUpperCase(), config.url);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('🔐 [API] Token attached');
    }
    return config
  },
  (error) => {
    console.error('❌ [API] Request error:', error.message);
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log('📥 [API] Response:', response.status, response.config.url);
    return response;
  },
  (error: AxiosError) => {
    console.error('❌ [API] Response error:', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url,
      data: error.response?.data
    });
    
    if (error.response?.status === 401) {
      // Clear auth state on unauthorized
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || 'An error occurred'
  }
  return 'An unexpected error occurred'
}
