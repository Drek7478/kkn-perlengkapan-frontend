// File: src/components/ui/FotoUpload.jsx

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Camera, AlertTriangle } from 'lucide-react';

/**
 * Komponen Upload Foto dengan Drag & Drop + Preview + Kamera + Kompresi
 * 
 * @param {File|null} file - File yang dipilih
 * @param {function} onChange - Callback saat file dipilih
 * @param {string} existingFotoUrl - URL foto lama (saat edit)
 * @param {string} error - Pesan error validasi
 */

const FotoUpload = ({ file, onChange, existingFotoUrl = null, error = '' }) => {
  const [preview, setPreview] = useState(existingFotoUrl || null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState(''); // Error lokal untuk validasi ukuran
  const [compressing, setCompressing] = useState(false); // Status kompresi
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  /**
   * Kompres gambar sebelum ditampilkan & diupload
   * Menggunakan Canvas API untuk resize + kompresi
   */
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Buat canvas untuk kompresi
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Resize: maksimal lebar 1200px, tinggi menyesuaikan
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let { width, height } = img;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          // Konversi ke JPEG dengan kualitas 0.7 (70%)
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                reject(new Error('Gagal mengompres gambar'));
              }
            },
            'image/jpeg',
            0.7 // Kualitas 70%
          );
        };
        img.onerror = () => reject(new Error('Gagal memuat gambar'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Gagal membaca file'));
      reader.readAsDataURL(file);
    });
  };

  // Handle file selection (dari galeri, kamera, atau drag-drop)
  const handleFile = async (selectedFile) => {
    setLocalError('');
    setCompressing(true);

    try {
      // Validasi tipe file (lebih longgar)
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'image/heif', 'image/webp'];
      
      // Cek apakah file adalah gambar
      if (!selectedFile.type.startsWith('image/')) {
        setLocalError('File harus berupa gambar.');
        setCompressing(false);
        return;
      }

      // Tampilkan preview dulu (sebelum kompresi)
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);

      // Kompres gambar
      const compressedFile = await compressImage(selectedFile);
      
      // Cek ukuran setelah kompresi
      if (compressedFile.size > 5 * 1024 * 1024) {
        setLocalError('Ukuran foto terlalu besar meskipun sudah dikompres. Coba foto dengan resolusi lebih rendah.');
        setPreview(null);
        setCompressing(false);
        return;
      }

      // Update preview dengan versi terkompresi
      const compressedPreviewUrl = URL.createObjectURL(compressedFile);
      setPreview(compressedPreviewUrl);

      // Kirim file terkompresi ke parent
      onChange(compressedFile);
    } catch (err) {
      console.error('Error kompresi:', err);
      setLocalError('Gagal memproses foto. Silakan coba lagi.');
      setPreview(null);
    } finally {
      setCompressing(false);
    }
  };

  // Handle click (buka file dialog / galeri)
  const handleClickGaleri = () => {
    fileInputRef.current?.click();
  };

  // Handle click (buka kamera)
  const handleClickKamera = () => {
    cameraInputRef.current?.click();
  };

  // Handle input change dari galeri
  const handleInputChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  // Handle input change dari kamera
  const handleCameraChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  // Handle drag & drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  };

  // Handle hapus file
  const handleRemove = () => {
    setPreview(null);
    setLocalError('');
    onChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  // Format ukuran file
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div>
      {/* Area Upload / Preview */}
      {compressing ? (
        // ============================================
        // TAMPILAN LOADING KOMPRESI
        // ============================================
        <div className="border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-xl p-6 text-center bg-blue-50 dark:bg-blue-950/20">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
            Mengompres foto...
          </p>
          <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">
            Foto akan dikompres agar ukurannya lebih kecil
          </p>
        </div>
      ) : preview ? (
        // ============================================
        // TAMPILAN PREVIEW
        // ============================================
        <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover"
          />
          
          {/* Tombol Hapus (kanan atas) */}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 hover:bg-black/70 text-white transition-colors"
            title="Hapus Foto"
          >
            <X size={16} />
          </button>

          {/* Tombol Ganti Foto (kiri bawah) */}
          <div className="absolute bottom-2 left-2 flex gap-2">
            <button
              type="button"
              onClick={handleClickGaleri}
              className="px-3 py-1.5 rounded-lg bg-black/50 hover:bg-black/70 text-white text-sm transition-colors flex items-center gap-1.5"
              title="Pilih dari Galeri"
            >
              <ImageIcon size={14} />
              <span>Galeri</span>
            </button>
            <button
              type="button"
              onClick={handleClickKamera}
              className="px-3 py-1.5 rounded-lg bg-black/50 hover:bg-black/70 text-white text-sm transition-colors flex items-center gap-1.5"
              title="Ambil dengan Kamera"
            >
              <Camera size={14} />
              <span>Kamera</span>
            </button>
          </div>
        </div>
      ) : (
        // ============================================
        // TAMPILAN UPLOAD (DRAG & DROP)
        // ============================================
        <div
          onClick={handleClickGaleri}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200
            ${isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20'
            }
            ${(error || localError) ? 'border-red-300 dark:border-red-600' : ''}
          `}
        >
          {/* Icon Upload */}
          <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
            <Upload size={24} className="text-gray-400 dark:text-gray-500" />
          </div>

          {/* Teks */}
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Klik atau seret foto ke sini
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            JPG, JPEG, PNG • Maksimal 5MB (otomatis dikompres)
          </p>

          {/* Dua Tombol: Galeri & Kamera */}
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleClickGaleri(); }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
            >
              <ImageIcon size={16} />
              <span>Galeri</span>
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleClickKamera(); }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
            >
              <Camera size={16} />
              <span>Kamera</span>
            </button>
          </div>
        </div>
      )}

      {/* Info File (setelah kompresi selesai) */}
      {file && !compressing && (
        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <ImageIcon size={14} />
          <span>{file.name}</span>
          <span>•</span>
          <span>{formatFileSize(file.size)}</span>
          <span className="text-emerald-600 dark:text-emerald-400">✓ Terkompres</span>
        </div>
      )}

      {/* Error Message Lokal */}
      {localError && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
          <AlertTriangle size={14} />
          <span>{localError}</span>
        </div>
      )}

      {/* Error Message dari Parent */}
      {error && !localError && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
      )}

      {/* Hidden Input untuk Galeri */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/heic,image/heif,image/webp"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Hidden Input untuk Kamera */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCameraChange}
        className="hidden"
      />
    </div>
  );
};

export default FotoUpload;