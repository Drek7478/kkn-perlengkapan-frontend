// File: src/components/ui/Modal.jsx

import { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Komponen Modal Dialog
 * 
 * @param {boolean} isOpen - Status modal (true/false)
 * @param {function} onClose - Fungsi saat modal ditutup
 * @param {string} title - Judul modal
 * @param {ReactNode} children - Konten modal
 * @param {ReactNode} footer - Footer modal (tombol aksi)
 * @param {string} size - 'sm', 'md', 'lg'
 * 
 * Contoh:
 * <Modal isOpen={isOpen} onClose={() => setOpen(false)} title="Tambah Barang">
 *   ...form...
 * </Modal>
 */

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

const Modal = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
  // Tutup modal dengan tombol Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      // Mencegah scroll di belakang modal
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Container Modal */}
      <div
        className={`
          relative bg-white dark:bg-gray-900
          rounded-2xl shadow-2xl
          ${sizes[size]}
          w-full mx-4
          animate-[scaleIn_0.2s_ease-out]
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;