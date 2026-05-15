import api from './api';

/**
 * Admin Analytics API Service
 * Handles all analytics-related operations for admin dashboard
 */

export const adminAnalyticsService = {
  /**
   * Get dashboard overview analytics
   * @param {string} startDate - Start date (ISO format)
   * @param {string} endDate - End date (ISO format)
   * @returns {Promise} { data: { metrics: {...} } }
   */
  getDashboardAnalytics: async (startDate, endDate) => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const response = await api.get('/admin/analytics/dashboard', { params });
      return response.data;
    } catch (error) {
      console.error('[Analytics] Error fetching dashboard analytics:', error);
      throw error;
    }
  },

  /**
   * Get revenue trends and analytics
   * @param {string} period - Period type (daily, weekly, monthly, yearly)
   * @param {string} startDate - Start date (ISO format)
   * @param {string} endDate - End date (ISO format)
   * @returns {Promise} { data: { totalRevenue, revenueTrend, revenueByPlan, averageTransaction } }
   */
  getRevenueTrends: async (period = 'monthly', startDate, endDate) => {
    try {
      const params = { period };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const response = await api.get('/admin/analytics/revenue', { params });
      return response.data;
    } catch (error) {
      console.error('[Analytics] Error fetching revenue trends:', error);
      throw error;
    }
  },

  /**
   * Get members analytics
   * @param {string} period - Period type (daily, weekly, monthly, yearly)
   * @param {string} startDate - Start date (ISO format)
   * @param {string} endDate - End date (ISO format)
   * @returns {Promise} { data: { totalMembers, activeMembers, inactiveMembers, retentionRate, memberGrowth, statusBreakdown } }
   */
  getMembersAnalytics: async (period = 'monthly', startDate, endDate) => {
    try {
      const params = { period };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const response = await api.get('/admin/analytics/members', { params });
      return response.data;
    } catch (error) {
      console.error('[Analytics] Error fetching members analytics:', error);
      throw error;
    }
  },

  /**
   * Get popular classes analytics
   * @param {number} limit - Number of classes to return (default: 10)
   * @param {string} startDate - Start date (ISO format)
   * @param {string} endDate - End date (ISO format)
   * @returns {Promise} { data: { popularClasses, categoryDistribution, averageOccupancy } }
   */
  getPopularClasses: async (limit = 10, startDate, endDate) => {
    try {
      const params = { limit };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const response = await api.get('/admin/analytics/classes', { params });
      return response.data;
    } catch (error) {
      console.error('[Analytics] Error fetching popular classes:', error);
      throw error;
    }
  },
};

export default adminAnalyticsService;
