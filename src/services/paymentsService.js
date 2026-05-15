import api from './api';

/**
 * Payments Service
 * Handles all payment-related API calls
 */

// Get all payments with filtering and pagination
export const getAllPayments = async (params = {}) => {
  try {
    const response = await api.get('/admin/memberships', {
      params: {
        paymentStatus: 'paid',
        ...params
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
};

// Get payment by ID
export const getPaymentById = async (id) => {
  try {
    const response = await api.get(`/admin/memberships/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payment:', error);
    throw error;
  }
};

// Create new payment
export const createPayment = async (paymentData) => {
  try {
    const response = await api.post('/admin/memberships', paymentData);
    return response.data;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
};

// Update payment status
export const updatePaymentStatus = async (id, status) => {
  try {
    const response = await api.put(`/admin/memberships/${id}`, {
      paymentStatus: status
    });
    return response.data;
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};

// Get payment statistics
export const getPaymentStats = async (params = {}) => {
  try {
    const response = await api.get('/admin/memberships/stats', {
      params
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching payment stats:', error);
    throw error;
  }
};

// Export payments data
export const exportPayments = async (format = 'csv') => {
  try {
    const response = await api.get('/admin/memberships/export', {
      params: { format },
      responseType: format === 'csv' ? 'blob' : 'json'
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting payments:', error);
    throw error;
  }
};

// Get payment methods summary
export const getPaymentMethodsSummary = async () => {
  try {
    const response = await api.get('/admin/memberships', {
      params: {
        paymentStatus: 'paid'
      }
    });
    
    const memberships = response.data.data.memberships || [];
    const summary = {};
    
    memberships.forEach(m => {
      const method = m.paymentMethod || 'unknown';
      summary[method] = (summary[method] || 0) + 1;
    });
    
    return summary;
  } catch (error) {
    console.error('Error fetching payment methods summary:', error);
    throw error;
  }
};

// Get daily payment trends
export const getDailyPaymentTrends = async (days = 30) => {
  try {
    const response = await api.get('/admin/memberships', {
      params: {
        paymentStatus: 'paid',
        limit: 1000
      }
    });
    
    const memberships = response.data.data.memberships || [];
    const trends = {};
    
    memberships.forEach(m => {
      const date = new Date(m.createdAt).toISOString().split('T')[0];
      if (!trends[date]) {
        trends[date] = { count: 0, amount: 0 };
      }
      trends[date].count += 1;
      trends[date].amount += m.finalAmount || 0;
    });
    
    return trends;
  } catch (error) {
    console.error('Error fetching daily payment trends:', error);
    throw error;
  }
};

export default {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePaymentStatus,
  getPaymentStats,
  exportPayments,
  getPaymentMethodsSummary,
  getDailyPaymentTrends
};
