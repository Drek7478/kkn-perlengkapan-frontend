// File: src/context/ToastContext.jsx

import { createContext, useContext, useState, useCallback } from 'react';

// Membuat context
const ToastContext = createContext();

// Hook custom
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast harus digunakan di dalam ToastProvider');
  }
  return context;
};

// Provider
export const ToastProvider = ({ children }) => {
  // State: array of toast
  const [toasts, setToasts] = useState([]);

  // Fungsi untuk menambah toast baru
  const addToast = useCallback((message, type = 'success') => {
    // Buat ID unik berdasarkan timestamp
    const id = Date.now();

    // Tambahkan toast ke array
    setToasts((prev) => [...prev, { id, message, type }]);

    // Hapus toast setelah 3 detik
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  // Fungsi untuk menghapus toast secara manual
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Shortcut functions
  const success = useCallback((message) => addToast(message, 'success'), [addToast]);
  const error = useCallback((message) => addToast(message, 'error'), [addToast]);
  const warning = useCallback((message) => addToast(message, 'warning'), [addToast]);

  const value = {
    toasts,
    success,
    error,
    warning,
    removeToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};