import api from './api';

/**
 * Equipment Service
 * Handles all equipment-related API calls
 */

// Get all equipment with filtering and pagination
export const getAllEquipment = async (params = {}) => {
  try {
    const response = await api.get('/admin/equipment', {
      params
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching equipment:', error);
    throw error;
  }
};

// Get equipment by ID
export const getEquipmentById = async (id) => {
  try {
    const response = await api.get(`/admin/equipment/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching equipment:', error);
    throw error;
  }
};

// Create new equipment
export const createEquipment = async (equipmentData) => {
  try {
    const response = await api.post('/admin/equipment', equipmentData);
    return response.data;
  } catch (error) {
    console.error('Error creating equipment:', error);
    throw error;
  }
};

// Update equipment
export const updateEquipment = async (id, equipmentData) => {
  try {
    const response = await api.put(`/admin/equipment/${id}`, equipmentData);
    return response.data;
  } catch (error) {
    console.error('Error updating equipment:', error);
    throw error;
  }
};

// Update equipment status
export const updateEquipmentStatus = async (id, status) => {
  try {
    const response = await api.put(`/admin/equipment/${id}/status`, {
      status
    });
    return response.data;
  } catch (error) {
    console.error('Error updating equipment status:', error);
    throw error;
  }
};

// Delete equipment
export const deleteEquipment = async (id) => {
  try {
    const response = await api.delete(`/admin/equipment/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting equipment:', error);
    throw error;
  }
};

// Get equipment statistics
export const getEquipmentStats = async () => {
  try {
    const response = await api.get('/admin/equipment/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching equipment stats:', error);
    throw error;
  }
};

export default {
  getAllEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  updateEquipmentStatus,
  deleteEquipment,
  getEquipmentStats
};
