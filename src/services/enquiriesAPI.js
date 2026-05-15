import axios from 'axios';

const API_BASE_URL = '/api/admin';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('gym-auth-token') || localStorage.getItem('adminToken') || localStorage.getItem('token');
};

// Create axios instance with default headers
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Enquiries API
export const enquiriesAPI = {
  getAllEnquiries: async (params = {}) => {
    try {
      const response = await apiClient.get('/enquiries', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch enquiries' };
    }
  },

  getEnquiryById: async (id) => {
    try {
      const response = await apiClient.get(`/enquiries/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch enquiry' };
    }
  },

  createEnquiry: async (enquiryData) => {
    try {
      const response = await apiClient.post('/enquiries', enquiryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create enquiry' };
    }
  },

  updateEnquiry: async (id, enquiryData) => {
    try {
      const response = await apiClient.put(`/enquiries/${id}`, enquiryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update enquiry' };
    }
  },

  deleteEnquiry: async (id) => {
    try {
      const response = await apiClient.delete(`/enquiries/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete enquiry' };
    }
  },

  addNote: async (id, noteData) => {
    try {
      const response = await apiClient.post(`/enquiries/${id}/notes`, noteData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add note' };
    }
  },

  markAsConverted: async (id, conversionData) => {
    try {
      const response = await apiClient.patch(`/enquiries/${id}/convert`, conversionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to mark as converted' };
    }
  },

  assignEnquiry: async (id, assignmentData) => {
    try {
      const response = await apiClient.patch(`/enquiries/${id}/assign`, assignmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to assign enquiry' };
    }
  },

  getEnquiriesByStatus: async (status, params = {}) => {
    try {
      const response = await apiClient.get(`/enquiries/status/${status}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch enquiries' };
    }
  },

  getEnquiryStats: async (params = {}) => {
    try {
      const response = await apiClient.get('/enquiries/stats/all', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch enquiry stats' };
    }
  },
};

// Follow-ups API
export const followUpsAPI = {
  getAllFollowUps: async (params = {}) => {
    try {
      const response = await apiClient.get('/follow-ups', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch follow-ups' };
    }
  },

  getFollowUpById: async (id) => {
    try {
      const response = await apiClient.get(`/follow-ups/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch follow-up' };
    }
  },

  createFollowUp: async (followUpData) => {
    try {
      const response = await apiClient.post('/follow-ups', followUpData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create follow-up' };
    }
  },

  updateFollowUp: async (id, followUpData) => {
    try {
      const response = await apiClient.put(`/follow-ups/${id}`, followUpData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update follow-up' };
    }
  },

  deleteFollowUp: async (id) => {
    try {
      const response = await apiClient.delete(`/follow-ups/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete follow-up' };
    }
  },

  markAsCompleted: async (id, completionData) => {
    try {
      const response = await apiClient.patch(`/follow-ups/${id}/complete`, completionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to mark as completed' };
    }
  },

  sendReminder: async (id) => {
    try {
      const response = await apiClient.patch(`/follow-ups/${id}/reminder`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to send reminder' };
    }
  },

  getPendingFollowUps: async (params = {}) => {
    try {
      const response = await apiClient.get('/follow-ups/pending/list', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch pending follow-ups' };
    }
  },

  getOverdueFollowUps: async (params = {}) => {
    try {
      const response = await apiClient.get('/follow-ups/overdue/list', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch overdue follow-ups' };
    }
  },

  getEnquiryFollowUps: async (enquiryId, params = {}) => {
    try {
      const response = await apiClient.get(`/follow-ups/enquiry/${enquiryId}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch follow-ups' };
    }
  },

  getFollowUpStats: async (params = {}) => {
    try {
      const response = await apiClient.get('/follow-ups/stats/all', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch follow-up stats' };
    }
  },
};

export default {
  enquiriesAPI,
  followUpsAPI,
};
