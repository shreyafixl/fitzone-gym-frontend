/**
 * Trainer Settings API Service
 * Handles all API calls related to trainer settings management
 * 
 * Includes:
 * - Profile settings
 * - Trainer preferences
 * - Availability settings
 * - Notification preferences
 * - Account settings
 * - Payment settings
 * - Privacy settings
 * - Integration settings
 */

import apiClient from '../utils/axiosConfig';
import { handleAPIError, logError } from '../utils/errorHandler';

const API_BASE_URL = '/trainer/settings';

/**
 * Get all trainer settings
 * @returns {Promise<Object>} All settings data
 * @throws {Error} If request fails
 */
export const getAllSettings = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getAllSettings');
    throw handleAPIError(error, 'Get All Settings');
  }
};

/**
 * Get profile settings
 * @returns {Promise<Object>} Profile settings data
 * @throws {Error} If request fails
 */
export const getProfileSettings = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/profile`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getProfileSettings');
    throw handleAPIError(error, 'Get Profile Settings');
  }
};

/**
 * Update profile settings
 * @param {Object} profileData - Profile settings to update
 * @returns {Promise<Object>} Updated profile settings
 * @throws {Error} If request fails
 */
export const updateProfileSettings = async (profileData) => {
  try {
    const response = await apiClient.put(`${API_BASE_URL}/profile`, profileData);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'updateProfileSettings');
    throw handleAPIError(error, 'Update Profile Settings');
  }
};

/**
 * Get trainer preferences
 * @returns {Promise<Object>} Trainer preferences data
 * @throws {Error} If request fails
 */
export const getTrainerPreferences = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/preferences`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getTrainerPreferences');
    throw handleAPIError(error, 'Get Trainer Preferences');
  }
};

/**
 * Update trainer preferences
 * @param {Object} preferencesData - Preferences to update
 * @returns {Promise<Object>} Updated preferences
 * @throws {Error} If request fails
 */
export const updateTrainerPreferences = async (preferencesData) => {
  try {
    const response = await apiClient.put(`${API_BASE_URL}/preferences`, preferencesData);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'updateTrainerPreferences');
    throw handleAPIError(error, 'Update Trainer Preferences');
  }
};

/**
 * Get availability settings
 * @returns {Promise<Object>} Availability settings data
 * @throws {Error} If request fails
 */
export const getAvailabilitySettings = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/availability`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getAvailabilitySettings');
    throw handleAPIError(error, 'Get Availability Settings');
  }
};

/**
 * Update availability settings
 * @param {Object} availabilityData - Availability settings to update
 * @returns {Promise<Object>} Updated availability settings
 * @throws {Error} If request fails
 */
export const updateAvailabilitySettings = async (availabilityData) => {
  try {
    const response = await apiClient.put(`${API_BASE_URL}/availability`, availabilityData);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'updateAvailabilitySettings');
    throw handleAPIError(error, 'Update Availability Settings');
  }
};

/**
 * Get notification preferences
 * @returns {Promise<Object>} Notification preferences data
 * @throws {Error} If request fails
 */
export const getNotificationPreferences = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/notifications`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getNotificationPreferences');
    throw handleAPIError(error, 'Get Notification Preferences');
  }
};

/**
 * Update notification preferences
 * @param {Object} notificationData - Notification preferences to update
 * @returns {Promise<Object>} Updated notification preferences
 * @throws {Error} If request fails
 */
export const updateNotificationPreferences = async (notificationData) => {
  try {
    const response = await apiClient.put(`${API_BASE_URL}/notifications`, notificationData);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'updateNotificationPreferences');
    throw handleAPIError(error, 'Update Notification Preferences');
  }
};

/**
 * Get account settings
 * @returns {Promise<Object>} Account settings data
 * @throws {Error} If request fails
 */
export const getAccountSettings = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/account`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getAccountSettings');
    throw handleAPIError(error, 'Get Account Settings');
  }
};

/**
 * Update account settings
 * @param {Object} accountData - Account settings to update
 * @returns {Promise<Object>} Updated account settings
 * @throws {Error} If request fails
 */
export const updateAccountSettings = async (accountData) => {
  try {
    const response = await apiClient.put(`${API_BASE_URL}/account`, accountData);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'updateAccountSettings');
    throw handleAPIError(error, 'Update Account Settings');
  }
};

/**
 * Get payment settings
 * @returns {Promise<Object>} Payment settings data
 * @throws {Error} If request fails
 */
export const getPaymentSettings = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/payment`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getPaymentSettings');
    throw handleAPIError(error, 'Get Payment Settings');
  }
};

/**
 * Update payment settings
 * @param {Object} paymentData - Payment settings to update
 * @returns {Promise<Object>} Updated payment settings
 * @throws {Error} If request fails
 */
export const updatePaymentSettings = async (paymentData) => {
  try {
    const response = await apiClient.put(`${API_BASE_URL}/payment`, paymentData);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'updatePaymentSettings');
    throw handleAPIError(error, 'Update Payment Settings');
  }
};

/**
 * Get privacy settings
 * @returns {Promise<Object>} Privacy settings data
 * @throws {Error} If request fails
 */
export const getPrivacySettings = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/privacy`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getPrivacySettings');
    throw handleAPIError(error, 'Get Privacy Settings');
  }
};

/**
 * Update privacy settings
 * @param {Object} privacyData - Privacy settings to update
 * @returns {Promise<Object>} Updated privacy settings
 * @throws {Error} If request fails
 */
export const updatePrivacySettings = async (privacyData) => {
  try {
    const response = await apiClient.put(`${API_BASE_URL}/privacy`, privacyData);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'updatePrivacySettings');
    throw handleAPIError(error, 'Update Privacy Settings');
  }
};

/**
 * Get integration settings
 * @returns {Promise<Object>} Integration settings data
 * @throws {Error} If request fails
 */
export const getIntegrationSettings = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/integrations`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'getIntegrationSettings');
    throw handleAPIError(error, 'Get Integration Settings');
  }
};

/**
 * Update integration settings
 * @param {Object} integrationData - Integration settings to update
 * @returns {Promise<Object>} Updated integration settings
 * @throws {Error} If request fails
 */
export const updateIntegrationSettings = async (integrationData) => {
  try {
    const response = await apiClient.put(`${API_BASE_URL}/integrations`, integrationData);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'updateIntegrationSettings');
    throw handleAPIError(error, 'Update Integration Settings');
  }
};

/**
 * Reset all settings to defaults
 * @returns {Promise<Object>} Reset settings
 * @throws {Error} If request fails
 */
export const resetSettings = async () => {
  try {
    const response = await apiClient.post(`${API_BASE_URL}/reset`);
    return response.data.data || response.data;
  } catch (error) {
    logError(error, 'resetSettings');
    throw handleAPIError(error, 'Reset Settings');
  }
};

// Export all functions as default object
const trainerSettingsAPI = {
  getAllSettings,
  getProfileSettings,
  updateProfileSettings,
  getTrainerPreferences,
  updateTrainerPreferences,
  getAvailabilitySettings,
  updateAvailabilitySettings,
  getNotificationPreferences,
  updateNotificationPreferences,
  getAccountSettings,
  updateAccountSettings,
  getPaymentSettings,
  updatePaymentSettings,
  getPrivacySettings,
  updatePrivacySettings,
  getIntegrationSettings,
  updateIntegrationSettings,
  resetSettings,
};

export default trainerSettingsAPI;
