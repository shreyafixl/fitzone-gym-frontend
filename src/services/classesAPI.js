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

// Classes API
export const classesAPI = {
  getAllClasses: async (params = {}) => {
    try {
      const response = await apiClient.get('/classes', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch classes' };
    }
  },

  getClassById: async (id) => {
    try {
      const response = await apiClient.get(`/classes/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch class' };
    }
  },

  createClass: async (classData) => {
    try {
      const response = await apiClient.post('/classes', classData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create class' };
    }
  },

  updateClass: async (id, classData) => {
    try {
      const response = await apiClient.put(`/classes/${id}`, classData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update class' };
    }
  },

  deleteClass: async (id) => {
    try {
      const response = await apiClient.delete(`/classes/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete class' };
    }
  },

  getClassesByCategory: async (categoryId, params = {}) => {
    try {
      const response = await apiClient.get(`/classes/category/${categoryId}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch classes' };
    }
  },

  getClassesByTrainer: async (trainerId, params = {}) => {
    try {
      const response = await apiClient.get(`/classes/trainer/${trainerId}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch classes' };
    }
  },
};

// Schedules API
export const schedulesAPI = {
  getAllSchedules: async (params = {}) => {
    try {
      const response = await apiClient.get('/class-schedules', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch schedules' };
    }
  },

  getScheduleById: async (id) => {
    try {
      const response = await apiClient.get(`/class-schedules/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch schedule' };
    }
  },

  createSchedule: async (scheduleData) => {
    try {
      const response = await apiClient.post('/class-schedules', scheduleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create schedule' };
    }
  },

  updateSchedule: async (id, scheduleData) => {
    try {
      const response = await apiClient.put(`/class-schedules/${id}`, scheduleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update schedule' };
    }
  },

  deleteSchedule: async (id) => {
    try {
      const response = await apiClient.delete(`/class-schedules/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete schedule' };
    }
  },

  markInProgress: async (id) => {
    try {
      const response = await apiClient.patch(`/class-schedules/${id}/in-progress`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to mark schedule as in-progress' };
    }
  },

  markCompleted: async (id) => {
    try {
      const response = await apiClient.patch(`/class-schedules/${id}/completed`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to mark schedule as completed' };
    }
  },

  cancelSchedule: async (id) => {
    try {
      const response = await apiClient.patch(`/class-schedules/${id}/cancel`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to cancel schedule' };
    }
  },
};

// Bookings API
export const bookingsAPI = {
  getAllBookings: async (params = {}) => {
    try {
      const response = await apiClient.get('/bookings', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch bookings' };
    }
  },

  getScheduleBookings: async (scheduleId, params = {}) => {
    try {
      const response = await apiClient.get(`/bookings/schedule/${scheduleId}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch schedule bookings' };
    }
  },

  getMemberBookings: async (memberId, params = {}) => {
    try {
      const response = await apiClient.get(`/bookings/member/${memberId}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch member bookings' };
    }
  },

  createBooking: async (bookingData) => {
    try {
      const response = await apiClient.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create booking' };
    }
  },

  cancelBooking: async (id) => {
    try {
      const response = await apiClient.delete(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to cancel booking' };
    }
  },

  getBookingStats: async (params = {}) => {
    try {
      const response = await apiClient.get('/bookings/stats/all', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch booking stats' };
    }
  },
};

// Categories API
export const categoriesAPI = {
  getAllCategories: async (params = {}) => {
    try {
      const response = await apiClient.get('/categories', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch categories' };
    }
  },

  getCategoryById: async (id) => {
    try {
      const response = await apiClient.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch category' };
    }
  },

  createCategory: async (categoryData) => {
    try {
      const response = await apiClient.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create category' };
    }
  },

  updateCategory: async (id, categoryData) => {
    try {
      const response = await apiClient.put(`/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update category' };
    }
  },

  deleteCategory: async (id) => {
    try {
      const response = await apiClient.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete category' };
    }
  },

  getCategoryStats: async () => {
    try {
      const response = await apiClient.get('/categories/stats/all');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch category stats' };
    }
  },
};

export default {
  classesAPI,
  schedulesAPI,
  bookingsAPI,
  categoriesAPI,
};
