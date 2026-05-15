/**
 * Trainer Attendance API Service
 * Handles all API calls related to member attendance tracking and check-in/check-out
 * 
 * Requirements: Attendance tracking, check-in/check-out, attendance analytics
 */

import apiClient from '../utils/axiosConfig';
import { handleAPIError, logError } from '../utils/errorHandler';

const API_BASE_URL = '/trainer/attendance';

/**
 * Mark member attendance (check-in)
 * 
 * @param {string} memberId - Member ID
 * @param {string} branchId - Branch ID
 * @param {string} checkInTime - Check-in time (ISO format, optional)
 * @param {string} notes - Optional notes
 * @returns {Promise<Object>} Attendance record
 * @throws {Error} If request fails
 */
export const markAttendance = async (memberId, branchId, checkInTime = null, notes = null) => {
  try {
    const response = await apiClient.post(API_BASE_URL, {
      memberId,
      branchId,
      checkInTime,
      notes,
    });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'markAttendance');
    throw handleAPIError(error, 'Mark Attendance');
  }
};

/**
 * Check out member (update attendance)
 * 
 * @param {string} attendanceId - Attendance record ID
 * @param {string} checkOutTime - Check-out time (ISO format, optional)
 * @returns {Promise<Object>} Updated attendance record
 * @throws {Error} If request fails
 */
export const checkOut = async (attendanceId, checkOutTime = null) => {
  try {
    const response = await apiClient.put(`${API_BASE_URL}/${attendanceId}/checkout`, {
      checkOutTime,
    });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'checkOut');
    throw handleAPIError(error, 'Check Out');
  }
};

/**
 * Get attendance records with pagination and filters
 * 
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Items per page
 * @param {Object} filters - Filter object { memberId, branchId, status, date, startDate, endDate }
 * @returns {Promise<Object>} Paginated list of attendance records
 * @throws {Error} If request fails
 */
export const getAttendanceRecords = async (page = 1, limit = 20, filters = {}) => {
  try {
    const params = {
      page,
      limit,
      ...filters,
    };

    const response = await apiClient.get(API_BASE_URL, { params });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getAttendanceRecords');
    throw handleAPIError(error, 'Attendance Records');
  }
};

/**
 * Get attendance statistics
 * 
 * @param {string} startDate - Start date (ISO format, optional)
 * @param {string} endDate - End date (ISO format, optional)
 * @returns {Promise<Object>} Attendance statistics
 * @throws {Error} If request fails
 */
export const getAttendanceStats = async (startDate = null, endDate = null) => {
  try {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await apiClient.get(`${API_BASE_URL}/stats`, { params });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getAttendanceStats');
    throw handleAPIError(error, 'Attendance Statistics');
  }
};

/**
 * Get monthly attendance analytics
 * 
 * @param {number} year - Year (optional, defaults to current year)
 * @param {number} month - Month (1-12, optional, defaults to current month)
 * @returns {Promise<Object>} Monthly analytics data
 * @throws {Error} If request fails
 */
export const getMonthlyAnalytics = async (year = null, month = null) => {
  try {
    const params = {};
    if (year) params.year = year;
    if (month) params.month = month;

    const response = await apiClient.get(`${API_BASE_URL}/analytics/monthly`, { params });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getMonthlyAnalytics');
    throw handleAPIError(error, 'Monthly Analytics');
  }
};

/**
 * Get attendance report
 * 
 * @param {string} startDate - Start date (ISO format, optional)
 * @param {string} endDate - End date (ISO format, optional)
 * @returns {Promise<Object>} Attendance report
 * @throws {Error} If request fails
 */
export const getAttendanceReport = async (startDate = null, endDate = null) => {
  try {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await apiClient.get(`${API_BASE_URL}/report`, { params });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getAttendanceReport');
    throw handleAPIError(error, 'Attendance Report');
  }
};

/**
 * Get member attendance history
 * 
 * @param {string} memberId - Member ID
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Items per page
 * @param {string} startDate - Start date (ISO format, optional)
 * @param {string} endDate - End date (ISO format, optional)
 * @returns {Promise<Object>} Member attendance history
 * @throws {Error} If request fails
 */
export const getMemberAttendanceHistory = async (
  memberId,
  page = 1,
  limit = 30,
  startDate = null,
  endDate = null
) => {
  try {
    const params = {
      page,
      limit,
    };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await apiClient.get(`${API_BASE_URL}/member/${memberId}`, { params });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getMemberAttendanceHistory');
    throw handleAPIError(error, 'Member Attendance History');
  }
};

/**
 * Get today's attendance
 * 
 * @param {string} branchId - Branch ID (optional)
 * @returns {Promise<Object>} Today's attendance records
 * @throws {Error} If request fails
 */
export const getTodayAttendance = async (branchId = null) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const params = {
      date: today,
    };
    if (branchId) params.branchId = branchId;

    const response = await apiClient.get(API_BASE_URL, { params });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getTodayAttendance');
    throw handleAPIError(error, 'Today Attendance');
  }
};

/**
 * Get attendance summary for dashboard
 * 
 * @returns {Promise<Object>} Attendance summary
 * @throws {Error} If request fails
 */
export const getAttendanceSummary = async () => {
  try {
    // Get today's attendance and stats
    const [todayData, statsData] = await Promise.all([
      getTodayAttendance(),
      getAttendanceStats(),
    ]);

    return {
      today: todayData,
      stats: statsData,
    };
  } catch (error) {
    logError(error, 'getAttendanceSummary');
    throw handleAPIError(error, 'Attendance Summary');
  }
};

export const trainerAttendanceAPI = {
  markAttendance,
  checkOut,
  getAttendanceRecords,
  getAttendanceStats,
  getMonthlyAnalytics,
  getAttendanceReport,
  getMemberAttendanceHistory,
  getTodayAttendance,
  getAttendanceSummary,
};

export default trainerAttendanceAPI;
