// File: src/components/layout/Layout.jsx

import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

/**
 * Layout: Wrapper untuk semua halaman yang butuh sidebar + navbar
 * 
 * Menggunakan Outlet dari React Router untuk merender halaman anak
 * sesuai route yang aktif.
 */
const Layout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Sidebar (kiri) */}
      <Sidebar />

      {/* Konten Utama (kanan) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar (atas) */}
        <Navbar />

        {/* Area Konten (scrollable) */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;