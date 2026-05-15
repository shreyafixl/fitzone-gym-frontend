/**
 * Trainer Workout API Service
 * Handles all API calls related to workout plans, exercise tracking, and assignments
 * 
 * Features:
 * - Create/edit/delete workout plans
 * - Assign workouts to clients
 * - Track exercise progress
 * - Manage workout status (active, paused, completed)
 * - Get workout statistics and schedules
 */

import apiClient from '../utils/axiosConfig';
import { handleAPIError, logError } from '../utils/errorHandler';

const API_BASE_URL = '/trainer/workouts';

/**
 * Get all workout plans for trainer
 * Supports pagination, filtering, searching, and sorting
 * 
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10)
 * @param {string} params.search - Search by workout title
 * @param {string} params.status - Filter by status (active, completed, paused, cancelled)
 * @param {string} params.category - Filter by category
 * @param {string} params.difficulty - Filter by difficulty level
 * @param {string} params.memberId - Filter by member ID
 * @param {string} params.sortBy - Sort field (default: createdAt)
 * @param {string} params.sortOrder - Sort order (asc or desc)
 * @returns {Promise<Object>} Paginated workout plans
 * @throws {Error} If request fails
 */
export const getAllWorkouts = async (params = {}) => {
  try {
    const response = await apiClient.get(API_BASE_URL, { params });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getAllWorkouts');
    throw handleAPIError(error, 'Workout Plans');
  }
};

/**
 * Get workout plan by ID
 * 
 * @param {string} workoutId - Workout plan ID
 * @returns {Promise<Object>} Workout plan details
 * @throws {Error} If request fails
 */
export const getWorkoutById = async (workoutId) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/${workoutId}`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getWorkoutById');
    throw handleAPIError(error, 'Workout Plan');
  }
};

/**
 * Create new workout plan
 * 
 * @param {Object} workoutData - Workout plan data
 * @param {string} workoutData.memberId - Member ID to assign workout to
 * @param {string} workoutData.workoutTitle - Title of the workout
 * @param {string} workoutData.workoutCategory - Category (strength, cardio, etc.)
 * @param {Array} workoutData.exercises - Array of exercises
 * @param {number} workoutData.duration - Duration in minutes
 * @param {string} workoutData.difficultyLevel - Difficulty level
 * @param {Array} workoutData.targetMuscleGroups - Target muscle groups
 * @param {Array} workoutData.goals - Fitness goals
 * @param {string} workoutData.frequency - Frequency (e.g., "3 times per week")
 * @param {string} workoutData.startDate - Start date
 * @param {string} workoutData.endDate - End date (optional)
 * @param {string} workoutData.notes - Additional notes
 * @returns {Promise<Object>} Created workout plan
 * @throws {Error} If request fails
 */
export const createWorkout = async (workoutData) => {
  try {
    const response = await apiClient.post(API_BASE_URL, workoutData);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'createWorkout');
    throw handleAPIError(error, 'Create Workout Plan');
  }
};

/**
 * Update workout plan
 * 
 * @param {string} workoutId - Workout plan ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated workout plan
 * @throws {Error} If request fails
 */
export const updateWorkout = async (workoutId, updateData) => {
  try {
    const response = await apiClient.put(`${API_BASE_URL}/${workoutId}`, updateData);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'updateWorkout');
    throw handleAPIError(error, 'Update Workout Plan');
  }
};

/**
 * Delete workout plan
 * 
 * @param {string} workoutId - Workout plan ID
 * @returns {Promise<Object>} Deletion confirmation
 * @throws {Error} If request fails
 */
export const deleteWorkout = async (workoutId) => {
  try {
    const response = await apiClient.delete(`${API_BASE_URL}/${workoutId}`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'deleteWorkout');
    throw handleAPIError(error, 'Delete Workout Plan');
  }
};

/**
 * Assign workout plan to a member
 * 
 * @param {string} workoutId - Workout plan ID
 * @param {string} memberId - Member ID to assign to
 * @returns {Promise<Object>} Updated workout plan
 * @throws {Error} If request fails
 */
export const assignWorkout = async (workoutId, memberId) => {
  try {
    const response = await apiClient.post(`${API_BASE_URL}/${workoutId}/assign`, {
      memberId,
    });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'assignWorkout');
    throw handleAPIError(error, 'Assign Workout');
  }
};

/**
 * Update workout progress
 * 
 * @param {string} workoutId - Workout plan ID
 * @param {number} progress - Progress percentage (0-100)
 * @returns {Promise<Object>} Updated workout plan
 * @throws {Error} If request fails
 */
export const updateWorkoutProgress = async (workoutId, progress) => {
  try {
    const response = await apiClient.put(`${API_BASE_URL}/${workoutId}/progress`, {
      progress,
    });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'updateWorkoutProgress');
    throw handleAPIError(error, 'Update Progress');
  }
};

/**
 * Pause workout plan
 * 
 * @param {string} workoutId - Workout plan ID
 * @returns {Promise<Object>} Updated workout plan
 * @throws {Error} If request fails
 */
export const pauseWorkout = async (workoutId) => {
  try {
    const response = await apiClient.put(`${API_BASE_URL}/${workoutId}/pause`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'pauseWorkout');
    throw handleAPIError(error, 'Pause Workout');
  }
};

/**
 * Resume workout plan
 * 
 * @param {string} workoutId - Workout plan ID
 * @returns {Promise<Object>} Updated workout plan
 * @throws {Error} If request fails
 */
export const resumeWorkout = async (workoutId) => {
  try {
    const response = await apiClient.put(`${API_BASE_URL}/${workoutId}/resume`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'resumeWorkout');
    throw handleAPIError(error, 'Resume Workout');
  }
};

/**
 * Complete workout plan
 * 
 * @param {string} workoutId - Workout plan ID
 * @returns {Promise<Object>} Updated workout plan
 * @throws {Error} If request fails
 */
export const completeWorkout = async (workoutId) => {
  try {
    const response = await apiClient.put(`${API_BASE_URL}/${workoutId}/complete`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'completeWorkout');
    throw handleAPIError(error, 'Complete Workout');
  }
};

/**
 * Get workout statistics
 * 
 * @returns {Promise<Object>} Workout statistics
 * @throws {Error} If request fails
 */
export const getWorkoutStats = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/stats`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getWorkoutStats');
    throw handleAPIError(error, 'Workout Statistics');
  }
};

