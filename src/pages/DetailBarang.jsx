// File: src/pages/DetailBarang.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import { formatDate, getTodayString } from '../utils/formatDate';
import { getKondisiBadge, getStatusBadge, getKondisiLabel, getStatusLabel } from '../utils/badgeHelper';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import Spinner from '../components/ui/Spinner';
import Badge from '../components/ui/Badge';
import {
  ArrowLeft,
  Edit,
  AlertTriangle,
  CheckCircle,
  Archive,
  Search,
  Clock,
  Package,
  User,
  Calendar,
  FileText,
} from 'lucide-react';

const DetailBarang = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  // State
  const [barang, setBarang] = useState(null);
  const [pengecekan, setPengecekan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Aksi Loading
  const [actionLoading, setActionLoading] = useState(false);

  // Confirm Dialog
  const [confirmAction, setConfirmAction] = useState(null); // 'hilang' | 'selesai' | null

  // ============================================
  // FETCH DATA
  // ============================================
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/barang/${id}`);
      setBarang(response.data.data);
      setPengecekan(response.data.data.pengecekan || []);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Barang tidak ditemukan.');
      } else {
        setError('Gagal memuat data barang.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // ============================================
  // AKSI: TANDAI HILANG
  // ============================================
  const handleTandaiHilang = async () => {
    setActionLoading(true);
    try {
      await api.patch(`/barang/${id}/tandai-hilang`);
      toast.success('Barang berhasil ditandai sebagai hilang.');
      setConfirmAction(null);
      fetchData();
    } catch (err) {
      toast.error('Gagal menandai barang hilang.');
    } finally {
      setActionLoading(false);
    }
  };

  // ============================================
  // AKSI: PULIHKAN
  // ============================================
  const handlePulihkan = async () => {
    setActionLoading(true);
    try {
      await api.patch(`/barang/${id}/pulihkan`);
      toast.success('Barang berhasil dipulihkan.');
      fetchData();
    } catch (err) {
      toast.error('Gagal memulihkan barang.');
    } finally {
      setActionLoading(false);
    }
  };

  // ============================================
  // AKSI: SELESAIKAN
  // ============================================
  const handleSelesaikan = async () => {
    setActionLoading(true);
    try {
      await api.patch(`/barang/${id}/selesaikan`);
      toast.success('Barang berhasil diselesaikan.');
      setConfirmAction(null);
      fetchData();
    } catch (err) {
      toast.error('Gagal menyelesaikan barang.');
    } finally {
      setActionLoading(false);
    }
  };

  // ============================================
  // AKSI: PENGECEKAN CEPAT
  // ============================================
  const handleCekSekarang = () => {
    navigate(`/pengecekan?barang_id=${id}`);
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
        <div className="w-20 h-20 rounded-2xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center mb-6">
          <AlertTriangle size={40} className="text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-2">
          {error}
        </h2>
        <button
          onClick={() => navigate('/barang')}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Kembali ke Data Barang
        </button>
      </div>
    );
  }

  if (!barang) return null;

  return (
    <div className="space-y-6">
      {/* ============================================
          BREADCRUMB & NAVIGASI
          ============================================ */}
      <div className="flex items-center gap-4">
        <Link
          to="/barang"
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <nav className="flex items-center gap-1 text-sm text-gray-400 dark:text-gray-500">
            <Link to="/barang" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Data Barang
            </Link>
            <span>/</span>
            <span className="text-gray-600 dark:text-gray-400">{barang.nama_barang}</span>
          </nav>
        </div>
      </div>

      {/* ============================================
          KONTEN UTAMA: FOTO + INFO
          ============================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Foto */}
        <div className="lg:col-span-1">
          <div className="
            bg-white dark:bg-gray-900
            rounded-2xl border border-gray-200 dark:border-gray-700
            overflow-hidden
          ">
            {barang.foto_url ? (
              <img
                src={barang.foto_url}
                alt={barang.nama_barang}
                className="w-full aspect-[4/3] object-cover"
              />
            ) : (
              <div className="w-full aspect-[4/3] bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Package size={64} className="text-gray-300 dark:text-gray-600" />
              </div>
            )}
          </div>
        </div>

        {/* Info Detail */}
        <div className="lg:col-span-2">
          <div className="
            bg-white dark:bg-gray-900
            rounded-2xl border border-gray-200 dark:border-gray-700
            p-6
          ">
            {/* Nama & Badge */}
            <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                {barang.nama_barang}
              </h1>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getKondisiBadge(barang.kondisi)}`}>
                  {getKondisiLabel(barang.kondisi)}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(barang.status)}`}>
                  {getStatusLabel(barang.status)}
                </span>
              </div>
            </div>

            {/* Grid Info */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Kategori</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-50">{barang.kategori}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Jumlah Total</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-50">{barang.jumlah_total}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Jumlah Tersedia</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-50">{barang.jumlah_tersedia}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Terakhir Dicek</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                  {formatDate(barang.last_checked_at, { withTime: true, emptyText: 'Belum pernah' })}
                </p>
              </div>
              {barang.tanggal_hilang && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Tanggal Hilang</p>
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">{formatDate(barang.tanggal_hilang)}</p>
                </div>
              )}
              {barang.tanggal_selesai && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Tanggal Selesai</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-50">{formatDate(barang.tanggal_selesai)}</p>
                </div>
              )}
            </div>

            {/* Keterangan */}
            {barang.keterangan && (
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Keterangan</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{barang.keterangan}</p>
              </div>
            )}

            {/* Tombol Aksi */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              {barang.status === 'aktif' && (
                <>
                  <button
                    onClick={handleCekSekarang}
                    className="
                      inline-flex items-center gap-2
                      px-4 py-2 rounded-xl
                      bg-blue-600 hover:bg-blue-700 text-white
                      text-sm font-medium transition-colors
                    "
                  >
                    <Search size={16} />
                    Cek Sekarang
                  </button>
                  <button
                    onClick={() => setConfirmAction('hilang')}
                    className="
                      inline-flex items-center gap-2
                      px-4 py-2 rounded-xl
                      bg-amber-600 hover:bg-amber-700 text-white
                      text-sm font-medium transition-colors
                    "
                  >
                    <AlertTriangle size={16} />
                    Tandai Hilang
                  </button>
                  <button
                    onClick={() => setConfirmAction('selesai')}
                    className="
                      inline-flex items-center gap-2
                      px-4 py-2 rounded-xl
                      bg-gray-600 hover:bg-gray-700 text-white
                      text-sm font-medium transition-colors
                    "
                  >
                    <Archive size={16} />
                    Selesaikan
                  </button>
                </>
              )}

              {barang.status === 'hilang' && (
                <button
                  onClick={handlePulihkan}
                  disabled={actionLoading}
                  className="
                    inline-flex items-center gap-2
                    px-4 py-2 rounded-xl
                    bg-emerald-600 hover:bg-emerald-700 text-white
                    text-sm font-medium transition-colors
                    disabled:opacity-50
                  "
                >
                  <CheckCircle size={16} />
                  Pulihkan Barang
                </button>
              )}

              {barang.status === 'selesai' && (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  Barang sudah diarsipkan dan tidak dapat diubah.
                </p>
              )}

              {barang.status !== 'selesai' && (
                <Link
                  to={`/barang?edit=${barang.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/barang');
                  }}
                  className="
                    inline-flex items-center gap-2
                    px-4 py-2 rounded-xl
                    border border-gray-300 dark:border-gray-600
                    hover:bg-gray-100 dark:hover:bg-gray-800
                    text-gray-700 dark:text-gray-300
                    text-sm font-medium transition-colors
                  "
                >
                  <Edit size={16} />
                  Edit Barang
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================
          RIWAYAT PENGECEKAN
          ============================================ */}
      <div className="
        bg-white dark:bg-gray-900
        rounded-2xl border border-gray-200 dark:border-gray-700
        overflow-hidden
      ">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-gray-50">
            Riwayat Pengecekan
          </h2>
        </div>

        <div className="p-5">
          {pengecekan.length === 0 ? (
            <EmptyState
              title="Belum pernah dicek"
              description="Lakukan pengecekan pertama untuk melihat riwayat di sini."
              icon={Search}
              action={
                <button
                  onClick={handleCekSekarang}
                  className="
                    inline-flex items-center gap-2
                    px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white
                    rounded-lg text-sm font-medium transition-colors
                  "
                >
                  <Search size={16} />
                  Cek Sekarang
                </button>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      Tanggal
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      Kondisi
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      Jumlah
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase hidden md:table-cell">
                      Pengecek
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase hidden md:table-cell">
                      Catatan
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {pengecekan.map((cek) => (
                    <tr key={cek.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {formatDate(cek.tanggal_cek)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getKondisiBadge(cek.kondisi_cek)}`}>
                          {getKondisiLabel(cek.kondisi_cek)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {cek.jumlah_tersedia_cek}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {cek.user?.name || 'Admin'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {cek.catatan || '-'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ============================================
          DIALOG KONFIRMASI
          ============================================ */}
      <ConfirmDialog
        isOpen={confirmAction === 'hilang'}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleTandaiHilang}
        title="Tandai Barang Hilang?"
        message={`Apakah Anda yakin ingin menandai "${barang.nama_barang}" sebagai hilang?`}
        variant="warning"
        confirmText="Tandai Hilang"
        loading={actionLoading}
      />

      <ConfirmDialog
        isOpen={confirmAction === 'selesai'}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleSelesaikan}
        title="Selesaikan Barang?"
        message={`Apakah Anda yakin ingin menyelesaikan "${barang.nama_barang}"? Barang akan diarsipkan dan tidak dapat diedit.`}
        variant="warning"
        confirmText="Selesaikan"
        loading={actionLoading}
      />
    </div>
  );
};

export default DetailBarang;