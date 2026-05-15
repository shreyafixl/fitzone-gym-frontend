/**
 * Trainer Schedule API Service
 * Handles all API calls related to trainer sessions, scheduling, and calendar
 * 
 * Requirements: Session scheduling, calendar events, trainer availability
 */

import apiClient from '../utils/axiosConfig';
import { handleAPIError, logError } from '../utils/errorHandler';

const API_BASE_URL = '/trainer/schedule';

/**
 * Create a new session
 * 
 * @param {Object} sessionData - Session data
 * @returns {Promise<Object>} Created session
 * @throws {Error} If request fails
 */
export const createSession = async (sessionData) => {
  try {
    const response = await apiClient.post(API_BASE_URL, sessionData);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'createSession');
    throw handleAPIError(error, 'Create Session');
  }
};

/**
 * Get all sessions for trainer with pagination and filters
 * 
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Items per page
 * @param {Object} filters - Filter object { sessionType, sessionStatus, branchId, startDate, endDate }
 * @returns {Promise<Object>} Paginated list of sessions
 * @throws {Error} If request fails
 */
export const getAllSessions = async (page = 1, limit = 20, filters = {}) => {
  try {
    const params = {
      page,
      limit,
      ...filters,
    };

    const response = await apiClient.get(API_BASE_URL, { params });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getAllSessions');
    throw handleAPIError(error, 'Sessions List');
  }
};

/**
 * Get session by ID
 * 
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} Session details
 * @throws {Error} If request fails
 */
export const getSessionById = async (sessionId) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/${sessionId}`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getSessionById');
    throw handleAPIError(error, 'Session Details');
  }
};

/**
 * Update session
 * 
 * @param {string} sessionId - Session ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated session
 * @throws {Error} If request fails
 */
export const updateSession = async (sessionId, updateData) => {
  try {
    const response = await apiClient.put(`${API_BASE_URL}/${sessionId}`, updateData);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'updateSession');
    throw handleAPIError(error, 'Update Session');
  }
};

/**
 * Delete session
 * 
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} Deletion response
 * @throws {Error} If request fails
 */
export const deleteSession = async (sessionId) => {
  try {
    const response = await apiClient.delete(`${API_BASE_URL}/${sessionId}`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'deleteSession');
    throw handleAPIError(error, 'Delete Session');
  }
};

/**
 * Book session for a member
 * 
 * @param {string} sessionId - Session ID
 * @param {string} memberId - Member ID
 * @param {string} notes - Optional booking notes
 * @returns {Promise<Object>} Updated session with booking
 * @throws {Error} If request fails
 */
export const bookSession = async (sessionId, memberId, notes = null) => {
  try {
    const response = await apiClient.post(`${API_BASE_URL}/${sessionId}/book`, {
      memberId,
      notes,
    });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'bookSession');
    throw handleAPIError(error, 'Book Session');
  }
};

/**
 * Cancel booking for a member
 * 
 * @param {string} sessionId - Session ID
 * @param {string} memberId - Member ID
 * @returns {Promise<Object>} Updated session
 * @throws {Error} If request fails
 */
export const cancelBooking = async (sessionId, memberId) => {
  try {
    const response = await apiClient.delete(`${API_BASE_URL}/${sessionId}/booking/${memberId}`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'cancelBooking');
    throw handleAPIError(error, 'Cancel Booking');
  }
};

/**
 * Cancel session
 * 
 * @param {string} sessionId - Session ID
 * @param {string} reason - Cancellation reason
 * @returns {Promise<Object>} Cancelled session
 * @throws {Error} If request fails
 */
export const cancelSession = async (sessionId, reason = '') => {
  try {
    const response = await apiClient.put(`${API_BASE_URL}/${sessionId}/cancel`, {
      reason,
    });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'cancelSession');
    throw handleAPIError(error, 'Cancel Session');
  }
};

/**
 * Mark attendance for a member in a session
 * 
 * @param {string} sessionId - Session ID
 * @param {string} memberId - Member ID
 * @param {boolean} attended - Whether member attended
 * @returns {Promise<Object>} Updated session
 * @throws {Error} If request fails
 */
export const markAttendance = async (sessionId, memberId, attended = true) => {
  try {
    const response = await apiClient.put(
      `${API_BASE_URL}/${sessionId}/attendance/${memberId}`,
      { attended }
    );
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'markAttendance');
    throw handleAPIError(error, 'Mark Attendance');
  }
};

/**
 * Get trainer availability
 * 
 * @param {string} startDate - Start date (ISO format)
 * @param {string} endDate - End date (ISO format)
 * @returns {Promise<Object>} Trainer availability data
 * @throws {Error} If request fails
 */
export const getAvailability = async (startDate = null, endDate = null) => {
  try {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await apiClient.get(`${API_BASE_URL}/availability`, { params });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getAvailability');
    throw handleAPIError(error, 'Trainer Availability');
  }
};

/**
 * Get upcoming sessions
 * 
 * @param {number} limit - Number of sessions to retrieve
 * @returns {Promise<Object>} List of upcoming sessions
 * @throws {Error} If request fails
 */
export const getUpcomingSessions = async (limit = 10) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/upcoming`, {
      params: { limit },
    });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getUpcomingSessions');
    throw handleAPIError(error, 'Upcoming Sessions');
  }
};

/**
 * Get sessions for calendar view
 * 
 * @param {string} startDate - Start date (ISO format)
 * @param {string} endDate - End date (ISO format)
 * @returns {Promise<Object>} Sessions for calendar
 * @throws {Error} If request fails
 */
export const getCalendarSessions = async (startDate, endDate) => {
  try {
    const response = await apiClient.get(API_BASE_URL, {
      params: {
        startDate,
        endDate,
        limit: 100,
      },
    });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getCalendarSessions');
    throw handleAPIError(error, 'Calendar Sessions');
  }
};

export const trainerScheduleAPI = {
  createSession,
  getAllSessions,
  getSessionById,
  updateSession,
  deleteSession,
  bookSession,
  cancelBooking,
  cancelSession,
  markAttendance,
  getAvailability,
  getUpcomingSessions,
  getCalendarSessions,
};

export default trainerScheduleAPI;
