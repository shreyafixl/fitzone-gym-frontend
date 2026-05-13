import api from './api';

/**
 * Admin API Service
 * All endpoints require admin authentication
 * Handles members, attendance, and check-ins management
 */

// ============================================================================
// MEMBERS API
// ============================================================================

export const adminMembersAPI = {
  /**
   * Fetch all members with pagination, filtering, and search
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Items per page (default: 10)
   * @param {object} filters - Filter object { status, plan, search }
   * @returns {Promise} { data: [...], pagination: {...} }
   */
  getAllMembers: async (page = 1, limit = 10, filters = {}) => {
    try {
      const params = {
        page,
        limit,
        ...filters,
      };
      const response = await api.get('/admin/members', { params });
      return response.data;
    } catch (error) {
      console.error('[Admin] Error fetching members:', error);
      throw error;
    }
  },

  /**
   * Fetch single member by ID
   * @param {string} memberId - Member ID
   * @returns {Promise} { data: {...} }
   */
  getMemberById: async (memberId) => {
    try {
      const response = await api.get(`/admin/members/${memberId}`);
      return response.data;
    } catch (error) {
      console.error('[Admin] Error fetching member:', error);
      throw error;
    }
  },

  /**
   * Create new member
   * @param {object} memberData - { name, email, phone, plan, status }
   * @returns {Promise} { data: {...}, message: "..." }
   */
  createMember: async (memberData) => {
    try {
      const response = await api.post('/admin/members', memberData);
      return response.data;
    } catch (error) {
      console.error('[Admin] Error creating member:', error);
      throw error;
    }
  },

  /**
   * Update member information
   * @param {string} memberId - Member ID
   * @param {object} memberData - { name, email, phone, plan, status }
   * @returns {Promise} { data: {...}, message: "..." }
   */
  updateMember: async (memberId, memberData) => {
    try {
      const response = await api.put(`/admin/members/${memberId}`, memberData);
      return response.data;
    } catch (error) {
      console.error('[Admin] Error updating member:', error);
      throw error;
    }
  },

  /**
   * Delete member
   * @param {string} memberId - Member ID
   * @returns {Promise} { message: "..." }
   */
  deleteMember: async (memberId) => {
    try {
      const response = await api.delete(`/admin/members/${memberId}`);
      return response.data;
    } catch (error) {
      console.error('[Admin] Error deleting member:', error);
      throw error;
    }
  },
};

// ============================================================================
// ATTENDANCE API
// ============================================================================

export const adminAttendanceAPI = {
  /**
   * Fetch attendance records with pagination and filtering
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Items per page (default: 10)
   * @param {object} filters - Filter object { memberId, dateFrom, dateTo }
   * @returns {Promise} { data: [...], pagination: {...}, stats: {...} }
   */
  getAttendance: async (page = 1, limit = 10, filters = {}) => {
    try {
      const params = {
        page,
        limit,
        ...filters,
      };
      const response = await api.get('/admin/attendance', { params });
      return response.data;
    } catch (error) {
      console.error('[Admin] Error fetching attendance:', error);
      throw error;
    }
  },

  /**
   * Get attendance statistics
   * @returns {Promise} { totalCheckins, avgDuration, peakHours }
   */
  getAttendanceStats: async () => {
    try {
      const response = await api.get('/admin/attendance/stats');
      return response.data;
    } catch (error) {
      console.error('[Admin] Error fetching attendance stats:', error);
      throw error;
    }
  },

  /**
   * Get attendance records by date range
   * @param {string} startDate - Start date (ISO format)
   * @param {string} endDate - End date (ISO format)
   * @returns {Promise} { data: [...] }
   */
  getAttendanceByDateRange: async (startDate, endDate) => {
    try {
      const params = { startDate, endDate };
      const response = await api.get('/admin/attendance/range', { params });
      return response.data;
    } catch (error) {
      console.error('[Admin] Error fetching attendance by date range:', error);
      throw error;
    }
  },
};

// ============================================================================
// CHECK-INS API
// ============================================================================

export const adminCheckinsAPI = {
  /**
   * Fetch check-in records with pagination and filtering
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Items per page (default: 10)
   * @param {object} filters - Filter object { status, memberId, dateFrom }
   * @returns {Promise} { data: [...], pagination: {...}, stats: {...} }
   */
  getCheckins: async (page = 1, limit = 10, filters = {}) => {
    try {
      const params = {
        page,
        limit,
        ...filters,
      };
      const response = await api.get('/admin/checkins', { params });
      return response.data;
    } catch (error) {
      console.error('[Admin] Error fetching check-ins:', error);
      throw error;
    }
  },

  /**
   * Get check-in statistics
   * @returns {Promise} { activeMembers, totalCheckinsToday, avgDuration }
   */
  getCheckinsStats: async () => {
    try {
      const response = await api.get('/admin/checkins/stats');
      return response.data;
    } catch (error) {
      console.error('[Admin] Error fetching check-in stats:', error);
      throw error;
    }
  },

  /**
   * Create check-in for a member
   * @param {string} memberId - Member ID
   * @returns {Promise} { data: {...}, message: "..." }
   */
  createCheckin: async (memberId) => {
    try {
      const response = await api.post('/admin/checkins', {
        memberId,
        checkInTime: new Date(),
      });
      return response.data;
    } catch (error) {
      console.error('[Admin] Error creating check-in:', error);
      throw error;
    }
  },

  /**
   * Record check-out for a member
   * @param {string} checkinId - Check-in ID
   * @returns {Promise} { data: {...}, message: "..." }
   */
  checkoutMember: async (checkinId) => {
    try {
      const response = await api.post(`/admin/checkins/${checkinId}/checkout`, {
        checkOutTime: new Date(),
      });
      return response.data;
    } catch (error) {
      console.error('[Admin] Error checking out member:', error);
      throw error;
    }
  },
};

