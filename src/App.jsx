// File: src/App.jsx

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import Toast from './components/ui/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Barang from './pages/Barang';
import DetailBarang from './pages/DetailBarang';
import Pengecekan from './pages/Pengecekan';
import BarangHilang from './pages/BarangHilang';
import BarangSelesai from './pages/BarangSelesai';

const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <Toast />

            <Routes>
              {/* Public */}
              <Route path="/login" element={<Login />} />

              {/* Protected dengan Layout */}
              <Route
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/barang" element={<Barang />} />
                <Route path="/barang/:id" element={<DetailBarang />} />
                <Route path="/pengecekan" element={<Pengecekan />} />
                <Route path="/barang-hilang" element={<BarangHilang />} />
                <Route path="/barang-selesai" element={<BarangSelesai />} />
              </Route>

              {/* Redirect */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;