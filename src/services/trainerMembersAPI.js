/**
 * Trainer Members API Service
 * Handles all API calls related to trainer's assigned members/clients
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8
 */

import apiClient, { formatPaginationParams, formatFilterParams, formatSortParams } from '../utils/axiosConfig';
import { handleAPIError, logError } from '../utils/errorHandler';

const API_BASE_URL = '/trainer/members';

/**
 * Get assigned members with pagination, filtering, and sorting
 * 
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Items per page
 * @param {string} search - Search query
 * @param {Object} filters - Filter object { status, goal, gender }
 * @param {Object} sort - Sort object { sortBy, sortOrder }
 * @returns {Promise<Object>} Paginated list of assigned members
 * @throws {Error} If request fails
 */
export const getAssignedMembers = async (page = 1, limit = 10, search = '', filters = {}, sort = {}) => {
  try {
    const pagination = formatPaginationParams(page, limit);
    const cleanFilters = formatFilterParams(filters, ['status', 'goal', 'gender']);
    const cleanSort = formatSortParams(sort.sortBy, sort.sortOrder, ['name', 'joinDate', 'progress']);

    const params = {
      page: pagination.page,
      limit: pagination.limit,
      ...cleanFilters,
      ...cleanSort,
    };

    if (search) {
      params.search = search;
    }

    const response = await apiClient.get(API_BASE_URL, { params });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getAssignedMembers');
    throw handleAPIError(error, 'Assigned Members');
  }
};

/**
 * Get individual member details
 * 
 * @param {string} memberId - Member ID
 * @returns {Promise<Object>} Member details
 * @throws {Error} If request fails
 */
export const getMemberById = async (memberId) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/${memberId}`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getMemberById');
    throw handleAPIError(error, 'Member Details');
  }
};

/**
 * Get member fitness goals
 * 
 * @param {string} memberId - Member ID
 * @returns {Promise<Object>} Member fitness goals
 * @throws {Error} If request fails
 */
export const getMemberFitnessGoals = async (memberId) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/${memberId}/fitness-goals`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getMemberFitnessGoals');
    throw handleAPIError(error, 'Member Fitness Goals');
  }
};

/**
 * Get member membership details
 * 
 * @param {string} memberId - Member ID
 * @returns {Promise<Object>} Member membership details
 * @throws {Error} If request fails
 */
export const getMemberMembership = async (memberId) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/${memberId}/membership`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getMemberMembership');
    throw handleAPIError(error, 'Member Membership');
  }
};

/**
 * Get member attendance history with pagination
 * 
 * @param {string} memberId - Member ID
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Items per page
 * @param {string} startDate - Start date for filtering (ISO format)
 * @param {string} endDate - End date for filtering (ISO format)
 * @returns {Promise<Object>} Member attendance history with pagination
 * @throws {Error} If request fails
 */
export const getMemberAttendance = async (memberId, page = 1, limit = 10, startDate = '', endDate = '') => {
  try {
    const pagination = formatPaginationParams(page, limit);

    const params = {
      page: pagination.page,
      limit: pagination.limit,
    };

    if (startDate) {
      params.startDate = startDate;
    }
    if (endDate) {
      params.endDate = endDate;
    }

    const response = await apiClient.get(`${API_BASE_URL}/${memberId}/attendance`, { params });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getMemberAttendance');
    throw handleAPIError(error, 'Member Attendance');
  }
};

/**
 * Get member progress data
 * 
 * @param {string} memberId - Member ID
 * @returns {Promise<Object>} Member progress data
 * @throws {Error} If request fails
 */
export const getMemberProgress = async (memberId) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/${memberId}/progress`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getMemberProgress');
    throw handleAPIError(error, 'Member Progress');
  }
};

/**
 * Get member assigned workouts with pagination and filtering
 * 
 * @param {string} memberId - Member ID
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Items per page
 * @param {string} status - Filter by status (optional)
 * @returns {Promise<Object>} Member workouts with pagination
 * @throws {Error} If request fails
 */
export const getMemberWorkouts = async (memberId, page = 1, limit = 10, status = '') => {
  try {
    const pagination = formatPaginationParams(page, limit);

    const params = {
      page: pagination.page,
      limit: pagination.limit,
    };

    if (status) {
      params.status = status;
    }

    const response = await apiClient.get(`${API_BASE_URL}/${memberId}/workouts`, { params });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getMemberWorkouts');
    throw handleAPIError(error, 'Member Workouts');
  }
};

