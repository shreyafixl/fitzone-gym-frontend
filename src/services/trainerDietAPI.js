/**
 * Trainer Diet API Service
 * Handles all API calls related to diet plans, meal tracking, and nutrition recommendations
 * 
 * Features:
 * - Create/edit/delete diet plans
 * - Assign diets to clients
 * - Track meal scheduling
 * - Monitor nutrition progress
 * - Generate nutrition recommendations
 */

import apiClient from '../utils/axiosConfig';
import { handleAPIError, logError } from '../utils/errorHandler';

const API_BASE_URL = '/trainer/diets';

/**
 * Get all diet plans for trainer
 * Supports pagination, filtering, searching, and sorting
 * 
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10)
 * @param {string} params.search - Search by diet title
 * @param {string} params.status - Filter by status (active, completed, paused, cancelled)
 * @param {string} params.dietType - Filter by diet type
 * @param {string} params.memberId - Filter by member ID
 * @param {string} params.sortBy - Sort field (default: createdAt)
 * @param {string} params.sortOrder - Sort order (asc or desc)
 * @returns {Promise<Object>} Paginated diet plans
 * @throws {Error} If request fails
 */
export const getAllDiets = async (params = {}) => {
  try {
    const response = await apiClient.get(API_BASE_URL, { params });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getAllDiets');
    throw handleAPIError(error, 'Diet Plans');
  }
};

/**
 * Get diet plan by ID
 * 
 * @param {string} dietId - Diet plan ID
 * @returns {Promise<Object>} Diet plan details
 * @throws {Error} If request fails
 */
export const getDietById = async (dietId) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/${dietId}`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getDietById');
    throw handleAPIError(error, 'Diet Plan');
  }
};

/**
 * Create new diet plan
 * 
 * @param {Object} dietData - Diet plan data
 * @param {string} dietData.memberId - Member ID to assign diet to
 * @param {string} dietData.dietTitle - Title of the diet
 * @param {string} dietData.dietType - Type of diet (weight-loss, muscle-building, etc.)
 * @param {Array} dietData.mealSchedule - Array of meals with foods
 * @param {Object} dietData.calorieTarget - Daily calorie and macro targets
 * @param {Array} dietData.restrictions - Dietary restrictions
 * @param {Array} dietData.supplements - Supplements to take
 * @param {number} dietData.hydrationGoal - Daily water intake in liters
 * @param {string} dietData.startDate - Start date
 * @param {string} dietData.endDate - End date (optional)
 * @param {number} dietData.duration - Duration in days
 * @param {string} dietData.notes - Additional notes
 * @returns {Promise<Object>} Created diet plan
 * @throws {Error} If request fails
 */
export const createDiet = async (dietData) => {
  try {
    const response = await apiClient.post(API_BASE_URL, dietData);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'createDiet');
    throw handleAPIError(error, 'Create Diet Plan');
  }
};

/**
 * Update diet plan
 * 
 * @param {string} dietId - Diet plan ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated diet plan
 * @throws {Error} If request fails
 */
export const updateDiet = async (dietId, updateData) => {
  try {
    const response = await apiClient.put(`${API_BASE_URL}/${dietId}`, updateData);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'updateDiet');
    throw handleAPIError(error, 'Update Diet Plan');
  }
};

/**
 * Delete diet plan
 * 
 * @param {string} dietId - Diet plan ID
 * @returns {Promise<Object>} Deletion confirmation
 * @throws {Error} If request fails
 */
export const deleteDiet = async (dietId) => {
  try {
    const response = await apiClient.delete(`${API_BASE_URL}/${dietId}`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'deleteDiet');
    throw handleAPIError(error, 'Delete Diet Plan');
  }
};

/**
 * Assign diet plan to a member
 * 
 * @param {string} dietId - Diet plan ID
 * @param {string} memberId - Member ID to assign to
 * @returns {Promise<Object>} Updated diet plan
 * @throws {Error} If request fails
 */
export const assignDiet = async (dietId, memberId) => {
  try {
    const response = await apiClient.post(`${API_BASE_URL}/${dietId}/assign`, {
      memberId,
    });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'assignDiet');
    throw handleAPIError(error, 'Assign Diet');
  }
};

/**
 * Update diet progress
 * 
 * @param {string} dietId - Diet plan ID
 * @param {number} progress - Progress percentage (0-100)
 * @returns {Promise<Object>} Updated diet plan
 * @throws {Error} If request fails
 */
export const updateDietProgress = async (dietId, progress) => {
  try {
    const response = await apiClient.put(`${API_BASE_URL}/${dietId}/progress`, {
      progress,
    });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'updateDietProgress');
    throw handleAPIError(error, 'Update Progress');
  }
};

/**
 * Update diet adherence rate
 * 
 * @param {string} dietId - Diet plan ID
 * @param {number} adherenceRate - Adherence percentage (0-100)
 * @returns {Promise<Object>} Updated diet plan
 * @throws {Error} If request fails
 */
export const updateDietAdherence = async (dietId, adherenceRate) => {
  try {
    const response = await apiClient.put(`${API_BASE_URL}/${dietId}/adherence`, {
      adherenceRate,
    });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'updateDietAdherence');
    throw handleAPIError(error, 'Update Adherence');
  }
};

/**
 * Get diet statistics
 * 
 * @returns {Promise<Object>} Diet statistics
 * @throws {Error} If request fails
 */
export const getDietStats = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/stats`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getDietStats');
    throw handleAPIError(error, 'Diet Statistics');
  }
};

