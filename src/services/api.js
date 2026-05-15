import axios from 'axios';

// API Base URL - change this to your backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Log API base URL for debugging
console.log('[API] Base URL:', API_BASE_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gym-auth-token');
    console.log('[API Interceptor] Token check:', {
      hasToken: !!token,
      tokenLength: token ? token.length : 0,
      url: config.url,
      method: config.method
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('[API Interceptor] Token added to request');
    } else {
      console.warn('[API Interceptor] No token found in localStorage');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API Error] Response error:', {
      status: error.response?.status,
      message: error.response?.data?.message,
      url: error.config?.url,
      method: error.config?.method
    });
    
    if (error.response?.status === 401) {
      console.warn('[API] 401 Unauthorized - Token may be invalid or expired');
      // Only redirect to login if we're not already on the login page
      // and if we have a token (meaning it expired)
      const token = localStorage.getItem('gym-auth-token');
      if (token && window.location.pathname !== '/login') {
        // Token expired or invalid - clear auth data
        console.log('[API] Clearing auth data and redirecting to login');
        localStorage.removeItem('gym-auth-token');
        localStorage.removeItem('gym-auth-user');
        // Redirect to login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  // Sign up new user
  signup: async (fullName, email, password, phone = null, gender = 'other', age = 18) => {
    const response = await api.post('/auth/signup', { 
      fullName, 
      email, 
      password, 
      phone,
      gender,
      age
    });
    return response.data;
  },

  // Login user
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Get current user
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/auth/password', { currentPassword, newPassword });
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },
};

export default api;