// ============================================================================
// TRAINERS API
// ============================================================================

export const adminTrainersAPI = {
  /**
   * Fetch all trainers with pagination, filtering, and search
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Items per page (default: 10)
   * @param {object} filters - Filter object { branchId, trainerStatus, specialization, search }
   * @returns {Promise} { data: { trainers: [...], pagination: {...} } }
   */
  getAllTrainers: async (page = 1, limit = 10, filters = {}) => {
    try {
      const params = {
        page,
        limit,
        ...filters,
      };
      const response = await api.get('/admin/trainers', { params });
      return response.data;
    } catch (error) {
      console.error('[Admin] Error fetching trainers:', error);
      throw error;
    }
  },

  /**
   * Fetch single trainer by ID
   * @param {string} trainerId - Trainer ID
   * @returns {Promise} { data: {...} }
   */
  getTrainerById: async (trainerId) => {
    try {
      const response = await api.get(`/admin/trainers/${trainerId}`);
      return response.data;
    } catch (error) {
      console.error('[Admin] Error fetching trainer:', error);
      throw error;
    }
  },

  /**
   * Create new trainer
   * @param {object} trainerData - Trainer data
   * @returns {Promise} { data: {...}, message: "..." }
   */
  createTrainer: async (trainerData) => {
    try {
      const response = await api.post('/admin/trainers', trainerData);
      return response.data;
    } catch (error) {
      console.error('[Admin] Error creating trainer:', error);
      throw error;
    }
  },

  /**
   * Update trainer information
   * @param {string} trainerId - Trainer ID
   * @param {object} trainerData - Trainer data to update
   * @returns {Promise} { data: {...}, message: "..." }
   */
  updateTrainer: async (trainerId, trainerData) => {
    try {
      const response = await api.put(`/admin/trainers/${trainerId}`, trainerData);
      return response.data;
    } catch (error) {
      console.error('[Admin] Error updating trainer:', error);
      throw error;
    }
  },

  /**
   * Delete trainer
   * @param {string} trainerId - Trainer ID
   * @returns {Promise} { message: "..." }
   */
  deleteTrainer: async (trainerId) => {
    try {
      const response = await api.delete(`/admin/trainers/${trainerId}`);
      return response.data;
    } catch (error) {
      console.error('[Admin] Error deleting trainer:', error);
      throw error;
    }
  },

  /**
   * Get trainer statistics
   * @returns {Promise} { data: {...} }
   */
  getTrainerStats: async () => {
    try {
      const response = await api.get('/admin/trainers/stats');
      return response.data;
    } catch (error) {
      console.error('[Admin] Error fetching trainer stats:', error);
      throw error;
    }
  },

  /**
   * Assign members to trainer
   * @param {string} trainerId - Trainer ID
   * @param {array} memberIds - Array of member IDs
   * @returns {Promise} { data: {...}, message: "..." }
   */
  assignMembers: async (trainerId, memberIds) => {
    try {
      const response = await api.post(`/admin/trainers/${trainerId}/assign-members`, { memberIds });
      return response.data;
    } catch (error) {
      console.error('[Admin] Error assigning members:', error);
      throw error;
    }
  },

  /**
   * Update trainer availability
   * @param {string} trainerId - Trainer ID
   * @param {object} availability - Availability data
   * @returns {Promise} { data: {...}, message: "..." }
   */
  updateAvailability: async (trainerId, availability) => {
    try {
      const response = await api.put(`/admin/trainers/${trainerId}/availability`, availability);
      return response.data;
    } catch (error) {
      console.error('[Admin] Error updating availability:', error);
      throw error;
    }
  },
};

// ============================================================================
// PERMISSIONS API
// ============================================================================

export const adminPermissionsAPI = {
  /**
   * Fetch all staff permissions
   * @returns {Promise} { data: [...] }
   */
  getAllPermissions: async () => {
    try {
      const response = await api.get('/admin/permissions');
      return response.data;
    } catch (error) {
      console.error('[Admin] Error fetching permissions:', error);
      throw error;
    }
  },

  /**
   * Update staff permissions
   * @param {string} staffId - Staff/Trainer ID
   * @param {object} permissions - Permissions object
   * @returns {Promise} { data: {...}, message: "..." }
   */
  updatePermissions: async (staffId, permissions) => {
    try {
      const response = await api.put(`/admin/permissions/${staffId}`, { permissions });
      return response.data;
    } catch (error) {
      console.error('[Admin] Error updating permissions:', error);
      throw error;
    }
  },

  /**
   * Get staff member permissions
   * @param {string} staffId - Staff/Trainer ID
   * @returns {Promise} { data: {...} }
   */
  getStaffPermissions: async (staffId) => {
    try {
      const response = await api.get(`/admin/permissions/${staffId}`);
      return response.data;
    } catch (error) {
      console.error('[Admin] Error fetching staff permissions:', error);
      throw error;
    }
  },
};

export default {
  adminMembersAPI,
  adminAttendanceAPI,
  adminCheckinsAPI,
  adminTrainersAPI,
  adminPermissionsAPI,
};
