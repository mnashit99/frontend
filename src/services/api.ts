import axios from 'axios';
import { useAuthStore } from '../store/authStore'; // Add this import

// Constants
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
const AUTH_TOKEN_KEY = 'token';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common HTTP errors
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem(AUTH_TOKEN_KEY);
      
      // ✅ ADD THIS: Trigger logout in auth store
      const authStore = useAuthStore.getState();
      authStore.logout();
      
      // ✅ ADD THIS: Redirect to login with return URL
      const currentPath = window.location.pathname + window.location.search;
      if (!['/login', '/register'].includes(window.location.pathname)) {
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      }
    }
    
    // You can add more global error handling here
    return Promise.reject(error);
  }
);

// Helper function to clear auth token
export const clearAuthToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

// Helper function to set auth token
export const setAuthToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

// Helper function to get auth token
export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export default api;