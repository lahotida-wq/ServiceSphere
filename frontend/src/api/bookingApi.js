// frontend/src/api/bookingApi.js
import axiosInstance from './axiosInstance';

export const bookingApi = {
  createBooking:   (data)       => axiosInstance.post('/bookings', data),
  cancelBooking:   (id)         => axiosInstance.put(`/bookings/${id}/cancel`),
  getMyBookings:   (params)     => axiosInstance.get('/bookings/my', { params }),
  getBookingById:  (id)         => axiosInstance.get(`/bookings/${id}`),
  getVendorBookings: (params)   => axiosInstance.get('/bookings/vendor', { params }),
  getVendorConfirmed: ()        => axiosInstance.get('/bookings/vendor/confirmed'),
};