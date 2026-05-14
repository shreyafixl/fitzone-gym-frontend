import api from './api';

const adminSettingsAPI = {
  getSettings: async () => {
    try {
      const response = await api.get('/admin/settings');
      return response.data;
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }
  },

  updateSettings: async (settingsData) => {
    try {
      const response = await api.put('/admin/settings', settingsData);
      return response.data;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  },
};

export default adminSettingsAPI;
