import api from './api';

/**
 * SuperAdmin API Service
 * All endpoints require superadmin authentication
 */

// ============================================================================
// USER MANAGEMENT
// ============================================================================

export const superAdminUserAPI = {
  // Get all users
  getAllUsers: async (filters = {}) => {
    try {
      const response = await api.get('/superadmin/users', { params: filters });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching users:', error);
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/superadmin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching user:', error);
      throw error;
    }
  },

  // Create new user
  createUser: async (userData) => {
    try {
      const response = await api.post('/superadmin/users', userData);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error creating user:', error);
      throw error;
    }
  },

  // Update user
  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/superadmin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error updating user:', error);
      throw error;
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/superadmin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error deleting user:', error);
      throw error;
    }
  },

  // Get user statistics
  getUserStats: async () => {
    try {
      const response = await api.get('/superadmin/users/stats');
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching user stats:', error);
      throw error;
    }
  },
};

// ============================================================================
// BRANCH MANAGEMENT
// ============================================================================

export const superAdminBranchAPI = {
  // Get all branches
  getAllBranches: async (filters = {}) => {
    try {
      const response = await api.get('/superadmin/branches', { params: filters });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching branches:', error);
      throw error;
    }
  },

  // Get branch by ID
  getBranchById: async (branchId) => {
    try {
      const response = await api.get(`/superadmin/branches/${branchId}`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching branch:', error);
      throw error;
    }
  },

  // Create new branch
  createBranch: async (branchData) => {
    try {
      const response = await api.post('/superadmin/branches', branchData);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error creating branch:', error);
      throw error;
    }
  },

  // Update branch
  updateBranch: async (branchId, branchData) => {
    try {
      const response = await api.put(`/superadmin/branches/${branchId}`, branchData);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error updating branch:', error);
      throw error;
    }
  },

  // Delete branch
  deleteBranch: async (branchId) => {
    try {
      const response = await api.delete(`/superadmin/branches/${branchId}`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error deleting branch:', error);
      throw error;
    }
  },
};

// ============================================================================
// FINANCIAL MANAGEMENT
// ============================================================================

export const superAdminFinancialAPI = {
  // Get financial statistics
  getFinancialStats: async () => {
    try {
      const response = await api.get('/superadmin/financial/stats');
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching financial stats:', error);
      throw error;
    }
  },

  // Get all membership plans
  getAllPlans: async (filters = {}) => {
    try {
      const response = await api.get('/superadmin/financial/plans', { params: filters });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching plans:', error);
      throw error;
    }
  },

  // Get plan by ID
  getPlanById: async (planId) => {
    try {
      const response = await api.get(`/superadmin/financial/plans/${planId}`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching plan:', error);
      throw error;
    }
  },

  // Create new plan
  createPlan: async (planData) => {
    try {
      const response = await api.post('/superadmin/financial/plans', planData);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error creating plan:', error);
      throw error;
    }
  },

  // Update plan
  updatePlan: async (planId, planData) => {
    try {
      const response = await api.put(`/superadmin/financial/plans/${planId}`, planData);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error updating plan:', error);
      throw error;
    }
  },

  // Delete plan
  deletePlan: async (planId) => {
    try {
      const response = await api.delete(`/superadmin/financial/plans/${planId}`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error deleting plan:', error);
      throw error;
    }
  },

  // Get all subscriptions
  getAllSubscriptions: async (filters = {}) => {
    try {
      const response = await api.get('/superadmin/financial/subscriptions', { params: filters });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching subscriptions:', error);
      throw error;
    }
  },

  // Get subscription by ID
  getSubscriptionById: async (subscriptionId) => {
    try {
      const response = await api.get(`/superadmin/financial/subscriptions/${subscriptionId}`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching subscription:', error);
      throw error;
    }
  },

  // Create new subscription
  createSubscription: async (subscriptionData) => {
    try {
      const response = await api.post('/superadmin/financial/subscriptions', subscriptionData);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error creating subscription:', error);
      throw error;
    }
  },

  // Cancel subscription
  cancelSubscription: async (subscriptionId) => {
    try {
      const response = await api.patch(`/superadmin/financial/subscriptions/${subscriptionId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error canceling subscription:', error);
      throw error;
    }
  },

  // Get all transactions
  getAllTransactions: async (filters = {}) => {
    try {
      const response = await api.get('/superadmin/financial/transactions', { params: filters });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching transactions:', error);
      throw error;
    }
  },

  // Get transaction by ID
  getTransactionById: async (transactionId) => {
    try {
      const response = await api.get(`/superadmin/financial/transactions/${transactionId}`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching transaction:', error);
      throw error;
    }
  },

  // Create new transaction
  createTransaction: async (transactionData) => {
    try {
      const response = await api.post('/superadmin/financial/transactions', transactionData);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error creating transaction:', error);
      throw error;
    }
  },
};

// ============================================================================
// ANALYTICS
// ============================================================================

export const superAdminAnalyticsAPI = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      const response = await api.get('/superadmin/analytics/dashboard');
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Get user growth analytics
  getUserGrowthAnalytics: async (filters = {}) => {
    try {
      const response = await api.get('/superadmin/analytics/user-growth', { params: filters });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching user growth analytics:', error);
      throw error;
    }
  },

  // Get attendance statistics
  getAttendanceStatistics: async (filters = {}) => {
    try {
      const response = await api.get('/superadmin/analytics/attendance', { params: filters });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching attendance statistics:', error);
      throw error;
    }
  },

  // Get branch analytics
  getBranchAnalytics: async (filters = {}) => {
    try {
      const response = await api.get('/superadmin/analytics/branches', { params: filters });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching branch analytics:', error);
      throw error;
    }
  },

  // Get trainer performance analytics
  getTrainerPerformanceAnalytics: async (filters = {}) => {
    try {
      const response = await api.get('/superadmin/analytics/trainers', { params: filters });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching trainer analytics:', error);
      throw error;
    }
  },

  // Get financial report
  getFinancialReport: async (filters = {}) => {
    try {
      const response = await api.get('/superadmin/analytics/reports/financial', { params: filters });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching financial report:', error);
      throw error;
    }
  },

  // Get attendance report
  getAttendanceReport: async (filters = {}) => {
    try {
      const response = await api.get('/superadmin/analytics/reports/attendance', { params: filters });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching attendance report:', error);
      throw error;
    }
  },

  // Get membership report
  getMembershipReport: async (filters = {}) => {
    try {
      const response = await api.get('/superadmin/analytics/reports/membership', { params: filters });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching membership report:', error);
      throw error;
    }
  },

  // Get trainer report
  getTrainerReport: async (filters = {}) => {
    try {
      const response = await api.get('/superadmin/analytics/reports/trainers', { params: filters });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching trainer report:', error);
      throw error;
    }
  },

  // Get branch performance report
  getBranchPerformanceReport: async (filters = {}) => {
    try {
      const response = await api.get('/superadmin/analytics/reports/branches', { params: filters });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching branch performance report:', error);
      throw error;
    }
  },
};

// ============================================================================
// ENGAGEMENT & COMMUNICATION
// ============================================================================

export const superAdminEngagementAPI = {
  // ─── NOTIFICATIONS ───────────────────────────────────────────────────────
  
  // Get all notifications
  getNotifications: async (filters = {}) => {
    try {
      const response = await api.get('/superadmin/communication/notifications', { params: filters });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching notifications:', error);
      throw error;
    }
  },

  // Mark notification as read
  markNotificationRead: async (notificationId) => {
    try {
      const response = await api.patch(`/superadmin/communication/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark notification as unread
  markNotificationUnread: async (notificationId) => {
    try {
      const response = await api.patch(`/superadmin/communication/notifications/${notificationId}/unread`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error marking notification as unread:', error);
      throw error;
    }
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    try {
      const response = await api.delete(`/superadmin/communication/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error deleting notification:', error);
      throw error;
    }
  },

  // Mark all notifications as read
  markAllNotificationsRead: async () => {
    try {
      const response = await api.patch('/superadmin/communication/notifications/mark-all-read');
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error marking all notifications as read:', error);
      throw error;
    }
  },

  // ─── CAMPAIGNS (Using Announcements) ──────────────────────────────────────

  // Get all campaigns (announcements)
  getCampaigns: async (filters = {}) => {
    try {
      const response = await api.get('/superadmin/communication/announcements', { params: filters });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching campaigns:', error);
      throw error;
    }
  },

  // Get campaign by ID
  getCampaignById: async (campaignId) => {
    try {
      const response = await api.get(`/superadmin/communication/announcements/${campaignId}`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching campaign:', error);
      throw error;
    }
  },

  // Create new campaign
  createCampaign: async (campaignData) => {
    try {
      const response = await api.post('/superadmin/communication/announcements', {
        title: campaignData.name,
        description: campaignData.message,
        targetAudience: campaignData.targetAudience,
        priority: 'high',
        status: 'draft',
      });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error creating campaign:', error);
      throw error;
    }
  },

  // Update campaign
  updateCampaign: async (campaignId, campaignData) => {
    try {
      const response = await api.put(`/superadmin/communication/announcements/${campaignId}`, {
        title: campaignData.name,
        description: campaignData.message,
        targetAudience: campaignData.targetAudience,
        priority: 'high',
      });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error updating campaign:', error);
      throw error;
    }
  },

  // Delete campaign
  deleteCampaign: async (campaignId) => {
    try {
      const response = await api.delete(`/superadmin/communication/announcements/${campaignId}`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error deleting campaign:', error);
      throw error;
    }
  },

  // Launch campaign (publish announcement)
  launchCampaign: async (campaignId) => {
    try {
      const response = await api.patch(`/superadmin/communication/announcements/${campaignId}/publish`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error launching campaign:', error);
      throw error;
    }
  },

  // ─── MESSAGES & ANNOUNCEMENTS ────────────────────────────────────────────

  // Get all messages
  getMessages: async (filters = {}) => {
    try {
      const response = await api.get('/superadmin/communication/messages', { params: filters });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching messages:', error);
      throw error;
    }
  },

  // Send message
  sendMessage: async (messageData) => {
    try {
      const response = await api.post('/superadmin/communication/messages', {
        receiverId: messageData.to,
        subject: messageData.subject,
        message: messageData.message,
        messageType: messageData.type,
      });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error sending message:', error);
      throw error;
    }
  },

  // Get all announcements
  getAnnouncements: async (filters = {}) => {
    try {
      const response = await api.get('/superadmin/communication/announcements', { params: filters });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching announcements:', error);
      throw error;
    }
  },

  // Create announcement
  createAnnouncement: async (announcementData) => {
    try {
      const response = await api.post('/superadmin/communication/announcements', {
        title: announcementData.title,
        description: announcementData.message,
        targetAudience: announcementData.targetAudience,
        status: announcementData.status || 'draft',
      });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error creating announcement:', error);
      throw error;
    }
  },

  // Update announcement
  updateAnnouncement: async (announcementId, announcementData) => {
    try {
      const response = await api.put(`/superadmin/communication/announcements/${announcementId}`, {
        title: announcementData.title,
        description: announcementData.message,
        targetAudience: announcementData.targetAudience,
      });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error updating announcement:', error);
      throw error;
    }
  },

  // Delete announcement
  deleteAnnouncement: async (announcementId) => {
    try {
      const response = await api.delete(`/superadmin/communication/announcements/${announcementId}`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error deleting announcement:', error);
      throw error;
    }
  },
};

// ============================================================================
// OPERATIONS & MAINTENANCE
// ============================================================================

export const superAdminOperationsAPI = {
  // ─── EQUIPMENT ───────────────────────────────────────────────────────────

  // Get all equipment
  getEquipment: async (filters = {}) => {
    try {
      const response = await api.get('/superadmin/equipment', { params: filters });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching equipment:', error);
      throw error;
    }
  },

  // Get equipment by ID
  getEquipmentById: async (equipmentId) => {
    try {
      const response = await api.get(`/superadmin/equipment/${equipmentId}`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching equipment:', error);
      throw error;
    }
  },

  // Create equipment
  createEquipment: async (equipmentData) => {
    try {
      const response = await api.post('/superadmin/equipment', equipmentData);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error creating equipment:', error);
      throw error;
    }
  },

  // Update equipment
  updateEquipment: async (equipmentId, equipmentData) => {
    try {
      const response = await api.put(`/superadmin/equipment/${equipmentId}`, equipmentData);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error updating equipment:', error);
      throw error;
    }
  },

  // Delete equipment
  deleteEquipment: async (equipmentId) => {
    try {
      const response = await api.delete(`/superadmin/equipment/${equipmentId}`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error deleting equipment:', error);
      throw error;
    }
  },

  // ─── VENDORS ─────────────────────────────────────────────────────────────

  // Get all vendors
  getVendors: async (filters = {}) => {
    try {
      const response = await api.get('/superadmin/vendors', { params: filters });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching vendors:', error);
      throw error;
    }
  },

  // Get vendor by ID
  getVendorById: async (vendorId) => {
    try {
      const response = await api.get(`/superadmin/vendors/${vendorId}`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching vendor:', error);
      throw error;
    }
  },

  // Create vendor
  createVendor: async (vendorData) => {
    try {
      const response = await api.post('/superadmin/vendors', vendorData);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error creating vendor:', error);
      throw error;
    }
  },

  // Update vendor
  updateVendor: async (vendorId, vendorData) => {
    try {
      const response = await api.put(`/superadmin/vendors/${vendorId}`, vendorData);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error updating vendor:', error);
      throw error;
    }
  },

  // Delete vendor
  deleteVendor: async (vendorId) => {
    try {
      const response = await api.delete(`/superadmin/vendors/${vendorId}`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error deleting vendor:', error);
      throw error;
    }
  },

  // ─── MAINTENANCE ─────────────────────────────────────────────────────────

  // Get all maintenance logs
  getMaintenance: async (filters = {}) => {
    try {
      const response = await api.get('/superadmin/equipment/maintenance/list', { params: filters });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching maintenance logs:', error);
      throw error;
    }
  },

  // Get maintenance by ID
  getMaintenanceById: async (maintenanceId) => {
    try {
      const response = await api.get(`/superadmin/equipment/maintenance/${maintenanceId}`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching maintenance log:', error);
      throw error;
    }
  },

  // Create maintenance log (schedule maintenance for equipment)
  createMaintenance: async (equipmentId, maintenanceData) => {
    try {
      const response = await api.post(`/superadmin/equipment/${equipmentId}/maintenance`, maintenanceData);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error creating maintenance log:', error);
      throw error;
    }
  },

  // Update maintenance log
  updateMaintenance: async (maintenanceId, maintenanceData) => {
    try {
      const response = await api.put(`/superadmin/equipment/maintenance/${maintenanceId}`, maintenanceData);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error updating maintenance log:', error);
      throw error;
    }
  },

  // Delete maintenance log
  deleteMaintenance: async (maintenanceId) => {
    try {
      const response = await api.delete(`/superadmin/equipment/maintenance/${maintenanceId}`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error deleting maintenance log:', error);
      throw error;
    }
  },
};

// ============================================================================
// INTEGRATIONS
// ============================================================================

export const superAdminIntegrationsAPI = {
  // ─── INTEGRATIONS ───────────────────────────────────────────────────────

  // Get all integrations
  getIntegrations: async (filters = {}) => {
    try {
      const response = await api.get('/superadmin/integrations', { params: filters });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching integrations:', error);
      throw error;
    }
  },

  // Get integration by ID
  getIntegrationById: async (integrationId) => {
    try {
      const response = await api.get(`/superadmin/integrations/${integrationId}`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching integration:', error);
      throw error;
    }
  },

  // Create integration
  createIntegration: async (integrationData) => {
    try {
      const response = await api.post('/superadmin/integrations', integrationData);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error creating integration:', error);
      throw error;
    }
  },

  // Update integration
  updateIntegration: async (integrationId, integrationData) => {
    try {
      const response = await api.put(`/superadmin/integrations/${integrationId}`, integrationData);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error updating integration:', error);
      throw error;
    }
  },

  // Toggle integration
  toggleIntegration: async (integrationId) => {
    try {
      const response = await api.patch(`/superadmin/integrations/${integrationId}/toggle`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error toggling integration:', error);
      throw error;
    }
  },

  // Test integration connection
  testIntegrationConnection: async (integrationId) => {
    try {
      const response = await api.post(`/superadmin/integrations/${integrationId}/test`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error testing integration:', error);
      throw error;
    }
  },

  // Update integration settings
  updateIntegrationSettings: async (integrationId, settings) => {
    try {
      const response = await api.patch(`/superadmin/integrations/${integrationId}/settings`, {
        settings,
      });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error updating integration settings:', error);
      throw error;
    }
  },

  // Delete integration
  deleteIntegration: async (integrationId) => {
    try {
      const response = await api.delete(`/superadmin/integrations/${integrationId}`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error deleting integration:', error);
      throw error;
    }
  },

  // Get integration settings
  getIntegrationSettings: async () => {
    try {
      const response = await api.get('/superadmin/integrations/settings');
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching integration settings:', error);
      throw error;
    }
  },

  // Get available apps
  getAvailableApps: async () => {
    try {
      const response = await api.get('/superadmin/integrations/apps');
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching available apps:', error);
      throw error;
    }
  },

  // Install app
  installApp: async (integrationId) => {
    try {
      const response = await api.post(`/superadmin/integrations/${integrationId}/install`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error installing app:', error);
      throw error;
    }
  },

  // Uninstall app
  uninstallApp: async (integrationId) => {
    try {
      const response = await api.delete(`/superadmin/integrations/${integrationId}/uninstall`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error uninstalling app:', error);
      throw error;
    }
  },
};

// ============================================================================
// DATA MANAGEMENT
// ============================================================================

export const superAdminDataManagementAPI = {
  // ─── IMPORT DATA ─────────────────────────────────────────────────────────

  // Import data from file
  importData: async (file, importType, onProgress) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('collection', importType);
      formData.append('format', 'csv');

      const response = await api.post('/api/superadmin/data-management/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percentCompleted);
          }
        },
      });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error importing data:', error);
      throw error;
    }
  },

  // Get import history
  getImportHistory: async (filters = {}) => {
    try {
      const response = await api.get('/api/superadmin/data-management/import-history', { params: filters });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching import history:', error);
      throw error;
    }
  },

  // ─── EXPORT DATA ─────────────────────────────────────────────────────────

  // Export data
  exportData: async (exportType, format = 'csv', filters = {}) => {
    try {
      const response = await api.post('/api/superadmin/data-management/export', {
        collection: exportType,
        format,
        filters
      }, {
        responseType: 'blob',
      });
      return response;
    } catch (error) {
      console.error('[SuperAdmin] Error exporting data:', error);
      throw error;
    }
  },

  // Get export options
  getExportOptions: async () => {
    try {
      const response = await api.get('/api/superadmin/data-management/export-options');
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching export options:', error);
      throw error;
    }
  },

  // Get export history
  getExportHistory: async (filters = {}) => {
    try {
      const response = await api.get('/api/superadmin/data-management/export-history', { params: filters });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching export history:', error);
      throw error;
    }
  },

  // ─── BACKUPS ─────────────────────────────────────────────────────────────

  // Get all backups
  getBackups: async (filters = {}) => {
    try {
      const response = await api.get('/api/superadmin/data-management/backups', { params: filters });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching backups:', error);
      throw error;
    }
  },

  // Create backup
  createBackup: async (backupData = {}) => {
    try {
      const response = await api.post('/api/superadmin/data-management/backups', backupData);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error creating backup:', error);
      throw error;
    }
  },

  // Restore backup
  restoreBackup: async (backupId) => {
    try {
      const response = await api.post(`/api/superadmin/data-management/backups/${backupId}/restore`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error restoring backup:', error);
      throw error;
    }
  },

  // Delete backup
  deleteBackup: async (backupId) => {
    try {
      const response = await api.delete(`/api/superadmin/data-management/backups/${backupId}`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error deleting backup:', error);
      throw error;
    }
  },

  // Download backup
  downloadBackup: async (backupId) => {
    try {
      const response = await api.get(`/api/superadmin/data-management/backups/${backupId}/download`, {
        responseType: 'blob',
      });
      return response;
    } catch (error) {
      console.error('[SuperAdmin] Error downloading backup:', error);
      throw error;
    }
  },

  // Get backup schedule
  getBackupSchedule: async () => {
    try {
      const response = await api.get('/api/superadmin/data-management/backup-schedule');
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching backup schedule:', error);
      throw error;
    }
  },

  // Update backup schedule
  updateBackupSchedule: async (scheduleData) => {
    try {
      const response = await api.put('/api/superadmin/data-management/backup-schedule', scheduleData);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error updating backup schedule:', error);
      throw error;
    }
  },
};

// ============================================================================
// ADVANCED MODULE
// ============================================================================

export const superAdminAdvancedAPI = {
  // ─── FEATURE FLAGS ─────────────────────────────────────────────────────────

  // Get all feature flags
  getAllFeatureFlags: async (filters = {}) => {
    try {
      const response = await api.get('/superadmin/advanced/feature-flags', { params: filters });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching feature flags:', error);
      throw error;
    }
  },

  // Get feature flag by ID
  getFeatureFlagById: async (flagId) => {
    try {
      const response = await api.get(`/superadmin/advanced/feature-flags/${flagId}`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching feature flag:', error);
      throw error;
    }
  },

  // Create new feature flag
  createFeatureFlag: async (flagData) => {
    try {
      const response = await api.post('/superadmin/advanced/feature-flags', flagData);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error creating feature flag:', error);
      throw error;
    }
  },

  // Update feature flag
  updateFeatureFlag: async (flagId, flagData) => {
    try {
      const response = await api.put(`/superadmin/advanced/feature-flags/${flagId}`, flagData);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error updating feature flag:', error);
      throw error;
    }
  },

  // Toggle feature flag
  toggleFeatureFlag: async (flagId) => {
    try {
      const response = await api.patch(`/superadmin/advanced/feature-flags/${flagId}/toggle`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error toggling feature flag:', error);
      throw error;
    }
  },

  // Delete feature flag
  deleteFeatureFlag: async (flagId) => {
    try {
      const response = await api.delete(`/superadmin/advanced/feature-flags/${flagId}`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error deleting feature flag:', error);
      throw error;
    }
  },

  // ─── AI INSIGHTS ─────────────────────────────────────────────────────────────

  // Get all AI insights
  getAllAIInsights: async (filters = {}) => {
    try {
      const response = await api.get('/superadmin/advanced/ai-insights', { params: filters });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching AI insights:', error);
      throw error;
    }
  },

  // Get AI insight by ID
  getAIInsightById: async (insightId) => {
    try {
      const response = await api.get(`/superadmin/advanced/ai-insights/${insightId}`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching AI insight:', error);
      throw error;
    }
  },

  // Create new AI insight
  createAIInsight: async (insightData) => {
    try {
      const response = await api.post('/superadmin/advanced/ai-insights', insightData);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error creating AI insight:', error);
      throw error;
    }
  },

  // Acknowledge AI insight
  acknowledgeAIInsight: async (insightId) => {
    try {
      const response = await api.patch(`/superadmin/advanced/ai-insights/${insightId}/acknowledge`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error acknowledging AI insight:', error);
      throw error;
    }
  },

  // Update AI insight status
  updateAIInsightStatus: async (insightId, status) => {
    try {
      const response = await api.patch(`/superadmin/advanced/ai-insights/${insightId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error updating AI insight status:', error);
      throw error;
    }
  },

  // Delete AI insight
  deleteAIInsight: async (insightId) => {
    try {
      const response = await api.delete(`/superadmin/advanced/ai-insights/${insightId}`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error deleting AI insight:', error);
      throw error;
    }
  },

  // ─── LIVE MONITORING ─────────────────────────────────────────────────────────

  // Get live monitoring data
  getLiveMonitoringData: async (history = false) => {
    try {
      const response = await api.get('/superadmin/advanced/live-monitoring', { 
        params: { history: history.toString() } 
      });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching live monitoring data:', error);
      throw error;
    }
  },

  // Create/update live monitoring data
  createLiveMonitoringData: async (monitoringData) => {
    try {
      const response = await api.post('/superadmin/advanced/live-monitoring', monitoringData);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error creating live monitoring data:', error);
      throw error;
    }
  },

  // Acknowledge monitoring alert
  acknowledgeMonitoringAlert: async (monitoringId, alertId) => {
    try {
      const response = await api.patch(`/superadmin/advanced/live-monitoring/${monitoringId}/alerts/${alertId}/acknowledge`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error acknowledging monitoring alert:', error);
      throw error;
    }
  },

  // ─── STATISTICS ─────────────────────────────────────────────────────────────

  // Get Advanced module statistics
  getAdvancedStats: async () => {
    try {
      const response = await api.get('/superadmin/advanced/stats');
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching advanced stats:', error);
      throw error;
    }
  },
};

export default {
  users: superAdminUserAPI,
  branches: superAdminBranchAPI,
  financial: superAdminFinancialAPI,
  analytics: superAdminAnalyticsAPI,
  engagement: superAdminEngagementAPI,
  operations: superAdminOperationsAPI,
  integrations: superAdminIntegrationsAPI,
  dataManagement: superAdminDataManagementAPI,
  advanced: superAdminAdvancedAPI,
};
