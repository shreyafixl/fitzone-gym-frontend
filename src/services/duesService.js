import api from './api';

/**
 * Dues Service
 * Handles all pending dues and overdue payment-related API calls
 */

// Get all pending payments (unpaid memberships)
export const getAllPendingDues = async (params = {}) => {
  try {
    const response = await api.get('/admin/memberships', {
      params: {
        paymentStatus: 'pending',
        ...params
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching pending dues:', error);
    throw error;
  }
};

// Get overdue payments (pending payments past their due date)
export const getOverduePayments = async () => {
  try {
    const response = await api.get('/admin/memberships', {
      params: {
        paymentStatus: 'pending',
        limit: 1000
      }
    });
    
    const memberships = response.data.data.memberships || [];
    const now = new Date();
    
    return memberships.filter(m => {
      const endDate = new Date(m.membershipEndDate);
      return endDate < now;
    });
  } catch (error) {
    console.error('Error fetching overdue payments:', error);
    throw error;
  }
};

// Get critical overdue payments (overdue for 3+ days)
export const getCriticalOverduePayments = async () => {
  try {
    const overduePayments = await getOverduePayments();
    const now = new Date();
    
    return overduePayments.filter(m => {
      const endDate = new Date(m.membershipEndDate);
      const daysOverdue = Math.floor((now - endDate) / (1000 * 60 * 60 * 24));
      return daysOverdue >= 3;
    });
  } catch (error) {
    console.error('Error fetching critical overdue payments:', error);
    throw error;
  }
};

// Get pending due by ID
export const getPendingDueById = async (id) => {
  try {
    const response = await api.get(`/admin/memberships/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching pending due:', error);
    throw error;
  }
};

// Mark payment as paid
export const markPaymentAsPaid = async (membershipId, paymentData) => {
  try {
    const response = await api.put(`/admin/memberships/${membershipId}`, {
      paymentStatus: 'paid',
      ...paymentData
    });
    return response.data;
  } catch (error) {
    console.error('Error marking payment as paid:', error);
    throw error;
  }
};

// Send payment reminder
export const sendPaymentReminder = async (memberId) => {
  try {
    // This would typically call a notification/email service
    const response = await api.post(`/admin/members/${memberId}/send-payment-reminder`);
    return response.data;
  } catch (error) {
    console.error('Error sending payment reminder:', error);
    throw error;
  }
};

// Get dues statistics
export const getDuesStats = async () => {
  try {
    const response = await api.get('/admin/memberships/stats');
    const stats = response.data.data;
    
    // Calculate dues-specific stats
    const allMemberships = await getAllPendingDues({ limit: 1000 });
    const memberships = allMemberships.data.memberships || [];
    const now = new Date();
    
    let totalOverdue = 0;
    let criticalCount = 0;
    
    memberships.forEach(m => {
      const endDate = new Date(m.membershipEndDate);
      if (endDate < now) {
        totalOverdue += m.finalAmount || 0;
        const daysOverdue = Math.floor((now - endDate) / (1000 * 60 * 60 * 24));
        if (daysOverdue >= 3) {
          criticalCount += 1;
        }
      }
    });
    
    return {
      ...stats,
      totalPendingDues: memberships.length,
      totalOverdueAmount: totalOverdue,
      criticalOverdueCount: criticalCount
    };
  } catch (error) {
    console.error('Error fetching dues stats:', error);
    throw error;
  }
};

// Get days overdue for a membership
export const getDaysOverdue = (membershipEndDate) => {
  const now = new Date();
  const endDate = new Date(membershipEndDate);
  
  if (endDate >= now) {
    return 0;
  }
  
  return Math.floor((now - endDate) / (1000 * 60 * 60 * 24));
};

// Get overdue payment trends
export const getOverduePaymentTrends = async (days = 30) => {
  try {
    const response = await api.get('/admin/memberships', {
      params: {
        paymentStatus: 'pending',
        limit: 1000
      }
    });
    
    const memberships = response.data.data.memberships || [];
    const trends = {};
    const now = new Date();
    
    memberships.forEach(m => {
      const endDate = new Date(m.membershipEndDate);
      if (endDate < now) {
        const date = endDate.toISOString().split('T')[0];
        if (!trends[date]) {
          trends[date] = { count: 0, amount: 0 };
        }
        trends[date].count += 1;
        trends[date].amount += m.finalAmount || 0;
      }
    });
    
    return trends;
  } catch (error) {
    console.error('Error fetching overdue payment trends:', error);
    throw error;
  }
};

// Batch mark payments as paid
export const batchMarkPaymentsPaid = async (membershipIds, paymentData) => {
  try {
    const promises = membershipIds.map(id => 
      markPaymentAsPaid(id, paymentData)
    );
    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    console.error('Error batch marking payments as paid:', error);
    throw error;
  }
};

// Batch send payment reminders
export const batchSendPaymentReminders = async (memberIds) => {
  try {
    const promises = memberIds.map(id => 
      sendPaymentReminder(id)
    );
    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    console.error('Error batch sending payment reminders:', error);
    throw error;
  }
};

export default {
  getAllPendingDues,
  getOverduePayments,
  getCriticalOverduePayments,
  getPendingDueById,
  markPaymentAsPaid,
  sendPaymentReminder,
  getDuesStats,
  getDaysOverdue,
  getOverduePaymentTrends,
  batchMarkPaymentsPaid,
  batchSendPaymentReminders
};
