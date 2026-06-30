// frontend/src/api/analyticsApi.js
import axiosInstance from './axiosInstance';

export const analyticsApi = {
  getVendorAnalytics: () => axiosInstance.get('/analytics/vendor'),
};