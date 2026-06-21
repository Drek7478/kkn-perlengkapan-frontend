// File: src/context/ThemeContext.jsx

import { createContext, useContext, useState, useEffect } from 'react';

// Membuat context
const ThemeContext = createContext();

// Hook custom untuk mengakses ThemeContext dengan mudah
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme harus digunakan di dalam ThemeProvider');
  }
  return context;
};

// Provider: membungkus seluruh aplikasi agar bisa mengakses theme
export const ThemeProvider = ({ children }) => {
  // State: 'dark' atau 'light'
  const [theme, setTheme] = useState(() => {
    // Saat pertama load, cek localStorage dulu
    const saved = localStorage.getItem('kkn_theme');
    if (saved) return saved;

    // Kalau tidak ada, cek preferensi sistem
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  // Effect: apply class 'dark' ke <html> setiap theme berubah
  useEffect(() => {
    const html = document.documentElement;

    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    // Simpan ke localStorage
    localStorage.setItem('kkn_theme', theme);
  }, [theme]);

  // Fungsi toggle: switch antara dark dan light
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Value yang akan dibagikan ke semua komponen
  const value = {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};