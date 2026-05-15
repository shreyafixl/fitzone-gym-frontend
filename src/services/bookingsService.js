import api from './api';

/**
 * Bookings API Service
 * Handles all booking-related operations for admin dashboard
 */

export const bookingsService = {
  /**
   * Get all bookings with pagination and filtering
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Items per page (default: 10)
   * @param {object} filters - Filter object { status, memberId, classId, dateFrom, dateTo }
   * @returns {Promise} { data: [...], pagination: {...}, stats: {...} }
   */
  getAllBookings: async (page = 1, limit = 10, filters = {}) => {
    try {
      const params = {
        page,
        limit,
        ...filters,
      };
      const response = await api.get('/admin/bookings', { params });
      return response.data;
    } catch (error) {
      console.error('[Bookings] Error fetching bookings:', error);
      throw error;
    }
  },

  /**
   * Create new booking
   * @param {object} bookingData - { memberId, scheduleId, classId, bookingStatus }
   * @returns {Promise} { data: {...}, message: "..." }
   */
  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/admin/bookings', bookingData);
      return response.data;
    } catch (error) {
      console.error('[Bookings] Error creating booking:', error);
      throw error;
    }
  },

  /**
   * Cancel booking
   * @param {string} bookingId - Booking ID
   * @returns {Promise} { message: "..." }
   */
  cancelBooking: async (bookingId) => {
    try {
      const response = await api.delete(`/admin/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error('[Bookings] Error cancelling booking:', error);
      throw error;
    }
  },

  /**
   * Get bookings for a specific schedule
   * @param {string} scheduleId - Schedule ID
   * @returns {Promise} { data: [...] }
   */
  getScheduleBookings: async (scheduleId) => {
    try {
      const response = await api.get(`/admin/bookings/schedule/${scheduleId}`);
      return response.data;
    } catch (error) {
      console.error('[Bookings] Error fetching schedule bookings:', error);
      throw error;
    }
  },

  /**
   * Get bookings for a specific member
   * @param {string} memberId - Member ID
   * @returns {Promise} { data: [...] }
   */
  getMemberBookings: async (memberId) => {
    try {
      const response = await api.get(`/admin/bookings/member/${memberId}`);
      return response.data;
    } catch (error) {
      console.error('[Bookings] Error fetching member bookings:', error);
      throw error;
    }
  },

  /**
   * Get booking statistics
   * @returns {Promise} { totalBookings, activeBookings, cancelledBookings, occupancyRate }
   */
  getBookingStats: async () => {
    try {
      const response = await api.get('/admin/bookings/stats/all');
      return response.data;
    } catch (error) {
      console.error('[Bookings] Error fetching booking stats:', error);
      throw error;
    }
  },
};

export default bookingsService;
