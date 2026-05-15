/**
 * Trainer Communication API Service
 * Handles all API calls related to trainer communication:
 * - Messages
 * - Announcements
 * - Notifications
 */

import apiClient from '../utils/axiosConfig';
import { handleAPIError, logError } from '../utils/errorHandler';

const API_BASE_URL = '/trainer/communication';

// ─────────────────────────────────────────────────────────────────────────────
// MESSAGES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Send message to member
 * @param {Object} messageData - Message data
 * @returns {Promise<Object>} Created message
 * @throws {Error} If request fails
 */
export const sendMessage = async (messageData) => {
  try {
    const response = await apiClient.post(`${API_BASE_URL}/messages`, messageData);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'sendMessage');
    throw handleAPIError(error, 'Send Message');
  }
};

/**
 * Get inbox (all conversations)
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<Object>} Conversations list
 * @throws {Error} If request fails
 */
export const getInbox = async (page = 1, limit = 20) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/messages`, {
      params: { page, limit },
    });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getInbox');
    throw handleAPIError(error, 'Get Inbox');
  }
};

/**
 * Get conversation with specific member
 * @param {string} memberId - Member ID
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<Object>} Conversation messages
 * @throws {Error} If request fails
 */
export const getConversation = async (memberId, page = 1, limit = 50) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/messages/${memberId}`, {
      params: { page, limit },
    });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getConversation');
    throw handleAPIError(error, 'Get Conversation');
  }
};

/**
 * Mark message as read
 * @param {string} messageId - Message ID
 * @returns {Promise<Object>} Updated message
 * @throws {Error} If request fails
 */
export const markMessageAsRead = async (messageId) => {
  try {
    const response = await apiClient.put(`${API_BASE_URL}/messages/${messageId}/read`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'markMessageAsRead');
    throw handleAPIError(error, 'Mark Message as Read');
  }
};

/**
 * Delete message
 * @param {string} messageId - Message ID
 * @returns {Promise<Object>} Response
 * @throws {Error} If request fails
 */
export const deleteMessage = async (messageId) => {
  try {
    const response = await apiClient.delete(`${API_BASE_URL}/messages/${messageId}`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'deleteMessage');
    throw handleAPIError(error, 'Delete Message');
  }
};

/**
 * Get unread message count
 * @returns {Promise<Object>} Unread count
 * @throws {Error} If request fails
 */
export const getUnreadCount = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/messages/unread/count`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getUnreadCount');
    throw handleAPIError(error, 'Get Unread Count');
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// ANNOUNCEMENTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get announcements
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<Object>} Announcements list
 * @throws {Error} If request fails
 */
export const getAnnouncements = async (page = 1, limit = 20) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/announcements`, {
      params: { page, limit },
    });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getAnnouncements');
    throw handleAPIError(error, 'Get Announcements');
  }
};

/**
 * Get announcement by ID
 * @param {string} announcementId - Announcement ID
 * @returns {Promise<Object>} Announcement details
 * @throws {Error} If request fails
 */
export const getAnnouncementById = async (announcementId) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/announcements/${announcementId}`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getAnnouncementById');
    throw handleAPIError(error, 'Get Announcement');
  }
};

/**
 * Get announcement statistics
 * @returns {Promise<Object>} Statistics
 * @throws {Error} If request fails
 */
export const getAnnouncementStats = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/announcements/stats`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getAnnouncementStats');
    throw handleAPIError(error, 'Get Announcement Statistics');
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATIONS (from trainerNotificationAPI)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Send notification to member
 * @param {Object} notificationData - Notification data
 * @returns {Promise<Object>} Created notification
 * @throws {Error} If request fails
 */
export const sendNotification = async (notificationData) => {
  try {
    const response = await apiClient.post('/trainer/notifications', notificationData);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'sendNotification');
    throw handleAPIError(error, 'Send Notification');
  }
};

/**
 * Get all notifications sent by trainer
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} Notifications list
 * @throws {Error} If request fails
 */
export const getAllNotifications = async (page = 1, limit = 20, filters = {}) => {
  try {
    const response = await apiClient.get('/trainer/notifications', {
      params: { page, limit, ...filters },
    });
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getAllNotifications');
    throw handleAPIError(error, 'Get Notifications');
  }
};

/**
 * Get notification by ID
 * @param {string} notificationId - Notification ID
 * @returns {Promise<Object>} Notification details
 * @throws {Error} If request fails
 */
export const getNotificationById = async (notificationId) => {
  try {
    const response = await apiClient.get(`/trainer/notifications/${notificationId}`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getNotificationById');
    throw handleAPIError(error, 'Get Notification');
  }
};

/**
 * Delete notification
 * @param {string} notificationId - Notification ID
 * @returns {Promise<Object>} Response
 * @throws {Error} If request fails
 */
export const deleteNotification = async (notificationId) => {
  try {
    const response = await apiClient.delete(`/trainer/notifications/${notificationId}`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'deleteNotification');
    throw handleAPIError(error, 'Delete Notification');
  }
};

/**
 * Get notification statistics
 * @returns {Promise<Object>} Statistics
 * @throws {Error} If request fails
 */
export const getNotificationStats = async () => {
  try {
    const response = await apiClient.get('/trainer/notifications/stats');
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getNotificationStats');
    throw handleAPIError(error, 'Get Notification Statistics');
  }
};

/**
 * Send bulk notifications
 * @param {Object} bulkData - Bulk notification data
 * @returns {Promise<Object>} Response
 * @throws {Error} If request fails
 */
export const sendBulkNotifications = async (bulkData) => {
  try {
    const response = await apiClient.post('/trainer/notifications/bulk', bulkData);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'sendBulkNotifications');
    throw handleAPIError(error, 'Send Bulk Notifications');
  }
};

/**
 * Send workout reminder
 * @param {Object} reminderData - Reminder data
 * @returns {Promise<Object>} Response
 * @throws {Error} If request fails
 */
export const sendWorkoutReminder = async (reminderData) => {
  try {
    const response = await apiClient.post('/trainer/notifications/workout-reminder', reminderData);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'sendWorkoutReminder');
    throw handleAPIError(error, 'Send Workout Reminder');
  }
};

/**
 * Send session reminder
 * @param {Object} reminderData - Reminder data
 * @returns {Promise<Object>} Response
 * @throws {Error} If request fails
 */
export const sendSessionReminder = async (reminderData) => {
  try {
    const response = await apiClient.post('/trainer/notifications/session-reminder', reminderData);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'sendSessionReminder');
    throw handleAPIError(error, 'Send Session Reminder');
  }
};

/**
 * Send diet reminder
 * @param {Object} reminderData - Reminder data
 * @returns {Promise<Object>} Response
 * @throws {Error} If request fails
 */
export const sendDietReminder = async (reminderData) => {
  try {
    const response = await apiClient.post('/trainer/notifications/diet-reminder', reminderData);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'sendDietReminder');
    throw handleAPIError(error, 'Send Diet Reminder');
  }
};

// Export all functions as default object
const trainerCommunicationAPI = {
  // Messages
  sendMessage,
  getInbox,
  getConversation,
  markMessageAsRead,
  deleteMessage,
  getUnreadCount,
  // Announcements
  getAnnouncements,
  getAnnouncementById,
  getAnnouncementStats,
  // Notifications
  sendNotification,
  getAllNotifications,
  getNotificationById,
  deleteNotification,
  getNotificationStats,
  sendBulkNotifications,
  sendWorkoutReminder,
  sendSessionReminder,
  sendDietReminder,
};

export default trainerCommunicationAPI;
