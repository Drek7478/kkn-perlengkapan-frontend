// File: src/components/ui/EmptyState.jsx

import { Package } from 'lucide-react';

/**
 * Komponen Empty State (ditampilkan saat data kosong)
 * 
 * @param {string} title - Judul
 * @param {string} description - Deskripsi / instruksi
 * @param {React.Component} icon - Icon dari lucide-react
 * @param {ReactNode} action - Tombol aksi (opsional)
 * 
 * Contoh:
 * <EmptyState
 *   title="Belum ada barang"
 *   description="Klik tombol di atas untuk menambah barang pertama."
 *   icon={Package}
 *   action={<button>Tambah Barang</button>}
 * />
 */

const EmptyState = ({
  title = 'Belum ada data',
  description = '',
  icon: Icon = Package,
  action = null,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Icon */}
      <div className="
        w-20 h-20 rounded-2xl
        bg-gray-100 dark:bg-gray-800
        flex items-center justify-center
        mb-6
      ">
        <Icon size={40} className="text-gray-400 dark:text-gray-500" />
      </div>

      {/* Teks */}
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-50 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm mb-6">
          {description}
        </p>
      )}

      {/* Tombol Aksi (opsional) */}
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;