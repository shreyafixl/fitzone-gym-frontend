import api from './api';

/**
 * Coupon Service
 * Handles all coupon-related API calls
 */

// Get all coupons with filtering and pagination
export const getAllCoupons = async (params = {}) => {
  try {
    const response = await api.get('/admin/coupons', {
      params
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching coupons:', error);
    throw error;
  }
};

// Get coupon by ID
export const getCouponById = async (id) => {
  try {
    const response = await api.get(`/admin/coupons/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching coupon:', error);
    throw error;
  }
};

// Create new coupon
export const createCoupon = async (couponData) => {
  try {
    const response = await api.post('/admin/coupons', couponData);
    return response.data;
  } catch (error) {
    console.error('Error creating coupon:', error);
    throw error;
  }
};

// Update coupon
export const updateCoupon = async (id, couponData) => {
  try {
    const response = await api.put(`/admin/coupons/${id}`, couponData);
    return response.data;
  } catch (error) {
    console.error('Error updating coupon:', error);
    throw error;
  }
};

// Delete coupon
export const deleteCoupon = async (id) => {
  try {
    const response = await api.delete(`/admin/coupons/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting coupon:', error);
    throw error;
  }
};

// Get coupon statistics
export const getCouponStats = async () => {
  try {
    const response = await api.get('/admin/coupons/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching coupon stats:', error);
    throw error;
  }
};

export default {
  getAllCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getCouponStats
};
