// File: src/pages/Pengecekan.jsx

import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import { formatDate, getTodayString } from '../utils/formatDate';
import { getKondisiBadge, getKondisiLabel } from '../utils/badgeHelper';
import EmptyState from '../components/ui/EmptyState';
import Spinner from '../components/ui/Spinner';
import {
  Search,
  CheckCircle,
  Calendar,
  Package,
  AlertTriangle,
  Clock,
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
        <ImageIcon size={24} className="text-gray-300 dark:text-gray-600" />
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

const Pengecekan = () => {
  const [searchParams] = useSearchParams();
  const preselectedBarangId = searchParams.get('barang_id');
  const navigate = useNavigate();
  const toast = useToast();

  // ============================================
  // STATE
  // ============================================
  const [barangList, setBarangList] = useState([]);
  const [loadingBarang, setLoadingBarang] = useState(true);

  // Form State
  const [form, setForm] = useState({
    barang_id: preselectedBarangId || '',
    tanggal_cek: getTodayString(),
    kondisi_cek: 'baik',
    jumlah_tersedia_cek: '',
    catatan: '',
  });

  // Submit State
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Barang terpilih (untuk info)
  const [selectedBarang, setSelectedBarang] = useState(null);

  // ============================================
  // FETCH DAFTAR BARANG AKTIF (untuk dropdown)
  // ============================================
  useEffect(() => {
    fetchBarangList();
  }, []);

  // Set jumlah_tersedia saat barang dipilih
  useEffect(() => {
    if (form.barang_id && barangList.length > 0) {
      const barang = barangList.find((b) => b.id.toString() === form.barang_id.toString());
      if (barang) {
        setSelectedBarang(barang);
        // Auto-fill jumlah tersedia dengan nilai saat ini
        setForm((prev) => ({
          ...prev,
          jumlah_tersedia_cek: barang.jumlah_tersedia.toString(),
        }));
      }
    } else {
      setSelectedBarang(null);
    }
  }, [form.barang_id, barangList]);

  const fetchBarangList = async () => {
    setLoadingBarang(true);
    try {
      const response = await api.get('/barang', { params: { status: 'aktif' } });
      setBarangList(response.data.data);
    } catch (err) {
      console.error('Gagal memuat daftar barang:', err);
    } finally {
      setLoadingBarang(false);
    }
  };

  // ============================================
  // HANDLE INPUT CHANGE
  // ============================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error untuk field yang diubah
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // ============================================
  // SUBMIT PENGECEKAN
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      await api.post('/pengecekan', {
        barang_id: form.barang_id,
        tanggal_cek: form.tanggal_cek,
        kondisi_cek: form.kondisi_cek,
        jumlah_tersedia_cek: parseInt(form.jumlah_tersedia_cek),
        catatan: form.catatan || '',
      });

      toast.success('Pengecekan berhasil disimpan!');

      // Reset form
      setForm({
        barang_id: '',
        tanggal_cek: getTodayString(),
        kondisi_cek: 'baik',
        jumlah_tersedia_cek: '',
        catatan: '',
      });
      setSelectedBarang(null);

      // Jika dari detail barang, redirect kembali
      if (preselectedBarangId) {
        setTimeout(() => {
          navigate(`/barang/${preselectedBarangId}`);
        }, 500);
      }
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
        toast.error('Validasi gagal. Periksa kembali input.');
      } else {
        toast.error('Gagal menyimpan pengecekan.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================
  // RENDER
  // ============================================
  if (loadingBarang) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (barangList.length === 0) {
    return (
      <EmptyState
        title="Belum ada barang aktif"
        description="Tambahkan barang terlebih dahulu sebelum melakukan pengecekan."
        icon={Package}
        action={
          <button
            onClick={() => navigate('/barang')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Ke Data Barang
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* ============================================
          HEADER
          ============================================ */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
          Pengecekan Barang
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Lakukan inspeksi kondisi barang secara berkala
        </p>
      </div>

      {/* ============================================
          FORM CARD
          ============================================ */}
      <div className="
        bg-white dark:bg-gray-900
        rounded-2xl border border-gray-200 dark:border-gray-700
        p-6
      ">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* ============================================
              PILIH BARANG (DROPDOWN)
              ============================================ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Pilih Barang <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="barang_id"
                value={form.barang_id}
                onChange={handleChange}
                className={`
                  w-full px-3 py-2.5 rounded-lg border appearance-none
                  bg-white dark:bg-gray-800
                  text-gray-900 dark:text-gray-100
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  transition-colors duration-200
                  ${errors.barang_id ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}
                `}
              >
                <option value="">-- Pilih Barang --</option>
                {barangList.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.nama_barang} ({b.kategori}) - Stok: {b.jumlah_tersedia}
                  </option>
                ))}
              </select>
              <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {errors.barang_id && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.barang_id[0]}</p>
            )}
          </div>

          {/* ============================================
              INFO BARANG TERPILIH
              ============================================ */}
          {selectedBarang && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <div className="flex items-start gap-3">
                {/* Foto kecil */}
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shrink-0">
                  <BarangImage
                    item={selectedBarang}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 dark:text-gray-50">
                    {selectedBarang.nama_barang}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getKondisiBadge(selectedBarang.kondisi)}`}>
                      {getKondisiLabel(selectedBarang.kondisi)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Jumlah: {selectedBarang.jumlah_tersedia}/{selectedBarang.jumlah_total}
                    </span>
                  </div>
                  {/* TANGGAL + JAM TERAKHIR DICEK */}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                    <Clock size={11} />
                    Terakhir dicek: {formatDate(selectedBarang.last_checked_at, { withTime: true, emptyText: 'Belum pernah' })}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ============================================
              TANGGAL PENGECEKAN
              ============================================ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tanggal Pengecekan <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                name="tanggal_cek"
                value={form.tanggal_cek}
                onChange={handleChange}
                className={`
                  w-full px-3 py-2.5 rounded-lg border
                  bg-white dark:bg-gray-800
                  text-gray-900 dark:text-gray-100
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  transition-colors duration-200
                  ${errors.tanggal_cek ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}
                `}
              />
              <Calendar size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {errors.tanggal_cek && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.tanggal_cek[0]}</p>
            )}
          </div>

          {/* ============================================
              KONDISI + JUMLAH (2 KOLOM)
              ============================================ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Kondisi Saat Dicek */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Kondisi Saat Dicek <span className="text-red-500">*</span>
              </label>
              <select
                name="kondisi_cek"
                value={form.kondisi_cek}
                onChange={handleChange}
                className={`
                  w-full px-3 py-2.5 rounded-lg border
                  bg-white dark:bg-gray-800
                  text-gray-900 dark:text-gray-100
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  transition-colors duration-200
                  ${errors.kondisi_cek ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}
                `}
              >
                <option value="baik">Baik</option>
                <option value="rusak_ringan">Rusak Ringan</option>
                <option value="rusak_berat">Rusak Berat</option>
              </select>
              {errors.kondisi_cek && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.kondisi_cek[0]}</p>
              )}
            </div>

            {/* Jumlah Tersedia Saat Dicek */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Jumlah Tersedia Saat Dicek <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="jumlah_tersedia_cek"
                value={form.jumlah_tersedia_cek}
                onChange={handleChange}
                min="0"
                placeholder="0"
                className={`
                  w-full px-3 py-2.5 rounded-lg border
                  bg-white dark:bg-gray-800
                  text-gray-900 dark:text-gray-100
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  transition-colors duration-200
                  ${errors.jumlah_tersedia_cek ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}
                `}
              />
              {errors.jumlah_tersedia_cek && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.jumlah_tersedia_cek[0]}</p>
              )}
            </div>
          </div>

          {/* ============================================
              CATATAN
              ============================================ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Catatan
            </label>
            <textarea
              name="catatan"
              value={form.catatan}
              onChange={handleChange}
              rows={3}
              placeholder="Catatan tambahan hasil pengecekan (opsional)"
              className="
                w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600
                bg-white dark:bg-gray-800
                text-gray-900 dark:text-gray-100
                placeholder-gray-400 dark:placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition-colors duration-200
              "
            />
          </div>

          {/* ============================================
              TOMBOL AKSI
              ============================================ */}
          <div className="flex justify-end gap-3 pt-2">
            {/* Tombol Reset */}
            <button
              type="button"
              onClick={() => {
                setForm({
                  barang_id: '',
                  tanggal_cek: getTodayString(),
                  kondisi_cek: 'baik',
                  jumlah_tersedia_cek: '',
                  catatan: '',
                });
                setSelectedBarang(null);
                setErrors({});
              }}
              className="
                px-4 py-2.5 rounded-xl
                border border-gray-300 dark:border-gray-600
                text-gray-700 dark:text-gray-300
                hover:bg-gray-100 dark:hover:bg-gray-800
                text-sm font-medium transition-colors
              "
            >
              Reset
            </button>

            {/* Tombol Simpan */}
            <button
              type="submit"
              disabled={submitting}
              className="
                px-6 py-2.5 rounded-xl
                bg-blue-600 hover:bg-blue-700
                text-white text-sm font-medium
                transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center gap-2
              "
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  Simpan Pengecekan
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ============================================
          TIPS PENGECEKAN
          ============================================ */}
      <div className="
        bg-amber-50 dark:bg-amber-900/20
        border border-amber-200 dark:border-amber-800
        rounded-2xl p-5
      ">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800 dark:text-amber-300 text-sm">
              Tips Pengecekan
            </h3>
            <ul className="mt-2 space-y-1 text-sm text-amber-700 dark:text-amber-400 list-disc list-inside">
              <li>Lakukan pengecekan minimal 3 hari sekali</li>
              <li>Pastikan jumlah tersedia sesuai dengan fisik barang</li>
              <li>Catat kondisi dengan jujur untuk pemantauan yang akurat</li>
              <li>Barang yang tidak dicek lebih dari 3 hari akan muncul di Dashboard</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pengecekan;