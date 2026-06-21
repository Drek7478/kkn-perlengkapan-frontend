// File: src/utils/formatDate.js

/**
 * Format tanggal ke format Indonesia yang mudah dibaca
 * 
 * @param {string|Date} date - Tanggal yang akan diformat
 * @param {Object} options - Opsi tambahan
 * @returns {string} Tanggal yang sudah diformat
 * 
 * Contoh:
 * formatDate('2024-01-15') → '15 Januari 2024'
 * formatDate('2024-01-15', { withTime: true }) → '15 Januari 2024, 14:30'
 * formatDate(null) → 'Belum ada'
 * formatDate('2024-01-15', { relative: true }) → '3 hari yang lalu'
 */

export const formatDate = (date, options = {}) => {
  if (!date) return options.emptyText || 'Belum ada';

  const dateObj = new Date(date);

  // Cek apakah tanggal valid
  if (isNaN(dateObj.getTime())) return 'Tanggal tidak valid';

  // Format relatif (berapa hari yang lalu)
  if (options.relative) {
    const now = new Date();
    const diffTime = now - dateObj;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hari ini';
    if (diffDays === 1) return 'Kemarin';
    if (diffDays < 30) return `${diffDays} hari yang lalu`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} bulan yang lalu`;
    return `${Math.floor(diffDays / 365)} tahun yang lalu`;
  }

  // Format standar: 15 Januari 2024
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const day = dateObj.getDate();
  const month = months[dateObj.getMonth()];
  const year = dateObj.getFullYear();

  let formatted = `${day} ${month} ${year}`;

  // Jika withTime = true, tambahkan jam
  if (options.withTime) {
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    formatted += `, ${hours}:${minutes}`;
  }

  return formatted;
};

/**
 * Format tanggal untuk input type="date" (YYYY-MM-DD)
 */
export const toInputDate = (date) => {
  if (!date) return '';
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  return dateObj.toISOString().split('T')[0];
};

/**
 * Mendapatkan tanggal hari ini dalam format YYYY-MM-DD
 */
export const getTodayString = () => {
  return new Date().toISOString().split('T')[0];
};