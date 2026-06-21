// File: src/components/ui/FotoUpload.jsx

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

/**
 * Komponen Upload Foto dengan Drag & Drop + Preview
 * 
 * @param {File|null} file - File yang dipilih
 * @param {function} onChange - Callback saat file dipilih
 * @param {string} existingFotoUrl - URL foto lama (saat edit)
 * @param {string} error - Pesan error validasi
 * 
 * Contoh:
 * <FotoUpload file={fotoFile} onChange={setFotoFile} existingFotoUrl={oldFoto} error={errors.foto} />
 */

const FotoUpload = ({ file, onChange, existingFotoUrl = null, error = '' }) => {
  const [preview, setPreview] = useState(existingFotoUrl || null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  // Handle file selection
  const handleFile = (selectedFile) => {
    // Validasi tipe file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(selectedFile.type)) {
      return;
    }

    // Validasi ukuran (max 2MB)
    if (selectedFile.size > 2 * 1024 * 1024) {
      return;
    }

    // Buat preview URL
    const previewUrl = URL.createObjectURL(selectedFile);
    setPreview(previewUrl);

    // Panggil callback
    onChange(selectedFile);
  };

  // Handle click (buka file dialog)
  const handleClick = () => {
    inputRef.current?.click();
  };

  // Handle input change
  const handleInputChange = (e) => {
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
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
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
      {preview ? (
        // TAMPILAN PREVIEW
        <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover"
          />
          {/* Tombol Hapus */}
          <button
            type="button"
            onClick={handleRemove}
            className="
              absolute top-2 right-2
              p-1.5 rounded-lg
              bg-black/50 hover:bg-black/70
              text-white
              transition-colors
            "
          >
            <X size={16} />
          </button>
          {/* Tombol Ganti Foto */}
          <button
            type="button"
            onClick={handleClick}
            className="
              absolute bottom-2 left-2
              px-3 py-1.5 rounded-lg
              bg-black/50 hover:bg-black/70
              text-white text-sm
              transition-colors
            "
          >
            Ganti Foto
          </button>
        </div>
      ) : (
        // TAMPILAN UPLOAD (DRAG & DROP)
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-xl p-6
            text-center cursor-pointer
            transition-all duration-200
            ${isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20'
            }
            ${error ? 'border-red-300 dark:border-red-600' : ''}
          `}
        >
          {/* Icon Upload */}
          <div className="
            w-14 h-14 rounded-2xl
            bg-gray-100 dark:bg-gray-800
            flex items-center justify-center
            mx-auto mb-3
          ">
            <Upload size={24} className="text-gray-400 dark:text-gray-500" />
          </div>

          {/* Teks */}
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Klik atau seret foto ke sini
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            JPG, JPEG, PNG • Maksimal 2MB
          </p>
        </div>
      )}

      {/* Info File */}
      {file && (
        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <ImageIcon size={14} />
          <span>{file.name}</span>
          <span>•</span>
          <span>{formatFileSize(file.size)}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
      )}

      {/* Hidden Input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
};

export default FotoUpload;