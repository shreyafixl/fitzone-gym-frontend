import api from './api';

/**
 * Categories API Service
 * Handles all category-related operations for admin dashboard
 */

export const categoriesService = {
  /**
   * Get all categories with pagination
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Items per page (default: 10)
   * @param {object} filters - Filter object { search, status }
   * @returns {Promise} { data: [...], pagination: {...} }
   */
  getAllCategories: async (page = 1, limit = 10, filters = {}) => {
    try {
      const params = {
        page,
        limit,
        ...filters,
      };
      const response = await api.get('/admin/categories', { params });
      return response.data;
    } catch (error) {
      console.error('[Categories] Error fetching categories:', error);
      throw error;
    }
  },

  /**
   * Get single category by ID
   * @param {string} categoryId - Category ID
   * @returns {Promise} { data: {...} }
   */
  getCategoryById: async (categoryId) => {
    try {
      const response = await api.get(`/admin/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error('[Categories] Error fetching category:', error);
      throw error;
    }
  },

  /**
   * Create new category
   * @param {object} categoryData - { categoryName, description, color, icon }
   * @returns {Promise} { data: {...}, message: "..." }
   */
  createCategory: async (categoryData) => {
    try {
      const response = await api.post('/admin/categories', categoryData);
      return response.data;
    } catch (error) {
      console.error('[Categories] Error creating category:', error);
      throw error;
    }
  },

  /**
   * Update category information
   * @param {string} categoryId - Category ID
   * @param {object} categoryData - Category data to update
   * @returns {Promise} { data: {...}, message: "..." }
   */
  updateCategory: async (categoryId, categoryData) => {
    try {
      const response = await api.put(`/admin/categories/${categoryId}`, categoryData);
      return response.data;
    } catch (error) {
      console.error('[Categories] Error updating category:', error);
      throw error;
    }
  },

  /**
   * Delete category
   * @param {string} categoryId - Category ID
   * @returns {Promise} { message: "..." }
   */
  deleteCategory: async (categoryId) => {
    try {
      const response = await api.delete(`/admin/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error('[Categories] Error deleting category:', error);
      throw error;
    }
  },

  /**
   * Get category statistics
   * @returns {Promise} { totalCategories, activeCategories, classesPerCategory }
   */
  getCategoryStats: async () => {
    try {
      const response = await api.get('/admin/categories/stats/all');
      return response.data;
    } catch (error) {
      console.error('[Categories] Error fetching category stats:', error);
      throw error;
    }
  },
};

export default categoriesService;
