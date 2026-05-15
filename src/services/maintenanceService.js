import axios from 'axios';

const API_BASE_URL = '/api/admin/maintenance';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('gym-auth-token') || localStorage.getItem('adminToken') || localStorage.getItem('token');
};

// Create axios instance with auth header
const createAxiosInstance = () => {
  const token = getAuthToken();
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

/**
 * Get all maintenance logs
 * @param {Object} filters - Filter options (status, equipment_id)
 * @returns {Promise<Array>} Array of maintenance logs
 */
export const getAllMaintenance = async (filters = {}) => {
  try {
    const axiosInstance = createAxiosInstance();
    const response = await axiosInstance.get('/', { params: filters });
    return response.data.data || response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch maintenance logs');
  }
};

/**
 * Get maintenance log by ID
 * @param {string} maintenanceId - Maintenance log ID
 * @returns {Promise<Object>} Maintenance log details
 */
export const getMaintenanceById = async (maintenanceId) => {
  try {
    const axiosInstance = createAxiosInstance();
    const response = await axiosInstance.get(`/${maintenanceId}`);
    return response.data.data || response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch maintenance log');
  }
};

/**
 * Create new maintenance log
 * @param {Object} maintenanceData - Maintenance data
 * @returns {Promise<Object>} Created maintenance log
 */
export const createMaintenance = async (maintenanceData) => {
  try {
    const axiosInstance = createAxiosInstance();
    const response = await axiosInstance.post('/', maintenanceData);
    return response.data.data || response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create maintenance log');
  }
};

/**
 * Update maintenance log
 * @param {string} maintenanceId - Maintenance log ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated maintenance log
 */
export const updateMaintenance = async (maintenanceId, updateData) => {
  try {
    const axiosInstance = createAxiosInstance();
    const response = await axiosInstance.put(`/${maintenanceId}`, updateData);
    return response.data.data || response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update maintenance log');
  }
};

/**
 * Delete maintenance log
 * @param {string} maintenanceId - Maintenance log ID
 * @returns {Promise<Object>} Response from server
 */
export const deleteMaintenance = async (maintenanceId) => {
  try {
    const axiosInstance = createAxiosInstance();
    const response = await axiosInstance.delete(`/${maintenanceId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete maintenance log');
  }
};

export default {
  getAllMaintenance,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
};
