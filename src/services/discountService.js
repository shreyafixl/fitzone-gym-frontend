import api from './api';

/**
 * Discount Service
 * Handles all discount-related API calls
 */

// Get all discounts with filtering and pagination
export const getAllDiscounts = async (params = {}) => {
  try {
    const response = await api.get('/admin/discounts', {
      params
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching discounts:', error);
    throw error;
  }
};

// Get discount by ID
export const getDiscountById = async (id) => {
  try {
    const response = await api.get(`/admin/discounts/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching discount:', error);
    throw error;
  }
};

// Create new discount
export const createDiscount = async (discountData) => {
  try {
    const response = await api.post('/admin/discounts', discountData);
    return response.data;
  } catch (error) {
    console.error('Error creating discount:', error);
    throw error;
  }
};

// Update discount
export const updateDiscount = async (id, discountData) => {
  try {
    const response = await api.put(`/admin/discounts/${id}`, discountData);
    return response.data;
  } catch (error) {
    console.error('Error updating discount:', error);
    throw error;
  }
};

// Delete discount
export const deleteDiscount = async (id) => {
  try {
    const response = await api.delete(`/admin/discounts/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting discount:', error);
    throw error;
  }
};

// Get discount statistics
export const getDiscountStats = async () => {
  try {
    const response = await api.get('/admin/discounts/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching discount stats:', error);
    throw error;
  }
};

export default {
  getAllDiscounts,
  getDiscountById,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  getDiscountStats
};
