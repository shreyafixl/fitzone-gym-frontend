/**
 * Trainer Dashboard API Service
 * Handles all API calls related to trainer dashboard, statistics, and ratings
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8
 */

import apiClient from '../utils/axiosConfig';
import { handleAPIError, logError } from '../utils/errorHandler';

const API_BASE_URL = '/trainer';

/**
 * Get dashboard overview data
 * Fetches trainer information and statistics
 * 
 * @returns {Promise<Object>} Dashboard overview data
 * @throws {Error} If request fails
 */
export const getDashboardOverview = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/dashboard`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getDashboardOverview');
    throw handleAPIError(error, 'Dashboard Overview');
  }
};

/**
 * Get member analytics
 * Fetches analytics about assigned members
 * 
 * @returns {Promise<Object>} Member analytics data
 * @throws {Error} If request fails
 */
export const getMemberAnalytics = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/dashboard/members`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getMemberAnalytics');
    throw handleAPIError(error, 'Member Analytics');
  }
};

/**
 * Get session analytics
 * Fetches analytics about training sessions
 * 
 * @returns {Promise<Object>} Session analytics data
 * @throws {Error} If request fails
 */
export const getSessionAnalytics = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/dashboard/sessions`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getSessionAnalytics');
    throw handleAPIError(error, 'Session Analytics');
  }
};

/**
 * Get attendance analytics
 * Fetches analytics about member attendance
 * 
 * @returns {Promise<Object>} Attendance analytics data
 * @throws {Error} If request fails
 */
export const getAttendanceAnalytics = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/dashboard/attendance`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getAttendanceAnalytics');
    throw handleAPIError(error, 'Attendance Analytics');
  }
};

/**
 * Get workout analytics
 * Fetches analytics about assigned workout plans
 * 
 * @returns {Promise<Object>} Workout analytics data
 * @throws {Error} If request fails
 */
export const getWorkoutAnalytics = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/dashboard/workouts`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getWorkoutAnalytics');
    throw handleAPIError(error, 'Workout Analytics');
  }
};

/**
 * Get diet analytics
 * Fetches analytics about assigned diet plans
 * 
 * @returns {Promise<Object>} Diet analytics data
 * @throws {Error} If request fails
 */
export const getDietAnalytics = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/dashboard/diets`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getDietAnalytics');
    throw handleAPIError(error, 'Diet Analytics');
  }
};

/**
 * Get progress analytics
 * Fetches analytics about member progress
 * 
 * @returns {Promise<Object>} Progress analytics data
 * @throws {Error} If request fails
 */
export const getProgressAnalytics = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/dashboard/progress`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getProgressAnalytics');
    throw handleAPIError(error, 'Progress Analytics');
  }
};

/**
 * Get performance statistics
 * Fetches trainer performance metrics
 * 
 * @returns {Promise<Object>} Performance statistics data
 * @throws {Error} If request fails
 */
export const getPerformanceStats = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/dashboard/performance`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getPerformanceStats');
    throw handleAPIError(error, 'Performance Statistics');
  }
};

/**
 * Get trainer ratings
 * Fetches trainer ratings and rating breakdown
 * 
 * @returns {Promise<Object>} Trainer ratings data
 * @throws {Error} If request fails
 */
export const getTrainerRatings = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/ratings`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getTrainerRatings');
    throw handleAPIError(error, 'Trainer Ratings');
  }
};

/**
 * Get trainer reviews
 * Fetches client reviews for the trainer with pagination and filtering
 * 
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Items per page
 * @param {number} rating - Filter by rating (optional)
 * @returns {Promise<Object>} Trainer reviews data with pagination
 * @throws {Error} If request fails
 */
export const getTrainerReviews = async (page = 1, limit = 10, rating = null) => {
  try {
    const params = { page, limit };
    if (rating) {
      params.rating = rating;
    }

    const response = await apiClient.get(`${API_BASE_URL}/reviews`, { params });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getTrainerReviews');
    throw handleAPIError(error, 'Trainer Reviews');
  }
};

/**
 * Get trainer profile
 * Fetches current trainer's profile information
 * 
 * @returns {Promise<Object>} Trainer profile data
 * @throws {Error} If request fails
 */
export const getTrainerProfile = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/profile`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getTrainerProfile');
    throw handleAPIError(error, 'Trainer Profile');
  }
};

/**
 * Update trainer profile
 * Updates trainer's profile information
 * 
 * @param {Object} profileData - Profile data to update
 * @returns {Promise<Object>} Updated trainer profile data
 * @throws {Error} If request fails
 */
export const updateTrainerProfile = async (profileData) => {
  try {
    const response = await apiClient.put(`${API_BASE_URL}/profile`, profileData);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'updateTrainerProfile');
    throw handleAPIError(error, 'Update Trainer Profile');
  }
};

/**
 * Get trainer statistics (legacy - use individual analytics functions)
 * 
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Trainer statistics data
 * @throws {Error} If request fails
 */
export const getTrainerStats = async (params = {}) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/dashboard/stats`, { params });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getTrainerStats');
    throw handleAPIError(error, 'Trainer Statistics');
  }
};

/**
 * Get all trainer settings
 * 
 * @returns {Promise<Object>} All settings data
 * @throws {Error} If request fails
 */
export const getAllSettings = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/settings`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getAllSettings');
    throw handleAPIError(error, 'Get All Settings');
  }
};

/**
 * Get profile settings
 * 
 * @returns {Promise<Object>} Profile settings data
 * @throws {Error} If request fails
 */
export const getProfileSettings = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/settings/profile`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getProfileSettings');
    throw handleAPIError(error, 'Get Profile Settings');
  }
};

/**
 * Update profile settings
 * 
 * @param {Object} profileData - Profile settings to update
 * @returns {Promise<Object>} Updated profile settings
 * @throws {Error} If request fails
 */
export const updateProfileSettings = async (profileData) => {
  try {
    const response = await apiClient.put(`${API_BASE_URL}/settings/profile`, profileData);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'updateProfileSettings');
    throw handleAPIError(error, 'Update Profile Settings');
  }
};

export const trainerDashboardAPI = {
  getDashboardOverview,
  getMemberAnalytics,
  getSessionAnalytics,
  getAttendanceAnalytics,
  getWorkoutAnalytics,
  getDietAnalytics,
  getProgressAnalytics,
  getPerformanceStats,
  getTrainerRatings,
  getTrainerReviews,
  getTrainerProfile,
  updateTrainerProfile,
  getTrainerStats,
  getAllSettings,
  getProfileSettings,
  updateProfileSettings,
};

export default trainerDashboardAPI;
