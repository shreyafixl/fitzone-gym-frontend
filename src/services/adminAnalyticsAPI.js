import api from './api';

/**
 * Admin Analytics API Service
 * All endpoints require admin authentication with canViewReports permission
 * Handles analytics data for members, revenue, and classes
 */

// ============================================================================
// MEMBERS ANALYTICS API
// ============================================================================

export const adminAnalyticsAPI = {
  /**
   * Fetch members analytics with growth trends and retention data
   * @param {object} filters - Filter object { startDate, endDate, period }
   * @returns {Promise} { success: true, data: {...}, message: "..." }
   */
  getMembersAnalytics: async (filters = {}) => {
    try {
      const params = {
        ...filters,
      };
      const response = await api.get('/admin/analytics/members', { params });
      return response.data;
    } catch (error) {
      console.error('[Analytics] Error fetching members analytics:', error);
      throw error;
    }
  },

  /**
   * Fetch revenue trends and financial data
   * @param {object} filters - Filter object { startDate, endDate, period }
   * @returns {Promise} { success: true, data: {...}, message: "..." }
   */
  getRevenueTrends: async (filters = {}) => {
    try {
      const params = {
        ...filters,
      };
      const response = await api.get('/admin/analytics/revenue', { params });
      return response.data;
    } catch (error) {
      console.error('[Analytics] Error fetching revenue trends:', error);
      throw error;
    }
  },

  /**
   * Fetch popular classes and occupancy data
   * @param {object} filters - Filter object { startDate, endDate, limit }
   * @returns {Promise} { success: true, data: {...}, message: "..." }
   */
  getPopularClasses: async (filters = {}) => {
    try {
      const params = {
        ...filters,
      };
      const response = await api.get('/admin/analytics/classes', { params });
      return response.data;
    } catch (error) {
      console.error('[Analytics] Error fetching popular classes:', error);
      throw error;
    }
  },

  /**
   * Fetch combined analytics dashboard data
   * @param {object} filters - Filter object { startDate, endDate }
   * @returns {Promise} { success: true, data: {...}, message: "..." }
   */
  getAnalyticsDashboard: async (filters = {}) => {
    try {
      const params = {
        ...filters,
      };
      const response = await api.get('/admin/analytics/dashboard', { params });
      return response.data;
    } catch (error) {
      console.error('[Analytics] Error fetching analytics dashboard:', error);
      throw error;
    }
  },
};

export default adminAnalyticsAPI;
