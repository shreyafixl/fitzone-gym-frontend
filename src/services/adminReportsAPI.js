import axios from 'axios';

const API_BASE_URL = '/api/admin';

const getAuthToken = () => {
  return localStorage.getItem('adminToken') || localStorage.getItem('token');
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export const revenueReportAPI = {
  getRevenueReport: async (params = {}) => {
    try {
      const response = await apiClient.get('/reports/revenue', { params });
      return response.data.data || response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch revenue report' };
    }
  },

  getRevenueByPeriod: async (period, params = {}) => {
    try {
      const response = await apiClient.get(`/reports/revenue/${period}`, { params });
      return response.data.data || response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch revenue by period' };
    }
  },

  getRevenueByPlan: async (params = {}) => {
    try {
      const response = await apiClient.get('/reports/revenue/by-plan', { params });
      return response.data.data || response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch revenue by plan' };
    }
  },

  exportRevenue: async (format = 'csv', params = {}) => {
    try {
      const response = await apiClient.get(`/reports/revenue/export/${format}`, {
        params,
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: `Failed to export revenue as ${format}` };
    }
  },
};

export const attendanceReportAPI = {
  getAttendanceReport: async (params = {}) => {
    try {
      const response = await apiClient.get('/reports/attendance', { params });
      return response.data.data || response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch attendance report' };
    }
  },

  getAttendanceByDateRange: async (startDate, endDate, params = {}) => {
    try {
      const response = await apiClient.get('/reports/attendance/date-range', {
        params: { startDate, endDate, ...params },
      });
      return response.data.data || response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch attendance by date range' };
    }
  },

  getAttendanceStats: async (params = {}) => {
    try {
      const response = await apiClient.get('/reports/attendance/stats', { params });
      return response.data.data || response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch attendance stats' };
    }
  },

  getPeakHours: async (params = {}) => {
    try {
      const response = await apiClient.get('/reports/attendance/peak-hours', { params });
      return response.data.data || response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch peak hours' };
    }
  },

  exportAttendance: async (format = 'csv', params = {}) => {
    try {
      const response = await apiClient.get(`/reports/attendance/export/${format}`, {
        params,
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: `Failed to export attendance as ${format}` };
    }
  },
};

export const performanceReportAPI = {
  getPerformanceReport: async (params = {}) => {
    try {
      const response = await apiClient.get('/reports/performance', { params });
      return response.data.data || response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch performance report' };
    }
  },

  getTrainerPerformance: async (params = {}) => {
    try {
      const response = await apiClient.get('/reports/performance/trainers', { params });
      return response.data.data || response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch trainer performance' };
    }
  },

  getClassPerformance: async (params = {}) => {
    try {
      const response = await apiClient.get('/reports/performance/classes', { params });
      return response.data.data || response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch class performance' };
    }
  },

  getMemberEngagement: async (params = {}) => {
    try {
      const response = await apiClient.get('/reports/performance/member-engagement', { params });
      return response.data.data || response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch member engagement' };
    }
  },

  exportPerformance: async (format = 'csv', params = {}) => {
    try {
      const response = await apiClient.get(`/reports/performance/export/${format}`, {
        params,
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: `Failed to export performance as ${format}` };
    }
  },
};

export default {
  revenueReportAPI,
  attendanceReportAPI,
  performanceReportAPI,
};
