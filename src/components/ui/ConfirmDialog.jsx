// File: src/components/ui/ConfirmDialog.jsx

import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

/**
 * Komponen Konfirmasi Dialog (untuk hapus, tandai hilang, dll)
 * 
 * @param {boolean} isOpen
 * @param {function} onClose
 * @param {function} onConfirm - Fungsi saat user klik "Ya"
 * @param {string} title - Judul
 * @param {string} message - Pesan konfirmasi
 * @param {string} confirmText - Teks tombol konfirmasi (default: "Ya, Lanjutkan")
 * @param {string} variant - 'danger', 'warning'
 * @param {boolean} loading - Status loading saat proses
 * 
 * Contoh:
 * <ConfirmDialog
 *   isOpen={showDelete}
 *   onClose={() => setShowDelete(false)}
 *   onConfirm={handleDelete}
 *   title="Hapus Barang?"
 *   message="Barang akan dihapus permanen beserta fotonya."
 *   variant="danger"
 *   loading={isDeleting}
 * />
 */

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi',
  message = 'Apakah Anda yakin?',
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  variant = 'danger',
  loading = false,
}) => {
  const variantStyles = {
    danger: {
      icon: 'text-red-600 dark:text-red-400',
      iconBg: 'bg-red-100 dark:bg-red-900/40',
      button: 'bg-red-600 hover:bg-red-700 text-white',
    },
    warning: {
      icon: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-100 dark:bg-amber-900/40',
      button: 'bg-amber-600 hover:bg-amber-700 text-white',
    },
  };

  const style = variantStyles[variant] || variantStyles.danger;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center">
        {/* Icon Warning */}
        <div className={`
          inline-flex items-center justify-center
          w-16 h-16 rounded-2xl mb-4
          ${style.iconBg}
        `}>
          <AlertTriangle size={32} className={style.icon} />
        </div>

        {/* Judul */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">
          {title}
        </h3>

        {/* Pesan */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {message}
        </p>

        {/* Tombol Aksi */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            disabled={loading}
            className="
              px-4 py-2 rounded-lg
              bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800
              text-gray-700 dark:text-gray-300
              border border-gray-300 dark:border-gray-600
              font-medium text-sm
              transition-colors duration-200
              disabled:opacity-50
            "
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`
              px-4 py-2 rounded-lg
              ${style.button}
              font-medium text-sm
              transition-colors duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center gap-2
            `}
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {loading ? 'Memproses...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;