/**
 * Get weekly workout schedule
 * 
 * @returns {Promise<Object>} Weekly schedule organized by day
 * @throws {Error} If request fails
 */
export const getWeeklySchedule = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/schedule`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getWeeklySchedule');
    throw handleAPIError(error, 'Weekly Schedule');
  }
};

/**
 * Duplicate workout plan
 * Creates a copy of an existing workout plan
 * 
 * @param {string} workoutId - Workout plan ID to duplicate
 * @returns {Promise<Object>} New duplicated workout plan
 * @throws {Error} If request fails
 */
export const duplicateWorkout = async (workoutId) => {
  try {
    const response = await apiClient.post(`${API_BASE_URL}/${workoutId}/duplicate`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'duplicateWorkout');
    throw handleAPIError(error, 'Duplicate Workout');
  }
};

/**
 * Get workouts for a specific member
 * 
 * @param {string} memberId - Member ID
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Member's workout plans
 * @throws {Error} If request fails
 */
export const getMemberWorkouts = async (memberId, params = {}) => {
  try {
    const response = await apiClient.get(API_BASE_URL, {
      params: { ...params, memberId },
    });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getMemberWorkouts');
    throw handleAPIError(error, 'Member Workouts');
  }
};

/**
 * Search workouts
 * 
 * @param {string} searchTerm - Search term
 * @param {Object} params - Additional query parameters
 * @returns {Promise<Object>} Search results
 * @throws {Error} If request fails
 */
export const searchWorkouts = async (searchTerm, params = {}) => {
  try {
    const response = await apiClient.get(API_BASE_URL, {
      params: { ...params, search: searchTerm },
    });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'searchWorkouts');
    throw handleAPIError(error, 'Search Workouts');
  }
};

/**
 * Get active workouts
 * 
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Active workout plans
 * @throws {Error} If request fails
 */
export const getActiveWorkouts = async (params = {}) => {
  try {
    const response = await apiClient.get(API_BASE_URL, {
      params: { ...params, status: 'active' },
    });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getActiveWorkouts');
    throw handleAPIError(error, 'Active Workouts');
  }
};

/**
 * Get completed workouts
 * 
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Completed workout plans
 * @throws {Error} If request fails
 */
export const getCompletedWorkouts = async (params = {}) => {
  try {
    const response = await apiClient.get(API_BASE_URL, {
      params: { ...params, status: 'completed' },
    });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getCompletedWorkouts');
    throw handleAPIError(error, 'Completed Workouts');
  }
};

/**
 * Get workouts by category
 * 
 * @param {string} category - Workout category
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Workouts in category
 * @throws {Error} If request fails
 */
export const getWorkoutsByCategory = async (category, params = {}) => {
  try {
    const response = await apiClient.get(API_BASE_URL, {
      params: { ...params, category },
    });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getWorkoutsByCategory');
    throw handleAPIError(error, 'Workouts by Category');
  }
};

/**
 * Get workouts by difficulty
 * 
 * @param {string} difficulty - Difficulty level
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Workouts by difficulty
 * @throws {Error} If request fails
 */
export const getWorkoutsByDifficulty = async (difficulty, params = {}) => {
  try {
    const response = await apiClient.get(API_BASE_URL, {
      params: { ...params, difficulty },
    });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getWorkoutsByDifficulty');
    throw handleAPIError(error, 'Workouts by Difficulty');
  }
};

export const trainerWorkoutAPI = {
  getAllWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  assignWorkout,
  updateWorkoutProgress,
  pauseWorkout,
  resumeWorkout,
  completeWorkout,
  getWorkoutStats,
  getWeeklySchedule,
  duplicateWorkout,
  getMemberWorkouts,
  searchWorkouts,
  getActiveWorkouts,
  getCompletedWorkouts,
  getWorkoutsByCategory,
  getWorkoutsByDifficulty,
};

export default trainerWorkoutAPI;
