// File: src/components/layout/Sidebar.jsx

import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  LayoutDashboard,
  Package,
  Search,
  AlertTriangle,
  CheckCircle,
  LogOut,
  Menu,
  X,
  User,
} from 'lucide-react';

// Daftar menu sidebar
const menuItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Data Barang',
    path: '/barang',
    icon: Package,
  },
  {
    label: 'Pengecekan',
    path: '/pengecekan',
    icon: Search,
  },
  {
    label: 'Barang Hilang',
    path: '/barang-hilang',
    icon: AlertTriangle,
  },
  {
    label: 'Barang Selesai',
    path: '/barang-selesai',
    icon: CheckCircle,
  },
];

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = async () => {
    const confirmed = window.confirm('Apakah Anda yakin ingin keluar?');
    if (!confirmed) return;

    await logout();
    toast.success('Anda telah logout.');
    navigate('/login');
  };

  return (
    <>
      {/* ============================================
          TOMBOL HAMBURGER (MOBILE)
          ============================================ */}
      <button
        onClick={() => setMobileOpen(true)}
        className="
          lg:hidden fixed top-4 left-4 z-40
          p-2 rounded-lg
          bg-white dark:bg-gray-900
          shadow-md
          text-gray-700 dark:text-gray-300
          hover:bg-gray-100 dark:hover:bg-gray-800
          transition-colors
        "
      >
        <Menu size={24} />
      </button>

      {/* ============================================
          OVERLAY MOBILE
          ============================================ */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ============================================
          SIDEBAR
          ============================================ */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full
          w-[260px]
          bg-gray-900 dark:bg-gray-950
          border-r border-gray-800 dark:border-gray-900
          flex flex-col
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header Sidebar */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800 dark:border-gray-900">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Package size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-white font-semibold text-sm">KKN</h1>
              <p className="text-gray-400 text-xs">Perlengkapan</p>
            </div>
          </div>

          {/* Tombol Tutup (Mobile) */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu Navigasi */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl
                text-sm font-medium
                transition-all duration-200
                ${isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }
              `}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer Sidebar (User Info + Logout) */}
        <div className="p-4 border-t border-gray-800 dark:border-gray-900">
          <div className="flex items-center gap-3 mb-3">
            {/* Avatar */}
            <div className="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center">
              <User size={18} className="text-gray-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-300 font-medium truncate">
                {user?.name || 'Admin'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || 'admin@kkn.com'}
              </p>
            </div>
          </div>

          {/* Tombol Logout */}
          <button
            onClick={handleLogout}
            className="
              w-full flex items-center justify-center gap-2
              px-3 py-2 rounded-xl
              text-sm text-gray-400 hover:text-red-400
              hover:bg-gray-800
              transition-colors duration-200
            "
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;