/**
 * Search members by query
 * 
 * @param {string} query - Search query
 * @param {Object} filters - Filter object
 * @returns {Promise<Object>} Search results
 * @throws {Error} If request fails
 */
export const searchMembers = async (query = '', filters = {}) => {
  try {
    const params = { q: query };

    if (Object.keys(filters).length > 0) {
      Object.assign(params, filters);
    }

    const response = await apiClient.get(`${API_BASE_URL}/search`, { params });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'searchMembers');
    throw handleAPIError(error, 'Search Members');
  }
};

/**
 * Get members statistics
 * 
 * @returns {Promise<Object>} Members statistics
 * @throws {Error} If request fails
 */
export const getMembersStats = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/stats`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getMembersStats');
    throw handleAPIError(error, 'Members Statistics');
  }
};

/**
 * Add progress note for member
 * 
 * @param {string} memberId - Member ID
 * @param {string} note - Progress note text
 * @returns {Promise<Object>} Created progress note
 * @throws {Error} If request fails
 */
export const addProgressNote = async (memberId, note) => {
  try {
    const response = await apiClient.post(`${API_BASE_URL}/${memberId}/notes`, { note });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'addProgressNote');
    throw handleAPIError(error, 'Add Progress Note');
  }
};

/**
 * Update member progress
 * 
 * @param {string} memberId - Member ID
 * @param {Object} progressData - Progress data to update
 * @returns {Promise<Object>} Updated progress data
 * @throws {Error} If request fails
 */
export const updateMemberProgress = async (memberId, progressData) => {
  try {
    const response = await apiClient.put(`${API_BASE_URL}/${memberId}/progress`, progressData);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'updateMemberProgress');
    throw handleAPIError(error, 'Update Member Progress');
  }
};

/**
 * Add member goal
 * 
 * @param {string} memberId - Member ID
 * @param {Object} goalData - Goal data
 * @returns {Promise<Object>} Created goal
 * @throws {Error} If request fails
 */
export const addMemberGoal = async (memberId, goalData) => {
  try {
    const response = await apiClient.post(`${API_BASE_URL}/${memberId}/goals`, goalData);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'addMemberGoal');
    throw handleAPIError(error, 'Add Member Goal');
  }
};

/**
 * Get member goals (legacy - use getMemberFitnessGoals)
 * 
 * @param {string} memberId - Member ID
 * @returns {Promise<Object>} Member goals
 * @throws {Error} If request fails
 */
export const getMemberGoals = async (memberId) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/${memberId}/goals`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getMemberGoals');
    throw handleAPIError(error, 'Member Goals');
  }
};

/**
 * Get all available members (not assigned to trainer)
 * 
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Items per page
 * @param {string} search - Search query
 * @returns {Promise<Object>} Available members list
 * @throws {Error} If request fails
 */
export const getAvailableMembers = async (page = 1, limit = 10, search = '') => {
  try {
    const pagination = formatPaginationParams(page, limit);
    const params = {
      page: pagination.page,
      limit: pagination.limit,
    };

    if (search) {
      params.search = search;
    }

    const response = await apiClient.get(`${API_BASE_URL}/available`, { params });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getAvailableMembers');
    throw handleAPIError(error, 'Available Members');
  }
};

/**
 * Assign a member to trainer
 * 
 * @param {string} memberId - Member ID to assign
 * @returns {Promise<Object>} Assignment result
 * @throws {Error} If request fails
 */
export const assignMemberToTrainer = async (memberId) => {
  try {
    const response = await apiClient.post(`${API_BASE_URL}/${memberId}/assign`, {});
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'assignMemberToTrainer');
    throw handleAPIError(error, 'Assign Member');
  }
};

export const trainerMembersAPI = {
  getAssignedMembers,
  getMemberById,
  getMemberFitnessGoals,
  getMemberMembership,
  getMemberAttendance,
  getMemberProgress,
  getMemberWorkouts,
  searchMembers,
  getMembersStats,
  addProgressNote,
  updateMemberProgress,
  addMemberGoal,
  getMemberGoals,
  getAvailableMembers,
  assignMemberToTrainer,
};

export default trainerMembersAPI;
