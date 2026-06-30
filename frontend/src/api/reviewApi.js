// frontend/src/api/reviewApi.js
import axiosInstance from './axiosInstance';

export const reviewApi = {
  createReview:     (data)      => axiosInstance.post('/reviews', data),
  updateReview:     (id, data)  => axiosInstance.put(`/reviews/${id}`, data),
  deleteReview:     (id)        => axiosInstance.delete(`/reviews/${id}`),
  getVendorReviews: (vendorId, params) => axiosInstance.get(`/reviews/vendor/${vendorId}`, { params }),
  getMyReviews:     (params)    => axiosInstance.get('/reviews/my', { params }),
};