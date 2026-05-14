import axios from 'axios';

const API_BASE_URL = '/api/admin';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('adminToken') || localStorage.getItem('token');
};

// Create axios instance with default headers
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── NOTIFICATIONS API ───────────────────────────────────────────────────────
export const notificationsAPI = {
  // Get all notifications
  getAllNotifications: async (params = {}) => {
    try {
      const response = await apiClient.get('/notifications', { params });
      return response.data.data || [];
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch notifications' };
    }
  },

  // Get notification by ID
  getNotificationById: async (id) => {
    try {
      const response = await apiClient.get(`/notifications/${id}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch notification' };
    }
  },

  // Create notification
  createNotification: async (notificationData) => {
    try {
      const response = await apiClient.post('/notifications', notificationData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create notification' };
    }
  },

  // Update notification
  updateNotification: async (id, notificationData) => {
    try {
      const response = await apiClient.put(`/notifications/${id}`, notificationData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update notification' };
    }
  },

  // Delete notification
  deleteNotification: async (id) => {
    try {
      const response = await apiClient.delete(`/notifications/${id}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete notification' };
    }
  },

  // Mark notification as read
  markAsRead: async (id) => {
    try {
      const response = await apiClient.patch(`/notifications/${id}/read`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to mark as read' };
    }
  },

  // Mark notification as unread
  markAsUnread: async (id) => {
    try {
      const response = await apiClient.patch(`/notifications/${id}/unread`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to mark as unread' };
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      const response = await apiClient.patch('/notifications/mark-all-read');
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to mark all as read' };
    }
  },

  // Get notification stats
  getStats: async () => {
    try {
      const response = await apiClient.get('/notifications/stats');
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch notification stats' };
    }
  },
};

// ─── ANNOUNCEMENTS API ───────────────────────────────────────────────────────
export const announcementsAPI = {
  // Get all announcements
  getAllAnnouncements: async (params = {}) => {
    try {
      const response = await apiClient.get('/announcements', { params });
      return response.data.data || [];
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch announcements' };
    }
  },

  // Get announcement by ID
  getAnnouncementById: async (id) => {
    try {
      const response = await apiClient.get(`/announcements/${id}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch announcement' };
    }
  },

  // Create announcement
  createAnnouncement: async (announcementData) => {
    try {
      const response = await apiClient.post('/announcements', announcementData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create announcement' };
    }
  },

  // Update announcement
  updateAnnouncement: async (id, announcementData) => {
    try {
      const response = await apiClient.put(`/announcements/${id}`, announcementData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update announcement' };
    }
  },

  // Delete announcement
  deleteAnnouncement: async (id) => {
    try {
      const response = await apiClient.delete(`/announcements/${id}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete announcement' };
    }
  },

  // Publish announcement
  publishAnnouncement: async (id) => {
    try {
      const response = await apiClient.patch(`/announcements/${id}/publish`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to publish announcement' };
    }
  },

  // Schedule announcement
  scheduleAnnouncement: async (id, scheduleData) => {
    try {
      const response = await apiClient.patch(`/announcements/${id}/schedule`, scheduleData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to schedule announcement' };
    }
  },

  // Get announcement stats
  getStats: async () => {
    try {
      const response = await apiClient.get('/announcements/stats');
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch announcement stats' };
    }
  },
};

// ─── COMMUNICATION API ───────────────────────────────────────────────────────
export const communicationAPI = {
  // Send email
  sendEmail: async (emailData) => {
    try {
      const response = await apiClient.post('/communication/email', emailData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to send email' };
    }
  },

  // Send SMS
  sendSMS: async (smsData) => {
    try {
      const response = await apiClient.post('/communication/sms', smsData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to send SMS' };
    }
  },

  // Send push notification
  sendPushNotification: async (pushData) => {
    try {
      const response = await apiClient.post('/communication/push', pushData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to send push notification' };
    }
  },

  // Save draft
  saveDraft: async (draftData) => {
    try {
      const response = await apiClient.post('/communication/draft', draftData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to save draft' };
    }
  },

  // Get drafts
  getDrafts: async (params = {}) => {
    try {
      const response = await apiClient.get('/communication/drafts', { params });
      return response.data.data || [];
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch drafts' };
    }
  },

  // Get communication history
  getHistory: async (params = {}) => {
    try {
      const response = await apiClient.get('/communication/history', { params });
      return response.data.data || [];
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch communication history' };
    }
  },

  // Get communication stats
  getStats: async () => {
    try {
      const response = await apiClient.get('/communication/stats');
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch communication stats' };
    }
  },
};

export default {
  notificationsAPI,
  announcementsAPI,
  communicationAPI,
};
