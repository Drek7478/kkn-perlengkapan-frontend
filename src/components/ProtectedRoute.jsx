// File: src/components/ProtectedRoute.jsx

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './ui/Spinner';

/**
 * ProtectedRoute: Membungkus halaman yang membutuhkan login
 * Jika user belum login, redirect ke /login
 * Jika sedang loading (cek token), tampilkan spinner
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Saat pertama load, cek dulu token valid atau tidak
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Spinner size="lg" />
      </div>
    );
  }

  // Jika tidak ada token / user, redirect ke login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Jika sudah login, tampilkan halaman yang diminta
  return children;
};

export default ProtectedRoute;