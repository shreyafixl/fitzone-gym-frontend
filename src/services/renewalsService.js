import api from './api';

/**
 * Renewals Service
 * Handles all membership renewal-related API calls
 */

// Get all memberships (for renewal tracking)
export const getAllMemberships = async (params = {}) => {
  try {
    const response = await api.get('/admin/memberships', {
      params
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching memberships:', error);
    throw error;
  }
};

// Get expiring memberships (within specified days)
export const getExpiringMemberships = async (days = 30) => {
  try {
    const response = await api.get('/admin/memberships', {
      params: {
        membershipStatus: 'active',
        limit: 1000
      }
    });
    
    const memberships = response.data.data.memberships || [];
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    
    return memberships.filter(m => {
      const endDate = new Date(m.membershipEndDate);
      return endDate >= now && endDate <= futureDate;
    });
  } catch (error) {
    console.error('Error fetching expiring memberships:', error);
    throw error;
  }
};

// Get memberships expiring in 7 days
export const getExpiringSoon = async () => {
  try {
    return await getExpiringMemberships(7);
  } catch (error) {
    console.error('Error fetching soon-to-expire memberships:', error);
    throw error;
  }
};

// Get memberships expiring in 30 days
export const getExpiringIn30Days = async () => {
  try {
    return await getExpiringMemberships(30);
  } catch (error) {
    console.error('Error fetching 30-day expiring memberships:', error);
    throw error;
  }
};

// Get already expired memberships
export const getExpiredMemberships = async () => {
  try {
    const response = await api.get('/admin/memberships', {
      params: {
        membershipStatus: 'expired',
        limit: 1000
      }
    });
    return response.data.data.memberships || [];
  } catch (error) {
    console.error('Error fetching expired memberships:', error);
    throw error;
  }
};

// Renew membership
export const renewMembership = async (membershipId, renewalData) => {
  try {
    const response = await api.post(`/admin/memberships/${membershipId}/renew`, renewalData);
    return response.data;
  } catch (error) {
    console.error('Error renewing membership:', error);
    throw error;
  }
};

// Get renewal statistics
export const getRenewalStats = async () => {
  try {
    const response = await api.get('/admin/memberships/stats');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching renewal stats:', error);
    throw error;
  }
};

// Get membership plans for renewal
export const getMembershipPlans = async () => {
  try {
    const response = await api.get('/admin/membership-plans');
    return response.data.data.plans || [];
  } catch (error) {
    console.error('Error fetching membership plans:', error);
    throw error;
  }
};

// Send renewal reminder
export const sendRenewalReminder = async (memberId) => {
  try {
    // This would typically call a notification/email service
    const response = await api.post(`/admin/members/${memberId}/send-renewal-reminder`);
    return response.data;
  } catch (error) {
    console.error('Error sending renewal reminder:', error);
    throw error;
  }
};

// Get renewal trends
export const getRenewalTrends = async (days = 30) => {
  try {
    const response = await api.get('/admin/memberships', {
      params: {
        limit: 1000
      }
    });
    
    const memberships = response.data.data.memberships || [];
    const trends = {};
    const now = new Date();
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    
    memberships.forEach(m => {
      const startDateObj = new Date(m.membershipStartDate);
      if (startDateObj >= startDate && startDateObj <= now) {
        const date = startDateObj.toISOString().split('T')[0];
        trends[date] = (trends[date] || 0) + 1;
      }
    });
    
    return trends;
  } catch (error) {
    console.error('Error fetching renewal trends:', error);
    throw error;
  }
};

export default {
  getAllMemberships,
  getExpiringMemberships,
  getExpiringSoon,
  getExpiringIn30Days,
  getExpiredMemberships,
  renewMembership,
  getRenewalStats,
  getMembershipPlans,
  sendRenewalReminder,
  getRenewalTrends
};