/**
 * Get diet recommendations for a member
 * Calculates BMR, TDEE, and macro recommendations based on member profile
 * 
 * @param {string} memberId - Member ID
 * @returns {Promise<Object>} Diet recommendations
 * @throws {Error} If request fails
 */
export const getDietRecommendations = async (memberId) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/recommendations/${memberId}`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getDietRecommendations');
    throw handleAPIError(error, 'Diet Recommendations');
  }
};

/**
 * Get diets for a specific member
 * 
 * @param {string} memberId - Member ID
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Member's diet plans
 * @throws {Error} If request fails
 */
export const getMemberDiets = async (memberId, params = {}) => {
  try {
    const response = await apiClient.get(API_BASE_URL, {
      params: { ...params, memberId },
    });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getMemberDiets');
    throw handleAPIError(error, 'Member Diets');
  }
};

/**
 * Search diets
 * 
 * @param {string} searchTerm - Search term
 * @param {Object} params - Additional query parameters
 * @returns {Promise<Object>} Search results
 * @throws {Error} If request fails
 */
export const searchDiets = async (searchTerm, params = {}) => {
  try {
    const response = await apiClient.get(API_BASE_URL, {
      params: { ...params, search: searchTerm },
    });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'searchDiets');
    throw handleAPIError(error, 'Search Diets');
  }
};

/**
 * Get active diets
 * 
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Active diet plans
 * @throws {Error} If request fails
 */
export const getActiveDiets = async (params = {}) => {
  try {
    const response = await apiClient.get(API_BASE_URL, {
      params: { ...params, status: 'active' },
    });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getActiveDiets');
    throw handleAPIError(error, 'Active Diets');
  }
};

/**
 * Get completed diets
 * 
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Completed diet plans
 * @throws {Error} If request fails
 */
export const getCompletedDiets = async (params = {}) => {
  try {
    const response = await apiClient.get(API_BASE_URL, {
      params: { ...params, status: 'completed' },
    });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getCompletedDiets');
    throw handleAPIError(error, 'Completed Diets');
  }
};

/**
 * Get diets by type
 * 
 * @param {string} dietType - Diet type
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Diets by type
 * @throws {Error} If request fails
 */
export const getDietsByType = async (dietType, params = {}) => {
  try {
    const response = await apiClient.get(API_BASE_URL, {
      params: { ...params, dietType },
    });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getDietsByType');
    throw handleAPIError(error, 'Diets by Type');
  }
};

/**
 * Pause diet plan
 * 
 * @param {string} dietId - Diet plan ID
 * @returns {Promise<Object>} Updated diet plan
 * @throws {Error} If request fails
 */
export const pauseDiet = async (dietId) => {
  try {
    const response = await apiClient.put(`${API_BASE_URL}/${dietId}`, {
      status: 'paused',
    });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'pauseDiet');
    throw handleAPIError(error, 'Pause Diet');
  }
};

/**
 * Resume diet plan
 * 
 * @param {string} dietId - Diet plan ID
 * @returns {Promise<Object>} Updated diet plan
 * @throws {Error} If request fails
 */
export const resumeDiet = async (dietId) => {
  try {
    const response = await apiClient.put(`${API_BASE_URL}/${dietId}`, {
      status: 'active',
    });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'resumeDiet');
    throw handleAPIError(error, 'Resume Diet');
  }
};

/**
 * Complete diet plan
 * 
 * @param {string} dietId - Diet plan ID
 * @returns {Promise<Object>} Updated diet plan
 * @throws {Error} If request fails
 */
export const completeDiet = async (dietId) => {
  try {
    const response = await apiClient.put(`${API_BASE_URL}/${dietId}`, {
      status: 'completed',
      progress: 100,
    });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'completeDiet');
    throw handleAPIError(error, 'Complete Diet');
  }
};

export const trainerDietAPI = {
  getAllDiets,
  getDietById,
  createDiet,
  updateDiet,
  deleteDiet,
  assignDiet,
  updateDietProgress,
  updateDietAdherence,
  getDietStats,
  getDietRecommendations,
  getMemberDiets,
  searchDiets,
  getActiveDiets,
  getCompletedDiets,
  getDietsByType,
  pauseDiet,
  resumeDiet,
  completeDiet,
};

export default trainerDietAPI;
