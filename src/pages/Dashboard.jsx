// File: src/pages/Dashboard.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatDate';
import { getKondisiBadge, getKondisiLabel } from '../utils/badgeHelper';
import StatCard from '../components/ui/StatCard';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import {
  Package,
  CheckCircle,
  AlertTriangle,
  Wrench,
  Archive,
  Clock,
  ArrowRight,
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
// KOMPONEN GAMBAR KECIL (dengan fallback)
// ============================================
const BarangThumbnail = ({ item }) => {
  const [imgError, setImgError] = useState(false);
  const imageUrl = getImageUrl(item);

  if (!imageUrl || imgError) {
    return (
      <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
        <Package size={20} className="text-gray-400" />
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={item.nama_barang}
      className="w-12 h-12 rounded-lg object-cover shrink-0"
      onError={() => setImgError(true)}
      style={{ imageRendering: 'auto' }}
    />
  );
};

const Dashboard = () => {
  const { user } = useAuth();

  // State
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ambil data dashboard saat halaman pertama dibuka
  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/dashboard');
      setDashboard(response.data.data);
    } catch (err) {
      setError('Gagal memuat data dashboard.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-20 h-20 rounded-2xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center mb-6">
          <AlertTriangle size={40} className="text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-2">
          Gagal Memuat Data
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
        <button
          onClick={fetchDashboard}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (!dashboard) return null;

  const { statistik, perlu_dicek, pengecekan_terbaru } = dashboard;

  // Format tanggal hari ini
  const today = new Date();
  const dateString = today.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* ============================================
          HEADER: SELAMAT DATANG
          ============================================ */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
          Selamat datang, {user?.name || 'Admin'}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {dateString}
        </p>
      </div>

      {/* ============================================
          STATISTIK: 5 KARTU
          ============================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard
          title="Total Aktif"
          value={statistik.total_aktif}
          color="blue"
          icon={Package}
        />
        <StatCard
          title="Kondisi Baik"
          value={statistik.kondisi_baik}
          color="emerald"
          icon={CheckCircle}
        />
        <StatCard
          title="Rusak"
          value={statistik.kondisi_rusak_ringan + statistik.kondisi_rusak_berat}
          color="amber"
          icon={Wrench}
        />
        <StatCard
          title="Hilang"
          value={statistik.total_hilang}
          color="red"
          icon={AlertTriangle}
        />
        <StatCard
          title="Selesai"
          value={statistik.total_selesai}
          color="gray"
          icon={Archive}
        />
      </div>

      {/* ============================================
          DUA KOLOM: PERLU DICEK + AKTIVITAS
          ============================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ============================================
            KIRI: BARANG PERLU DICEK (> 3 HARI)
            ============================================ */}
        <div className="
          bg-white dark:bg-gray-900
          rounded-2xl border border-gray-200 dark:border-gray-700
          overflow-hidden
        ">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Clock size={20} className="text-amber-600 dark:text-amber-400" />
              <h2 className="font-semibold text-gray-900 dark:text-gray-50">
                Perlu Dicek Segera
              </h2>
            </div>
            {perlu_dicek.length > 0 && (
              <span className="
                px-2 py-0.5 rounded-full text-xs font-medium
                bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300
              ">
                {perlu_dicek.length} barang
              </span>
            )}
          </div>

          {/* Body */}
          <div className="p-5">
            {perlu_dicek.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle size={40} className="text-emerald-400 mx-auto mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Semua barang sudah dicek dalam 3 hari terakhir
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {perlu_dicek.map((barang) => (
                  <Link
                    key={barang.id}
                    to={`/barang/${barang.id}`}
                    className="
                      flex items-center gap-3 p-3 rounded-xl
                      hover:bg-gray-50 dark:hover:bg-gray-800
                      transition-colors duration-200
                      group
                    "
                  >
                    {/* Foto / Placeholder */}
                    <BarangThumbnail item={barang} />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-50 truncate">
                        {barang.nama_barang}
                      </p>
                      {/* TANGGAL + JAM TERAKHIR DICEK */}
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                        <Clock size={11} />
                        Terakhir dicek: {formatDate(barang.last_checked_at, { withTime: true, emptyText: 'Belum pernah' })}
                      </p>
                    </div>

                    {/* Icon Arrow */}
                    <ArrowRight size={16} className="text-gray-300 dark:text-gray-600 group-hover:text-blue-500 transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Footer Link */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <Link
              to="/pengecekan"
              className="
                flex items-center justify-center gap-1
                text-sm text-blue-600 dark:text-blue-400
                hover:text-blue-700 dark:hover:text-blue-300
                font-medium transition-colors
              "
            >
              Ke Halaman Pengecekan
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* ============================================
            KANAN: AKTIVITAS PENGECEKAN TERBARU
            ============================================ */}
        <div className="
          bg-white dark:bg-gray-900
          rounded-2xl border border-gray-200 dark:border-gray-700
          overflow-hidden
        ">
          {/* Header */}
          <div className="flex items-center gap-2 p-5 border-b border-gray-200 dark:border-gray-700">
            <Wrench size={20} className="text-blue-600 dark:text-blue-400" />
            <h2 className="font-semibold text-gray-900 dark:text-gray-50">
              Pengecekan Terbaru
            </h2>
          </div>

          {/* Body */}
          <div className="p-5">
            {pengecekan_terbaru.length === 0 ? (
              <EmptyState
                title="Belum ada pengecekan"
                description="Lakukan pengecekan pertama untuk melihat riwayat di sini."
                icon={Clock}
              />
            ) : (
              <div className="space-y-4">
                {pengecekan_terbaru.map((cek) => (
                  <div
                    key={cek.id}
                    className="flex items-start gap-3"
                  >
                    {/* Garis vertikal + dot */}
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                      <div className="w-px h-full bg-gray-200 dark:bg-gray-700 mt-1" />
                    </div>

                    {/* Konten */}
                    <div className="flex-1 pb-4">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`
                          px-2 py-0.5 rounded-full text-xs font-medium
                          ${getKondisiBadge(cek.kondisi_cek)}
                        `}>
                          {getKondisiLabel(cek.kondisi_cek)}
                        </span>
                        {/* TANGGAL + JAM PENGECEKAN */}
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Clock size={11} />
                          {formatDate(cek.tanggal_cek)} oleh {cek.user?.name || 'Admin'}
                        </span>
                      </div>
                      <Link
                        to={`/barang/${cek.barang_id}`}
                        className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {cek.barang?.nama_barang || 'Barang'}
                      </Link>
                      {cek.catatan && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {cek.catatan}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;