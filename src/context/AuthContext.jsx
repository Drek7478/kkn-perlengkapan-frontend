// File: src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

// Membuat context
const AuthContext = createContext();

// Hook custom
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
};

// Provider
export const AuthProvider = ({ children }) => {
  // State: data user yang login
  const [user, setUser] = useState(() => {
    // Cek localStorage saat pertama render
    const saved = localStorage.getItem('kkn_user');
    return saved ? JSON.parse(saved) : null;
  });

  // State: loading (untuk cek token saat app pertama dibuka)
  const [loading, setLoading] = useState(true);

  // Token helper
  const getToken = () => localStorage.getItem('kkn_token');

  // Cek token valid saat aplikasi pertama kali dibuka
  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Coba akses dashboard untuk validasi token
        await api.get('/dashboard');
      } catch (err) {
        // Jika token tidak valid, hapus dari localStorage
        localStorage.removeItem('kkn_token');
        localStorage.removeItem('kkn_user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Fungsi login
  const login = async (email, password) => {
    // Kirim request login ke API
    const response = await api.post('/login', { email, password });

    const { user: userData, token } = response.data.data;

    // Simpan token dan user ke localStorage
    localStorage.setItem('kkn_token', token);
    localStorage.setItem('kkn_user', JSON.stringify(userData));

    // Update state
    setUser(userData);

    return response.data;
  };

  // Fungsi logout
  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (err) {
      // Abaikan error (token mungkin sudah tidak valid)
    } finally {
      // Hapus data dari localStorage
      localStorage.removeItem('kkn_token');
      localStorage.removeItem('kkn_user');

      // Reset state
      setUser(null);
    }
  };

  // Cek apakah user sudah login
  const isAuthenticated = !!user && !!getToken();

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};