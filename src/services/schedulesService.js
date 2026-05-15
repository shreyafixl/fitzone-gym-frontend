import api from './api';

/**
 * Schedules API Service
 * Handles all schedule-related operations for admin dashboard
 */

export const schedulesService = {
  /**
   * Get all schedules with pagination and filtering
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Items per page (default: 10)
   * @param {object} filters - Filter object { classId, trainer, status, dateFrom, dateTo }
   * @returns {Promise} { data: [...], pagination: {...} }
   */
  getAllSchedules: async (page = 1, limit = 10, filters = {}) => {
    try {
      const params = {
        page,
        limit,
        ...filters,
      };
      const response = await api.get('/admin/class-schedules', { params });
      return response.data;
    } catch (error) {
      console.error('[Schedules] Error fetching schedules:', error);
      throw error;
    }
  },

  /**
   * Get single schedule by ID
   * @param {string} scheduleId - Schedule ID
   * @returns {Promise} { data: {...} }
   */
  getScheduleById: async (scheduleId) => {
    try {
      const response = await api.get(`/admin/class-schedules/${scheduleId}`);
      return response.data;
    } catch (error) {
      console.error('[Schedules] Error fetching schedule:', error);
      throw error;
    }
  },

  /**
   * Create new schedule
   * @param {object} scheduleData - { classId, date, startTime, endTime, trainer, capacity, sessionStatus }
   * @returns {Promise} { data: {...}, message: "..." }
   */
  createSchedule: async (scheduleData) => {
    try {
      const response = await api.post('/admin/class-schedules', scheduleData);
      return response.data;
    } catch (error) {
      console.error('[Schedules] Error creating schedule:', error);
      throw error;
    }
  },

  /**
   * Update schedule information
   * @param {string} scheduleId - Schedule ID
   * @param {object} scheduleData - Schedule data to update
   * @returns {Promise} { data: {...}, message: "..." }
   */
  updateSchedule: async (scheduleId, scheduleData) => {
    try {
      const response = await api.put(`/admin/class-schedules/${scheduleId}`, scheduleData);
      return response.data;
    } catch (error) {
      console.error('[Schedules] Error updating schedule:', error);
      throw error;
    }
  },

  /**
   * Delete schedule
   * @param {string} scheduleId - Schedule ID
   * @returns {Promise} { message: "..." }
   */
  deleteSchedule: async (scheduleId) => {
    try {
      const response = await api.delete(`/admin/class-schedules/${scheduleId}`);
      return response.data;
    } catch (error) {
      console.error('[Schedules] Error deleting schedule:', error);
      throw error;
    }
  },

  /**
   * Mark schedule as in-progress
   * @param {string} scheduleId - Schedule ID
   * @returns {Promise} { data: {...}, message: "..." }
   */
  markInProgress: async (scheduleId) => {
    try {
      const response = await api.patch(`/admin/class-schedules/${scheduleId}/in-progress`);
      return response.data;
    } catch (error) {
      console.error('[Schedules] Error marking schedule in-progress:', error);
      throw error;
    }
  },

  /**
   * Mark schedule as completed
   * @param {string} scheduleId - Schedule ID
   * @returns {Promise} { data: {...}, message: "..." }
   */
  markCompleted: async (scheduleId) => {
    try {
      const response = await api.patch(`/admin/class-schedules/${scheduleId}/completed`);
      return response.data;
    } catch (error) {
      console.error('[Schedules] Error marking schedule completed:', error);
      throw error;
    }
  },

  /**
   * Cancel schedule
   * @param {string} scheduleId - Schedule ID
   * @returns {Promise} { data: {...}, message: "..." }
   */
  cancelSchedule: async (scheduleId) => {
    try {
      const response = await api.patch(`/admin/class-schedules/${scheduleId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('[Schedules] Error cancelling schedule:', error);
      throw error;
    }
  },
};

export default schedulesService;
