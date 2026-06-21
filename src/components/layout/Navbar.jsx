// File: src/components/layout/Navbar.jsx

import { useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Moon, Sun, User } from 'lucide-react';

// Mapping path ke judul halaman
const pageTitles = {
  '/dashboard': 'Dashboard',
  '/barang': 'Data Barang',
  '/pengecekan': 'Pengecekan',
  '/barang-hilang': 'Barang Hilang',
  '/barang-selesai': 'Barang Selesai',
};

const Navbar = () => {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();

  // Dapatkan judul halaman berdasarkan path
  const currentPath = location.pathname;

  // Cek apakah path mengandung parameter (misal /barang/1)
  let title = pageTitles[currentPath];
  if (!title) {
    // Coba cocokkan dengan prefix path
    const prefix = '/' + currentPath.split('/')[1];
    title = pageTitles[prefix] || 'Halaman';
  }

  // Breadcrumb
  const getBreadcrumb = () => {
    const parts = currentPath.split('/').filter(Boolean);

    if (parts.length === 0) return [];

    const breadcrumbs = [{ label: 'Home', path: '/dashboard' }];

    if (parts[0] === 'barang' && parts[1]) {
      breadcrumbs.push({ label: 'Data Barang', path: '/barang' });
      breadcrumbs.push({ label: 'Detail Barang', path: currentPath });
    } else if (parts[0] === 'pengecekan' && parts[1]) {
      breadcrumbs.push({ label: 'Pengecekan', path: '/pengecekan' });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumb();

  return (
    <header className="
      sticky top-0 z-30
      bg-white dark:bg-gray-900
      border-b border-gray-200 dark:border-gray-700
      px-4 lg:px-8 py-3
    ">
      <div className="flex items-center justify-between">
        {/* Kiri: Judul Halaman + Breadcrumb */}
        <div className="ml-12 lg:ml-0">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            {title}
          </h1>
          {breadcrumbs.length > 1 && (
            <nav className="flex items-center gap-1 mt-0.5">
              {breadcrumbs.map((crumb, index) => (
                <span key={index} className="flex items-center gap-1">
                  {index > 0 && (
                    <span className="text-gray-300 dark:text-gray-600">/</span>
                  )}
                  <span
                    className={`
                      text-xs
                      ${index === breadcrumbs.length - 1
                        ? 'text-gray-600 dark:text-gray-400 font-medium'
                        : 'text-gray-400 dark:text-gray-500'
                      }
                    `}
                  >
                    {crumb.label}
                  </span>
                </span>
              ))}
            </nav>
          )}
        </div>

        {/* Kanan: Toggle Dark Mode + User Info */}
        <div className="flex items-center gap-3">
          {/* Toggle Dark Mode */}
          <button
            onClick={toggleTheme}
            className="              p-2 rounded-lg
              text-gray-500 hover:text-gray-700
              dark:text-gray-400 dark:hover:text-gray-200
              hover:bg-gray-100 dark:hover:bg-gray-800
              transition-colors duration-200
            "
            title={isDark ? 'Mode Terang' : 'Mode Gelap'}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* User Avatar */}
          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-gray-200 dark:border-gray-700">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <User size={16} className="text-gray-500 dark:text-gray-400" />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:block">
              {user?.name || 'Admin'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;