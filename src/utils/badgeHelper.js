// File: src/utils/badgeHelper.js

/**
 * Mendapatkan class Tailwind untuk badge kondisi barang
 * 
 * @param {string} kondisi - 'baik', 'rusak_ringan', 'rusak_berat'
 * @returns {string} Class Tailwind
 */
export const getKondisiBadge = (kondisi) => {
  const styles = {
    baik: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    rusak_ringan: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    rusak_berat: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  };

  return styles[kondisi] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
};

/**
 * Mendapatkan class Tailwind untuk badge status barang
 * 
 * @param {string} status - 'aktif', 'hilang', 'selesai'
 * @returns {string} Class Tailwind
 */
export const getStatusBadge = (status) => {
  const styles = {
    aktif: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    hilang: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
    selesai: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
  };

  return styles[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
};

/**
 * Mendapatkan label dalam Bahasa Indonesia
 */
export const getKondisiLabel = (kondisi) => {
  const labels = {
    baik: 'Baik',
    rusak_ringan: 'Rusak Ringan',
    rusak_berat: 'Rusak Berat',
  };
  return labels[kondisi] || kondisi;
};

export const getStatusLabel = (status) => {
  const labels = {
    aktif: 'Aktif',
    hilang: 'Hilang',
    selesai: 'Selesai',
  };
  return labels[status] || status;
};