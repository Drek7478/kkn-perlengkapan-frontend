// File: src/pages/Barang.jsx

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import { getKondisiBadge, getStatusBadge, getKondisiLabel, getStatusLabel } from '../utils/badgeHelper';
import { formatDate } from '../utils/formatDate';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import FotoUpload from '../components/ui/FotoUpload';
import EmptyState from '../components/ui/EmptyState';
import Spinner from '../components/ui/Spinner';
import Badge from '../components/ui/Badge';
import {
  Plus,
  Search,
  Grid3X3,
  List,
  Edit,
  Trash2,
  Eye,
  Package,
  Filter,
} from 'lucide-react';

// ============================================
// KONSTANTA
// ============================================
const KATEGORI_LIST = [
  'Elektronik',
  'Alat Tulis',
  'Dokumentasi',
  'Medis',
  'Logistik',
  'Transportasi',
  'Lainnya',
];

const KONDISI_OPTIONS = [
  { value: '', label: 'Semua Kondisi' },
  { value: 'baik', label: 'Baik' },
  { value: 'rusak_ringan', label: 'Rusak Ringan' },
  { value: 'rusak_berat', label: 'Rusak Berat' },
];

const Barang = () => {
  const toast = useToast();

  // ============================================
  // STATE
  // ============================================
  const [barang, setBarang] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  // Filter & Search
  const [search, setSearch] = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  const [filterKondisi, setFilterKondisi] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' atau 'table'

  // Modal Tambah
  const [showAddModal, setShowAddModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addErrors, setAddErrors] = useState({});

  // Modal Edit
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editErrors, setEditErrors] = useState({});

  // Hapus
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Form State (untuk tambah & edit)
  const [form, setForm] = useState({
    nama_barang: '',
    kategori: '',
    jumlah_total: '',
    jumlah_tersedia: '',
    kondisi: 'baik',
    keterangan: '',
  });
  const [fotoFile, setFotoFile] = useState(null);

  // ============================================
  // FETCH DATA
  // ============================================
  const fetchBarang = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {};
      if (search) params.search = search;
      if (filterKategori) params.kategori = filterKategori;
      if (filterKondisi) params.kondisi = filterKondisi;

      const response = await api.get('/barang', { params });
      setBarang(response.data.data);
      setTotal(response.data.total);
    } catch (err) {
      setError('Gagal memuat data barang.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, filterKategori, filterKondisi]);

  useEffect(() => {
    fetchBarang();
  }, [fetchBarang]);

  // ============================================
  // RESET FORM
  // ============================================
  const resetForm = () => {
    setForm({
      nama_barang: '',
      kategori: '',
      jumlah_total: '',
      jumlah_tersedia: '',
      kondisi: 'baik',
      keterangan: '',
    });
    setFotoFile(null);
    setAddErrors({});
    setEditErrors({});
  };

  // ============================================
  // HANDLE INPUT CHANGE
  // ============================================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ============================================
  // TAMBAH BARANG
  // ============================================
  const handleAdd = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setAddErrors({});

    try {
      const formData = new FormData();
      formData.append('nama_barang', form.nama_barang);
      formData.append('kategori', form.kategori);
      formData.append('jumlah_total', form.jumlah_total);
      formData.append('jumlah_tersedia', form.jumlah_tersedia);
      formData.append('kondisi', form.kondisi);
      formData.append('keterangan', form.keterangan || '');

      if (fotoFile) {
        formData.append('foto', fotoFile);
      }

      await api.post('/barang', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Barang berhasil ditambahkan!');
      setShowAddModal(false);
      resetForm();
      fetchBarang();
    } catch (err) {
      if (err.response?.status === 422) {
        setAddErrors(err.response.data.errors || {});
        toast.error('Validasi gagal. Periksa kembali input.');
      } else {
        toast.error('Gagal menambah barang.');
      }
    } finally {
      setAddLoading(false);
    }
  };

  // ============================================
  // BUKA MODAL EDIT
  // ============================================
  const openEditModal = (item) => {
    setEditData(item);
    setForm({
      nama_barang: item.nama_barang,
      kategori: item.kategori,
      jumlah_total: item.jumlah_total.toString(),
      jumlah_tersedia: item.jumlah_tersedia.toString(),
      kondisi: item.kondisi,
      keterangan: item.keterangan || '',
    });
    setFotoFile(null);
    setEditErrors({});
    setShowEditModal(true);
  };

  // ============================================
  // EDIT BARANG
  // ============================================
  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editData) return;

    setEditLoading(true);
    setEditErrors({});

    try {
      const formData = new FormData();
      formData.append('_method', 'PUT');
      formData.append('nama_barang', form.nama_barang);
      formData.append('kategori', form.kategori);
      formData.append('jumlah_total', form.jumlah_total);
      formData.append('jumlah_tersedia', form.jumlah_tersedia);
      formData.append('kondisi', form.kondisi);
      formData.append('keterangan', form.keterangan || '');

      if (fotoFile) {
        formData.append('foto', fotoFile);
      }

      await api.post(`/barang/${editData.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Barang berhasil diperbarui!');
      setShowEditModal(false);
      setEditData(null);
      resetForm();
      fetchBarang();
    } catch (err) {
      if (err.response?.status === 422) {
        setEditErrors(err.response.data.errors || {});
        toast.error('Validasi gagal. Periksa kembali input.');
      } else {
        toast.error('Gagal memperbarui barang.');
      }
    } finally {
      setEditLoading(false);
    }
  };

  // ============================================
  // HAPUS BARANG
  // ============================================
  const openDeleteDialog = (item) => {
    setDeleteTarget(item);
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleteLoading(true);

    try {
      await api.delete(`/barang/${deleteTarget.id}`);
      toast.success('Barang berhasil dihapus!');
      setShowDeleteDialog(false);
      setDeleteTarget(null);
      fetchBarang();
    } catch (err) {
      toast.error('Gagal menghapus barang.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // ============================================
  // RENDER: FORM BARANG (untuk Tambah & Edit)
  // ============================================
  const renderForm = (errors, isEdit = false) => (
    <form onSubmit={isEdit ? handleEdit : handleAdd} className="space-y-4">
      {/* Nama Barang */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Nama Barang <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="nama_barang"
          value={form.nama_barang}
          onChange={handleInputChange}
          placeholder="Masukkan nama barang"
          className={`
            w-full px-3 py-2 rounded-lg border
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-colors duration-200
            ${errors.nama_barang ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}
          `}
        />
        {errors.nama_barang && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.nama_barang[0]}</p>
        )}
      </div>

      {/* Kategori */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Kategori <span className="text-red-500">*</span>
        </label>
        <select
          name="kategori"
          value={form.kategori}
          onChange={handleInputChange}
          className={`
            w-full px-3 py-2 rounded-lg border
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-colors duration-200
            ${errors.kategori ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}
          `}
        >
          <option value="">Pilih Kategori</option>
          {KATEGORI_LIST.map((kat) => (
            <option key={kat} value={kat}>{kat}</option>
          ))}
        </select>
        {errors.kategori && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.kategori[0]}</p>
        )}
      </div>

      {/* Jumlah Total & Tersedia */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Jumlah Total <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="jumlah_total"
            value={form.jumlah_total}
            onChange={handleInputChange}
            min="0"
            placeholder="0"
            className={`
              w-full px-3 py-2 rounded-lg border
              bg-white dark:bg-gray-800
              text-gray-900 dark:text-gray-100
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-colors duration-200
              ${errors.jumlah_total ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}
            `}
          />
          {errors.jumlah_total && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.jumlah_total[0]}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Jumlah Tersedia <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="jumlah_tersedia"
            value={form.jumlah_tersedia}
            onChange={handleInputChange}
            min="0"
            placeholder="0"
            className={`
              w-full px-3 py-2 rounded-lg border
              bg-white dark:bg-gray-800
              text-gray-900 dark:text-gray-100
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-colors duration-200
              ${errors.jumlah_tersedia ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}
            `}
          />
          {errors.jumlah_tersedia && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.jumlah_tersedia[0]}</p>
          )}
        </div>
      </div>

      {/* Kondisi */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Kondisi <span className="text-red-500">*</span>
        </label>
        <select
          name="kondisi"
          value={form.kondisi}
          onChange={handleInputChange}
          className={`
            w-full px-3 py-2 rounded-lg border
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-colors duration-200
            ${errors.kondisi ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}
          `}
        >
          <option value="baik">Baik</option>
          <option value="rusak_ringan">Rusak Ringan</option>
          <option value="rusak_berat">Rusak Berat</option>
        </select>
        {errors.kondisi && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.kondisi[0]}</p>
        )}
      </div>

      {/* Upload Foto */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Foto Barang
        </label>
        <FotoUpload
          file={fotoFile}
          onChange={setFotoFile}
          existingFotoUrl={isEdit ? editData?.foto_url : null}
          error={errors.foto ? errors.foto[0] : ''}
        />
      </div>

      {/* Keterangan */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Keterangan
        </label>
        <textarea
          name="keterangan"
          value={form.keterangan}
          onChange={handleInputChange}
          rows={3}
          placeholder="Keterangan tambahan (opsional)"
          className="
            w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-colors duration-200
          "
        />
      </div>

      {/* Tombol Submit */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => {
            isEdit ? setShowEditModal(false) : setShowAddModal(false);
            resetForm();
          }}
          className="
            px-4 py-2 rounded-lg
            bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800
            text-gray-700 dark:text-gray-300
            border border-gray-300 dark:border-gray-600
            text-sm font-medium transition-colors
          "
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={addLoading || editLoading}
          className="
            px-4 py-2 rounded-lg
            bg-blue-600 hover:bg-blue-700
            text-white text-sm font-medium
            transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center gap-2
          "
        >
          {(addLoading || editLoading) && (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
          {isEdit ? 'Simpan Perubahan' : 'Tambah Barang'}
        </button>
      </div>
    </form>
  );

  // ============================================
  // RENDER: CARD GRID VIEW
  // ============================================
  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {barang.map((item) => (
        <div
          key={item.id}
          className="
            bg-white dark:bg-gray-900
            rounded-xl border border-gray-200 dark:border-gray-700
            shadow-sm hover:shadow-md
            transition-all duration-200
            group
          "
        >
          {/* Foto */}
          <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-800 rounded-t-xl overflow-hidden relative">
            {item.foto_url ? (
              <img
                src={item.foto_url}
                alt={item.nama_barang}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package size={48} className="text-gray-300 dark:text-gray-600" />
              </div>
            )}

            {/* Overlay Aksi (muncul saat hover) */}
            <div className="
              absolute inset-0 bg-black/0 group-hover:bg-black/40
              flex items-center justify-center gap-2
              transition-all duration-200 opacity-0 group-hover:opacity-100
            ">
              <Link
                to={`/barang/${item.id}`}
                className="p-2 bg-white rounded-lg hover:bg-blue-50 transition-colors"
                title="Lihat Detail"
              >
                <Eye size={18} className="text-gray-700" />
              </Link>
              <button
                onClick={() => openEditModal(item)}
                className="p-2 bg-white rounded-lg hover:bg-amber-50 transition-colors"
                title="Edit"
              >
                <Edit size={18} className="text-amber-600" />
              </button>
              <button
                onClick={() => openDeleteDialog(item)}
                className="p-2 bg-white rounded-lg hover:bg-red-50 transition-colors"
                title="Hapus"
              >
                <Trash2 size={18} className="text-red-600" />
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-medium text-gray-900 dark:text-gray-50 line-clamp-1">
                {item.nama_barang}
              </h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              {item.kategori}
            </p>

            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getKondisiBadge(item.kondisi)}`}>
                {getKondisiLabel(item.kondisi)}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}>
                {getStatusLabel(item.status)}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {item.jumlah_tersedia}/{item.jumlah_total}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // ============================================
  // RENDER: TABEL VIEW
  // ============================================
  const renderTableView = () => (
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
                Jumlah
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Kondisi
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {barang.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                {/* Foto */}
                <td className="px-4 py-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {item.foto_url ? (
                      <img src={item.foto_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={16} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                </td>

                {/* Nama */}
                <td className="px-4 py-3">
                  <Link
                    to={`/barang/${item.id}`}
                    className="text-sm font-medium text-gray-900 dark:text-gray-50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {item.nama_barang}
                  </Link>
                </td>

                {/* Kategori */}
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{item.kategori}</span>
                </td>

                {/* Jumlah */}
                <td className="px-4 py-3 text-center hidden sm:table-cell">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {item.jumlah_tersedia}/{item.jumlah_total}
                  </span>
                </td>

                {/* Kondisi */}
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getKondisiBadge(item.kondisi)}`}>
                    {getKondisiLabel(item.kondisi)}
                  </span>
                </td>

                {/* Status */}
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}>
                    {getStatusLabel(item.status)}
                  </span>
                </td>

                {/* Aksi */}
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      to={`/barang/${item.id}`}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      title="Lihat Detail"
                    >
                      <Eye size={16} />
                    </Link>
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => openDeleteDialog(item)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ============================================
  // RENDER UTAMA
  // ============================================
  return (
    <div className="space-y-6">
      {/* ============================================
          HEADER: JUDUL + TOMBOL TAMBAH
          ============================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            Data Barang
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {total} barang ditemukan
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="
            inline-flex items-center gap-2
            px-4 py-2.5 rounded-xl
            bg-blue-600 hover:bg-blue-700
            text-white font-medium text-sm
            transition-colors duration-200
            shadow-sm
          "
        >
          <Plus size={18} />
          Tambah Barang
        </button>
      </div>

      {/* ============================================
          TOOLBAR: SEARCH + FILTER + TOGGLE VIEW
          ============================================ */}
      <div className="
        bg-white dark:bg-gray-900
        rounded-2xl border border-gray-200 dark:border-gray-700
        p-4
      ">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari barang..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full pl-10 pr-3 py-2 rounded-lg border
                bg-white dark:bg-gray-800
                text-gray-900 dark:text-gray-100
                border-gray-300 dark:border-gray-600
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition-colors duration-200
                text-sm
              "
            />
          </div>

          {/* Filter Kategori */}
          <select
            value={filterKategori}
            onChange={(e) => setFilterKategori(e.target.value)}
            className="
              px-3 py-2 rounded-lg border
              bg-white dark:bg-gray-800
              text-gray-900 dark:text-gray-100
              border-gray-300 dark:border-gray-600
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-colors duration-200
              text-sm
            "
          >
            <option value="">Semua Kategori</option>
            {KATEGORI_LIST.map((kat) => (
              <option key={kat} value={kat}>{kat}</option>
            ))}
          </select>

          {/* Filter Kondisi */}
          <select
            value={filterKondisi}
            onChange={(e) => setFilterKondisi(e.target.value)}
            className="
              px-3 py-2 rounded-lg border
              bg-white dark:bg-gray-800
              text-gray-900 dark:text-gray-100
              border-gray-300 dark:border-gray-600
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-colors duration-200
              text-sm
            "
          >
            {KONDISI_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* Toggle View */}
          <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`
                p-2 transition-colors
                ${viewMode === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }
              `}
              title="Tampilan Grid"
            >
              <Grid3X3 size={18} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`
                p-2 transition-colors
                ${viewMode === 'table'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }
              `}
              title="Tampilan Tabel"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* ============================================
          KONTEN: GRID / TABEL / EMPTY / LOADING
          ============================================ */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchBarang}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      ) : barang.length === 0 ? (
        <EmptyState
          title="Belum ada barang"
          description="Klik tombol 'Tambah Barang' untuk menambahkan barang pertama."
          icon={Package}
          action={
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Plus size={18} />
              Tambah Barang Pertama
            </button>
          }
        />
      ) : viewMode === 'grid' ? (
        renderGridView()
      ) : (
        renderTableView()
      )}

      {/* ============================================
          MODAL TAMBAH BARANG
          ============================================ */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title="Tambah Barang"
        size="lg"
      >
        {renderForm(addErrors, false)}
      </Modal>

      {/* ============================================
          MODAL EDIT BARANG
          ============================================ */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditData(null);
          resetForm();
        }}
        title="Edit Barang"
        size="lg"
      >
        {renderForm(editErrors, true)}
      </Modal>

      {/* ============================================
          DIALOG KONFIRMASI HAPUS
          ============================================ */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleDelete}
        title="Hapus Barang?"
        message={`Apakah Anda yakin ingin menghapus "${deleteTarget?.nama_barang}"? Barang dan fotonya akan dihapus permanen.`}
        variant="danger"
        confirmText="Hapus"
        loading={deleteLoading}
      />
    </div>
  );
};

export default Barang;