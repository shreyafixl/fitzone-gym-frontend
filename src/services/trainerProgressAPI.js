/**
 * Trainer Progress API Service
 * Handles all API calls related to progress tracking, analytics, and reporting
 * 
 * Features:
 * - Record member progress (measurements, strength, photos)
 * - Track fitness metrics and goals
 * - Generate fitness reports
 * - Retrieve weekly and monthly analytics
 * - Monitor adherence and performance
 */

import apiClient from '../utils/axiosConfig';
import { handleAPIError, logError } from '../utils/errorHandler';

const API_BASE_URL = '/trainer/progress';

/**
 * Record member progress
 * 
 * @param {Object} progressData - Progress data to record
 * @param {string} progressData.memberId - Member ID
 * @param {Date} progressData.recordDate - Date of record
 * @param {Object} progressData.bodyMeasurements - Body measurements (weight, chest, waist, etc.)
 * @param {Array} progressData.strengthMetrics - Strength metrics (exercise, weight, reps)
 * @param {Array} progressData.progressPhotos - Progress photos
 * @param {Object} progressData.fitnessMetrics - Fitness metrics (BMI, body fat %, etc.)
 * @param {Object} progressData.goals - Fitness goals
 * @param {string} progressData.notes - Additional notes
 * @param {string} progressData.mood - Member's mood (excellent, good, neutral, tired, exhausted)
 * @param {number} progressData.energyLevel - Energy level (1-10)
 * @param {number} progressData.sleepQuality - Sleep quality (1-10)
 * @param {number} progressData.dietAdherence - Diet adherence percentage (0-100)
 * @param {number} progressData.workoutAdherence - Workout adherence percentage (0-100)
 * @returns {Promise<Object>} Created progress record
 * @throws {Error} If request fails
 */
export const recordProgress = async (progressData) => {
  try {
    const response = await apiClient.post(API_BASE_URL, progressData);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'recordProgress');
    throw handleAPIError(error, 'Record Progress');
  }
};

/**
 * Get member progress history
 * 
 * @param {string} memberId - Member ID
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 20)
 * @param {string} params.startDate - Start date for filtering
 * @param {string} params.endDate - End date for filtering
 * @returns {Promise<Object>} Paginated progress records
 * @throws {Error} If request fails
 */
export const getMemberProgress = async (memberId, params = {}) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/member/${memberId}`, { params });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getMemberProgress');
    throw handleAPIError(error, 'Member Progress');
  }
};

/**
 * Get progress record by ID
 * 
 * @param {string} progressId - Progress record ID
 * @returns {Promise<Object>} Progress record details
 * @throws {Error} If request fails
 */
export const getProgressById = async (progressId) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/${progressId}`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getProgressById');
    throw handleAPIError(error, 'Progress Record');
  }
};

/**
 * Update progress record
 * 
 * @param {string} progressId - Progress record ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated progress record
 * @throws {Error} If request fails
 */
export const updateProgress = async (progressId, updateData) => {
  try {
    const response = await apiClient.put(`${API_BASE_URL}/${progressId}`, updateData);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'updateProgress');
    throw handleAPIError(error, 'Update Progress');
  }
};

/**
 * Delete progress record
 * 
 * @param {string} progressId - Progress record ID
 * @returns {Promise<Object>} Deletion confirmation
 * @throws {Error} If request fails
 */
export const deleteProgress = async (progressId) => {
  try {
    const response = await apiClient.delete(`${API_BASE_URL}/${progressId}`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'deleteProgress');
    throw handleAPIError(error, 'Delete Progress');
  }
};

/**
 * Get member fitness report
 * Generates comprehensive fitness report with progress changes
 * 
 * @param {string} memberId - Member ID
 * @returns {Promise<Object>} Fitness report with changes and metrics
 * @throws {Error} If request fails
 */
export const getMemberFitnessReport = async (memberId) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/report/${memberId}`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getMemberFitnessReport');
    throw handleAPIError(error, 'Fitness Report');
  }
};

/**
 * Get weekly analytics for member
 * 
 * @param {string} memberId - Member ID
 * @returns {Promise<Object>} Weekly analytics with charts
 * @throws {Error} If request fails
 */
export const getWeeklyAnalytics = async (memberId) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/analytics/weekly/${memberId}`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getWeeklyAnalytics');
    throw handleAPIError(error, 'Weekly Analytics');
  }
};

/**
 * Get monthly analytics for member
 * 
 * @param {string} memberId - Member ID
 * @returns {Promise<Object>} Monthly analytics with charts
 * @throws {Error} If request fails
 */
export const getMonthlyAnalytics = async (memberId) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/analytics/monthly/${memberId}`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getMonthlyAnalytics');
    throw handleAPIError(error, 'Monthly Analytics');
  }
};

/**
 * Upload progress photo
 * 
 * @param {string} progressId - Progress record ID
 * @param {Object} photoData - Photo data
 * @param {string} photoData.photoUrl - URL of the photo
 * @param {string} photoData.photoType - Type of photo (front, side, back)
 * @param {string} photoData.caption - Photo caption
 * @returns {Promise<Object>} Updated progress record
 * @throws {Error} If request fails
 */
export const uploadProgressPhoto = async (progressId, photoData) => {
  try {
    const response = await apiClient.post(`${API_BASE_URL}/${progressId}/photo`, photoData);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'uploadProgressPhoto');
    throw handleAPIError(error, 'Upload Photo');
  }
};

/**
 * Get progress statistics for dashboard
 * 
 * @param {Object} params - Query parameters
 * @param {string} params.memberId - Filter by member ID (optional)
 * @param {string} params.timeRange - Time range (week, month, all)
 * @returns {Promise<Object>} Progress statistics
 * @throws {Error} If request fails
 */
export const getProgressStats = async (params = {}) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/stats`, { params });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getProgressStats');
    throw handleAPIError(error, 'Progress Statistics');
  }
};

export default {
  recordProgress,
  getMemberProgress,
  getProgressById,
  updateProgress,
  deleteProgress,
  getMemberFitnessReport,
  getWeeklyAnalytics,
  getMonthlyAnalytics,
  uploadProgressPhoto,
  getProgressStats,
};
