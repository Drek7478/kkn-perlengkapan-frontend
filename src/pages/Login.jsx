// File: src/pages/Login.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import {
  Eye, EyeOff, Moon, Sun, Package,
  ClipboardList, Search, BarChart3, ShieldCheck
} from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();

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
        setErrors(err.response.data.errors || {});
        toast.error('Validasi gagal. Periksa kembali input Anda.');
      } else if (err.response && err.response.status === 401) {
        setErrors({ email: ['Email atau password salah.'] });
        toast.error('Email atau password salah.');
      } else {
        toast.error('Terjadi kesalahan. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-gray-950 transition-colors duration-300">
      {/* ============================================
          PANEL KIRI — Brand & Dekoratif (Desktop)
          ============================================ */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
        
        {/* Dekoratif Blob 1 — Lingkaran besar kanan atas */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 animate-float-slow" />
        
        {/* Dekoratif Blob 2 — Lingkaran sedang kiri bawah */}
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-indigo-400/20 animate-float-medium delay-200" />
        
        {/* Dekoratif Blob 3 — Lingkaran kecil kanan tengah */}
        <div className="absolute top-1/2 right-12 w-20 h-20 rounded-full bg-blue-300/15 animate-float-fast delay-400" />
        
        {/* Dekoratif Blob 4 — Lingkaran kecil kiri atas */}
        <div className="absolute top-24 left-10 w-12 h-12 rounded-full bg-white/10 animate-float-medium delay-100" />

        {/* Konten Panel Kiri */}
        <div className="relative z-10 flex flex-col justify-between h-full p-10 w-full">
          
          {/* Logo & Nama Aplikasi */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
              <Package size={22} className="text-white" />
            </div>
            <span className="text-white font-semibold text-base tracking-wide">
              KKN Perlengkapan
            </span>
          </div>

          {/* Teks Brand Utama */}
          <div className="animate-slide-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <ShieldCheck size={14} className="text-blue-200" />
              <span className="text-blue-100 text-xs font-medium tracking-wider uppercase">
                Sistem Manajemen KKN
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Kelola Perlengkapan<br />
              <span className="text-blue-200">KKN</span> dengan Mudah
            </h1>

            <p className="text-blue-100/70 text-sm leading-relaxed max-w-sm">
              Pantau kondisi barang, lacak inventaris, dan catat riwayat
              pengecekan — semua dalam satu sistem terpusat yang modern.
            </p>
          </div>

          {/* Daftar Fitur */}
          <div className="space-y-3 animate-slide-up delay-200">
            {[
              { icon: ClipboardList, text: 'Inventaris barang lengkap dengan foto' },
              { icon: Search, text: 'Pengecekan & inspeksi kondisi berkala' },
              { icon: BarChart3, text: 'Dashboard & laporan real-time' },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-3 bg-white/10 border border-white/15 rounded-xl px-4 py-3 backdrop-blur-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-white" />
                </div>
                <span className="text-white/80 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================
          PANEL KANAN — Form Login
          ============================================ */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-slate-50 dark:bg-gray-950">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/60 dark:shadow-none p-8 animate-slide-up">
          
          {/* Toggle Dark Mode */}
          <div className="flex justify-end mb-6">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              title={isDark ? 'Mode Terang' : 'Mode Gelap'}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>

          {/* Header Form */}
          <div className="text-center mb-8">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/50 items-center justify-center mb-5">
              <Package size={28} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-1">
              Masuk ke Sistem
            </h2>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Masukkan kredensial akun admin Anda
            </p>
          </div>

          {/* Alert Error Global */}
          {errors.email && (
            <div className="mb-5 flex items-start gap-2.5 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/50 rounded-xl px-4 py-3">
              <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-600 dark:text-red-400">{errors.email[0]}</p>
            </div>
          )}

          {/* Form Login */}
          <form onSubmit={handleSubmit}>
            
            {/* Field Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kkn.com"
                required
                autoComplete="email"
                autoFocus
                className={`
                  w-full px-4 py-2.5 rounded-xl text-sm
                  bg-gray-50 dark:bg-gray-800
                  text-gray-900 dark:text-gray-100
                  placeholder-gray-300 dark:placeholder-gray-600
                  border transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                  ${errors.email
                    ? 'border-red-300 dark:border-red-700'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }
                `}
              />
            </div>

            {/* Field Password */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className={`
                    w-full px-4 py-2.5 pr-11 rounded-xl text-sm
                    bg-gray-50 dark:bg-gray-800
                    text-gray-900 dark:text-gray-100
                    placeholder-gray-300 dark:placeholder-gray-600
                    border transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                    ${errors.password
                      ? 'border-red-300 dark:border-red-700'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }
                  `}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 dark:text-red-400 mt-1.5">{errors.password[0]}</p>
              )}
            </div>

            {/* Tombol Submit */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full py-2.5 px-4 rounded-xl
                bg-gradient-to-r from-blue-600 to-indigo-600
                hover:from-blue-700 hover:to-indigo-700
                active:scale-[0.98]
                text-white text-sm font-semibold
                shadow-lg shadow-blue-500/25
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                dark:focus:ring-offset-gray-900
                disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100
                flex items-center justify-center gap-2
              "
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                'Masuk ke Sistem'
              )}
            </button>
          </form>

          {/* Footer Card — Badge Admin Only */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-3 py-1">
              <ShieldCheck size={11} className="text-gray-400" />
              <span className="text-xs text-gray-400 dark:text-gray-500 font-medium tracking-wider uppercase">
                Admin Only
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;