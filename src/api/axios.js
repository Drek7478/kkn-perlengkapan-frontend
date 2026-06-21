// File: src/api/axios.js

import axios from 'axios';

// Membuat instance axios dengan baseURL API Laravel
const api = axios.create({
  baseURL: 'https://kkn-perlengkapan-api-production.up.railway.app/api',
  headers: {
    Accept: 'application/json',
  },
});

// Interceptor request: otomatis menambahkan token di setiap request
api.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage
    const token = localStorage.getItem('kkn_token');

    // Jika token ada, tambahkan ke header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor response: menangani error global
api.interceptors.response.use(
  (response) => {
    // Jika sukses, langsung kembalikan response
    return response;
  },
  (error) => {
    // Jika error 401 (Unauthenticated), redirect ke login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('kkn_token');
      localStorage.removeItem('kkn_user');
      // Redirect ke halaman login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;