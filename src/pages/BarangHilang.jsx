// File: src/pages/BarangHilang.jsx

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
  AlertTriangle,
  RotateCcw,
  Calendar,
  FileText,
  CheckCircle,
} from 'lucide-react';

const BarangHilang = () => {
  const toast = useToast();

  // State
  const [barangHilang, setBarangHilang] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  // Pulihkan
  const [showPulihkanDialog, setShowPulihkanDialog] = useState(false);
  const [pulihkanTarget, setPulihkanTarget] = useState(null);
  const [pulihkanLoading, setPulihkanLoading] = useState(false);

  // ============================================
  // FETCH DATA
  // ============================================
  const fetchBarangHilang = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/barang-hilang');
      setBarangHilang(response.data.data);
      setTotal(response.data.total);
    } catch (err) {
      setError('Gagal memuat data barang hilang.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBarangHilang();
  }, [fetchBarangHilang]);

  // ============================================
  // PULIHKAN BARANG
  // ============================================
  const openPulihkanDialog = (item) => {
    setPulihkanTarget(item);
    setShowPulihkanDialog(true);
  };

  const handlePulihkan = async () => {
    if (!pulihkanTarget) return;

    setPulihkanLoading(true);

    try {
      await api.patch(`/barang/${pulihkanTarget.id}/pulihkan`);
      toast.success(`${pulihkanTarget.nama_barang} berhasil dipulihkan!`);
      setShowPulihkanDialog(false);
      setPulihkanTarget(null);
      fetchBarangHilang();
    } catch (err) {
      toast.error('Gagal memulihkan barang.');
    } finally {
      setPulihkanLoading(false);
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
          onClick={fetchBarangHilang}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  // ============================================
  // EMPTY STATE
  // ============================================
  if (barangHilang.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            Barang Hilang
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Daftar barang yang ditandai sebagai hilang
          </p>
        </div>

        <EmptyState
          title="Tidak ada barang hilang"
          description="Semua barang dalam keadaan aman. Barang yang ditandai hilang akan muncul di sini."
          icon={CheckCircle}
        />
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
            Barang Hilang
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {total} barang ditandai sebagai hilang
          </p>
        </div>
        <span className="
          inline-flex items-center gap-2
          px-3 py-1.5 rounded-full
          bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300
          text-sm font-medium
        ">
          <AlertTriangle size={16} />
          {total} Barang Hilang
        </span>
      </div>

      {/* Tabel */}
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
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                  Tanggal Hilang
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                  Kondisi Terakhir
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {barangHilang.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  {/* Foto */}
                  <td className="px-4 py-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                      {item.foto_url ? (
                        <img
                          src={item.foto_url}
                          alt={item.nama_barang}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={20} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Nama Barang */}
                  <td className="px-4 py-3">
                    <Link
                      to={`/barang/${item.id}`}
                      className="text-sm font-medium text-gray-900 dark:text-gray-50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {item.nama_barang}
                    </Link>
                    {item.keterangan && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                        {item.keterangan}
                      </p>
                    )}
                  </td>

                  {/* Kategori */}
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {item.kategori}
                    </span>
                  </td>

                  {/* Tanggal Hilang */}
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-red-400" />
                      <span className="text-sm text-red-600 dark:text-red-400">
                        {formatDate(item.tanggal_hilang)}
                      </span>
                    </div>
                  </td>

                  {/* Kondisi Terakhir */}
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getKondisiBadge(item.kondisi)}`}>
                      {getKondisiLabel(item.kondisi)}
                    </span>
                  </td>

                  {/* Aksi: Pulihkan */}
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openPulihkanDialog(item)}
                      className="
                        inline-flex items-center gap-1.5
                        px-3 py-1.5 rounded-lg
                        bg-emerald-100 text-emerald-700
                        dark:bg-emerald-900/40 dark:text-emerald-300
                        hover:bg-emerald-200 dark:hover:bg-emerald-900/60
                        text-xs font-medium transition-colors
                      "
                    >
                      <RotateCcw size={14} />
                      Pulihkan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog Konfirmasi Pulihkan */}
      <ConfirmDialog
        isOpen={showPulihkanDialog}
        onClose={() => {
          setShowPulihkanDialog(false);
          setPulihkanTarget(null);
        }}
        onConfirm={handlePulihkan}
        title="Pulihkan Barang?"
        message={`Apakah Anda yakin ingin memulihkan "${pulihkanTarget?.nama_barang}"? Barang akan kembali ke status aktif.`}
        variant="warning"
        confirmText="Pulihkan"
        loading={pulihkanLoading}
      />
    </div>
  );
};

export default BarangHilang;