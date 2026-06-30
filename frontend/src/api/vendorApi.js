// frontend/src/api/vendorApi.js
import axiosInstance from './axiosInstance';

export const vendorApi = {
  createProfile:  (data)            => axiosInstance.post('/vendors/profile', data),
  updateProfile:  (data)            => axiosInstance.put('/vendors/profile', data),
  getMyProfile:   ()                => axiosInstance.get('/vendors/profile/me'),
  getVendorById:  (id)              => axiosInstance.get(`/vendors/${id}`),
  getAllVendors:   (params)          => axiosInstance.get('/vendors', { params }),

  // Services
  addService:     (data)            => axiosInstance.post('/services', data),
  updateService:  (id, data)        => axiosInstance.put(`/services/${id}`, data),
  deleteService:  (id)              => axiosInstance.delete(`/services/${id}`),
  getMyServices:  ()                => axiosInstance.get('/services/my'),
  getServicesByVendor: (vendorId)   => axiosInstance.get(`/services/vendor/${vendorId}`),
};