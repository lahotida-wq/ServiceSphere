// frontend/src/api/authApi.js
import axiosInstance from './axiosInstance';

export const authApi = {
  signup: (data) => axiosInstance.post('/auth/signup', data),
  login: (data) => axiosInstance.post('/auth/login', data),
};