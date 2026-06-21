// File: src/pages/Login.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { Eye, EyeOff, Moon, Sun, Package } from 'lucide-react';

const Login = () => {
  // State untuk form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Hooks
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();

  // Fungsi handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Login berhasil! Selamat datang.');
      navigate('/dashboard');
    } catch (err) {
      if (err.response && err.response.status === 422) {
        // Error validasi
        setErrors(err.response.data.errors || {});
        toast.error('Validasi gagal. Periksa kembali input Anda.');
      } else if (err.response && err.response.status === 401) {
        // Error kredensial
        setErrors({ email: ['Email atau password salah.'] });
        toast.error('Email atau password salah.');
      } else {
        // Error lain
        toast.error('Terjadi kesalahan. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-600 to-blue-800 dark:from-gray-900 dark:to-gray-800">
      {/* ============================================
          BAGIAN KIRI: BRAND / ILUSTRASI (DESKTOP)
          ============================================ */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
        <div className="text-center text-white">
          {/* Icon besar */}
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-3xl mb-8 backdrop-blur-sm">
            <Package size={48} />
          </div>

          <h1 className="text-4xl font-bold mb-4">KKN Perlengkapan</h1>
          <p className="text-lg text-blue-100 max-w-md">
            Sistem manajemen perlengkapan yang modern dan efisien.
            Kelola barang, pantau kondisi, dan lacak riwayat pengecekan dalam satu tempat.
          </p>

          {/* Fitur-fitur */}
          <div className="mt-10 space-y-4 text-left max-w-sm mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                📦
              </div>
              <span className="text-blue-50">Manajemen Barang Lengkap</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                🔍
              </div>
              <span className="text-blue-50">Pengecekan & Inspeksi Berkala</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                📊
              </div>
              <span className="text-blue-50">Dashboard & Laporan Real-time</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================
          BAGIAN KANAN: FORM LOGIN
          ============================================ */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Card Form */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8">
            {/* Toggle Dark Mode */}
            <div className="flex justify-end mb-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title={isDark ? 'Mode Terang' : 'Mode Gelap'}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>

            {/* Logo & Judul */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-2xl mb-4">
                <Package size={32} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                KKN Perlengkapan
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Silakan login untuk melanjutkan
              </p>
            </div>

            {/* Error General */}
            {errors.email && errors.email[0] && !errors.password && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-700 dark:text-red-300">{errors.email[0]}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Field Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@kkn.com"
                  className={`
                    w-full px-3 py-2.5 rounded-lg border
                    bg-white dark:bg-gray-800
                    text-gray-900 dark:text-gray-100
                    placeholder-gray-400 dark:placeholder-gray-500
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-colors duration-200
                    ${errors.email ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}
                  `}
                  required
                  autoComplete="email"
                  autoFocus
                />
                {errors.email && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.email[0]}</p>
                )}
              </div>

              {/* Field Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`
                      w-full px-3 py-2.5 pr-10 rounded-lg border
                      bg-white dark:bg-gray-800
                      text-gray-900 dark:text-gray-100
                      placeholder-gray-400 dark:placeholder-gray-500
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      transition-colors duration-200
                      ${errors.password ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}
                    `}
                    required
                    autoComplete="current-password"
                  />
                  {/* Tombol Show/Hide Password */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.password[0]}</p>
                )}
              </div>

              {/* Tombol Login */}
              <button
                type="submit"
                disabled={loading}
                className="
                  w-full py-2.5 px-4 rounded-lg
                  bg-blue-600 hover:bg-blue-700
                  text-white font-medium
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  dark:focus:ring-offset-gray-900
                  transition-colors duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2
                "
              >
                {loading ? (
                  <>
                    {/* Spinner kecil */}
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  'Masuk'
                )}
              </button>
            </form>

            {/* Info Akun */}
            <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
              Gunakan akun admin untuk mengakses sistem
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;