// File: src/pages/BarangSelesai.jsx

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/formatDate';
import { getKondisiBadge, getKondisiLabel } from '../utils/badgeHelper';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import Spinner from '../components/ui/Spinner';
import Badge from '../components/ui/Badge';
import {
  Package,
  Archive,
  CheckCircle,
  Calendar,
  FileText,
  ArchiveRestore,
  Image as ImageIcon,
} from 'lucide-react';

// ============================================
// HELPER: Dapatkan URL gambar yang benar
// ============================================
const getImageUrl = (item) => {
  // Gunakan foto_url dari accessor Laravel jika ada
  if (item?.foto_url) return item.foto_url;
  
  // Fallback: buat manual jika hanya ada path foto
  if (item?.foto) {
    return `${api.defaults.baseURL.replace('/api', '')}/storage/${item.foto}`;
  }
  
  return null;
};

// ============================================
// KOMPONEN GAMBAR (dengan fallback)
// ============================================
const BarangImage = ({ item, className = '' }) => {
  const [imgError, setImgError] = useState(false);
  const imageUrl = getImageUrl(item);

  if (!imageUrl || imgError) {
    return (
      <div className={`bg-gray-100 dark:bg-gray-800 flex items-center justify-center ${className}`}>
        <ImageIcon size={20} className="text-gray-300 dark:text-gray-600" />
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={item.nama_barang}
      className={className}
      onError={() => setImgError(true)}
      style={{ imageRendering: 'auto' }}
    />
  );
};

const BarangSelesai = () => {
  const toast = useToast();

  // State
  const [barangSelesai, setBarangSelesai] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  // Selesaikan Semua
  const [showSelesaiSemuaDialog, setShowSelesaiSemuaDialog] = useState(false);
  const [selesaiSemuaLoading, setSelesaiSemuaLoading] = useState(false);

  // Cek jumlah barang aktif
  const [totalAktif, setTotalAktif] = useState(0);

  // ============================================
  // FETCH DATA
  // ============================================
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch barang selesai
      const response = await api.get('/barang-selesai');
      setBarangSelesai(response.data.data);
      setTotal(response.data.total);

      // Fetch total barang aktif (untuk tombol "Selesaikan Semua")
      const aktifResponse = await api.get('/barang', { params: { status: 'aktif' } });
      setTotalAktif(aktifResponse.data.total || 0);
    } catch (err) {
      setError('Gagal memuat data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ============================================
  // SELESAIKAN SEMUA
  // ============================================
  const handleSelesaikanSemua = async () => {
    setSelesaiSemuaLoading(true);

    try {
      const response = await api.post('/barang/selesaikan-semua');
      toast.success(response.data.message);
      setShowSelesaiSemuaDialog(false);
      fetchData();
    } catch (err) {
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Gagal menyelesaikan semua barang.');
      }
    } finally {
      setSelesaiSemuaLoading(false);
    }
  };

  // ============================================
  // LOADING STATE
  // ============================================
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  // ============================================
  // ERROR STATE
  // ============================================
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            Barang Selesai
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Arsip barang yang sudah tidak digunakan
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="
            inline-flex items-center gap-2
            px-3 py-1.5 rounded-full
            bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400
            text-sm font-medium
          ">
            <Archive size={16} />
            {total} Arsip
          </span>

          {/* Tombol Selesaikan Semua (hanya jika ada barang aktif) */}
          {totalAktif > 0 && (
            <button
              onClick={() => setShowSelesaiSemuaDialog(true)}
              className="
                inline-flex items-center gap-2
                px-4 py-2 rounded-xl
                bg-amber-600 hover:bg-amber-700 text-white
                text-sm font-medium transition-colors
              "
            >
              <ArchiveRestore size={18} />
              Selesaikan Semua
            </button>
          )}
        </div>
      </div>

      {/* Tabel / Empty */}
      {barangSelesai.length === 0 ? (
        <EmptyState
          title="Belum ada barang yang diselesaikan"
          description="Barang yang ditandai sebagai 'Selesai' akan muncul di sini sebagai arsip."
          icon={Archive}
        />
      ) : (
        <div className="
          bg-white dark:bg-gray-900
          rounded-2xl border border-gray-200 dark:border-gray-700
          overflow-hidden
        ">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Foto
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Nama Barang
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                    Kategori
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                    Kondisi Akhir
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                    Tanggal Selesai
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                    Catatan
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {barangSelesai.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    {/* Foto — DENGAN FALLBACK */}
                    <td className="px-4 py-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <BarangImage
                          item={item}
                          className="w-full h-full object-cover opacity-75"
                        />
                      </div>
                    </td>

                    {/* Nama Barang */}
                    <td className="px-4 py-3">
                      <Link
                        to={`/barang/${item.id}`}
                        className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {item.nama_barang}
                      </Link>
                    </td>

                    {/* Kategori */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {item.kategori}
                      </span>
                    </td>

                    {/* Kondisi Akhir */}
                    <td className="px-4 py-3 text-center hidden sm:table-cell">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getKondisiBadge(item.kondisi)}`}>
                        {getKondisiLabel(item.kondisi)}
                      </span>
                    </td>

                    {/* Tanggal Selesai */}
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(item.tanggal_selesai)}
                        </span>
                      </div>
                    </td>

                    {/* Catatan */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                        {item.catatan_selesai || '-'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Dialog Konfirmasi Selesaikan Semua */}
      <ConfirmDialog
        isOpen={showSelesaiSemuaDialog}
        onClose={() => setShowSelesaiSemuaDialog(false)}
        onConfirm={handleSelesaikanSemua}
        title="Selesaikan Semua Barang?"
        message={`Apakah Anda yakin ingin menyelesaikan SEMUA barang aktif (${totalAktif} barang)? Semua barang akan diarsipkan dan tidak dapat diedit.`}
        variant="warning"
        confirmText="Selesaikan Semua"
        loading={selesaiSemuaLoading}
      />
    </div>
  );
};

export default BarangSelesai;