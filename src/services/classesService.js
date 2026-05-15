import api from './api';

/**
 * Classes API Service
 * Handles all class-related operations for admin dashboard
 */

export const classesService = {
  /**
   * Get all classes with pagination, filtering, and search
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Items per page (default: 10)
   * @param {object} filters - Filter object { category, trainer, status, search }
   * @returns {Promise} { data: [...], pagination: {...} }
   */
  getAllClasses: async (page = 1, limit = 10, filters = {}) => {
    try {
      const token = localStorage.getItem('gym-auth-token');
      console.log('[Classes] Token available:', !!token);
      
      const params = {
        page,
        limit,
        ...filters,
      };
      const response = await api.get('/admin/classes', { params });
      return response.data;
    } catch (error) {
      console.error('[Classes] Error fetching classes:', error);
      console.error('[Classes] Error response:', error.response?.data);
      throw error;
    }
  },

  /**
   * Get single class by ID
   * @param {string} classId - Class ID
   * @returns {Promise} { data: {...} }
   */
  getClassById: async (classId) => {
    try {
      const response = await api.get(`/admin/classes/${classId}`);
      return response.data;
    } catch (error) {
      console.error('[Classes] Error fetching class:', error);
      throw error;
    }
  },

  /**
   * Create new class
   * @param {object} classData - { className, category, trainer, duration, capacity, difficultyLevel, description, price, image }
   * @returns {Promise} { data: {...}, message: "..." }
   */
  createClass: async (classData) => {
    try {
      const response = await api.post('/admin/classes', classData);
      return response.data;
    } catch (error) {
      console.error('[Classes] Error creating class:', error);
      throw error;
    }
  },

  /**
   * Update class information
   * @param {string} classId - Class ID
   * @param {object} classData - Class data to update
   * @returns {Promise} { data: {...}, message: "..." }
   */
  updateClass: async (classId, classData) => {
    try {
      const response = await api.put(`/admin/classes/${classId}`, classData);
      return response.data;
    } catch (error) {
      console.error('[Classes] Error updating class:', error);
      throw error;
    }
  },

  /**
   * Delete class
   * @param {string} classId - Class ID
   * @returns {Promise} { message: "..." }
   */
  deleteClass: async (classId) => {
    try {
      const response = await api.delete(`/admin/classes/${classId}`);
      return response.data;
    } catch (error) {
      console.error('[Classes] Error deleting class:', error);
      throw error;
    }
  },

  /**
   * Get classes by category
   * @param {string} categoryId - Category ID
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise} { data: [...], pagination: {...} }
   */
  getClassesByCategory: async (categoryId, page = 1, limit = 10) => {
    try {
      const response = await api.get(`/admin/classes/category/${categoryId}`, {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error('[Classes] Error fetching classes by category:', error);
      throw error;
    }
  },

  /**
   * Get classes by trainer
   * @param {string} trainerId - Trainer ID
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise} { data: [...], pagination: {...} }
   */
  getClassesByTrainer: async (trainerId, page = 1, limit = 10) => {
    try {
      const response = await api.get(`/admin/classes/trainer/${trainerId}`, {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error('[Classes] Error fetching classes by trainer:', error);
      throw error;
    }
  },
};

export default classesService;
