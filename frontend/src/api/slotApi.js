// frontend/src/api/slotApi.js
import axiosInstance from './axiosInstance';

export const slotApi = {
  generateSlots:    (data)      => axiosInstance.post('/slots/generate', data),
  getAvailableSlots:(serviceId) => axiosInstance.get(`/slots/available/${serviceId}`),
  getAllSlots:       (serviceId) => axiosInstance.get(`/slots/all/${serviceId}`),
  deleteSlot:       (slotId)    => axiosInstance.delete(`/slots/${slotId}`),
};