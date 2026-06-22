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
  // =============================================
  // STATE & HOOKS — TIDAK ADA PERUBAHAN
  // =============================================
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

  // =============================================
  // DATA FITUR UNTUK PANEL KIRI
  // =============================================
  const features = [
    { icon: ClipboardList, text: 'Inventaris barang lengkap dengan foto' },
    { icon: Search, text: 'Pengecekan & inspeksi kondisi berkala' },
    { icon: BarChart3, text: 'Dashboard & laporan real-time' },
  ];

  // =============================================
  // RENDER
  // =============================================
  return (
    <div className="min-h-screen flex overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 lg:bg-slate-50 dark:lg:bg-gray-950 transition-colors duration-300">

      {/* ============================================================
          PANEL KIRI — BRANDING & DEKORATIF (DESKTOP ONLY: lg+)
          ============================================================ */}
      <div
        className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col justify-between p-10"
        style={{
          background: 'linear-gradient(145deg, #0f2460 0%, #1d4ed8 55%, #3730a3 100%)',
        }}
      >
        {/* ORB DEKORATIF — Lingkaran melayang di background */}
        <div
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full kkn-float-a kkn-fade-in kkn-d-0"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full kkn-float-b kkn-d-f2 kkn-fade-in kkn-d-1"
          style={{
            background: 'radial-gradient(circle, rgba(167,139,250,0.18) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 right-8 w-28 h-28 rounded-full kkn-float-c kkn-d-f3 kkn-fade-in kkn-d-2"
          style={{
            background: 'radial-gradient(circle, rgba(96,165,250,0.15) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute top-1/4 left-12 w-16 h-16 rounded-full kkn-float-d kkn-d-f4 kkn-fade-in kkn-d-1"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/3 w-10 h-10 rounded-full kkn-float-a kkn-d-f1 kkn-fade-in kkn-d-3"
          style={{
            background: 'rgba(255,255,255,0.07)',
          }}
        />

        {/* LOGO APLIKASI — Pop in (t=0.1s) */}
        <div className="relative z-10 flex items-center gap-3 kkn-pop-in kkn-d-1">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center kkn-logo-pulse"
            style={{
              background: 'rgba(255,255,255,0.18)',
              border: '1px solid rgba(255,255,255,0.3)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Package size={24} className="text-white" />
          </div>
          <span className="text-white font-semibold text-base tracking-wide">
            KKN Perlengkapan
          </span>
        </div>

        {/* KONTEN TENGAH — Badge + Heading + Subtitle */}
        <div className="relative z-10 space-y-4">
          {/* Badge — Slide down (t=0.5s) */}
          <div className="kkn-slide-down kkn-d-5">
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-2"
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                backdropFilter: 'blur(4px)',
              }}
            >
              <ShieldCheck size={13} className="text-blue-200" />
              <span className="text-blue-100 text-xs font-semibold tracking-widest uppercase">
                Sistem Manajemen KKN
              </span>
            </span>
          </div>

          {/* Heading Besar — Reveal up (t=0.7s) */}
          <h1 className="kkn-reveal-up kkn-d-7">
            <span className="block text-4xl font-bold text-white leading-tight">
              Kelola Perlengkapan
            </span>
            <span
              className="block text-4xl font-bold leading-tight"
              style={{ color: '#93c5fd' }}
            >
              KKN
            </span>
            <span className="block text-4xl font-bold text-white leading-tight">
              dengan Mudah
            </span>
          </h1>

          {/* Subtitle — Fade in (t=0.9s) */}
          <p className="text-blue-100/65 text-sm leading-relaxed max-w-xs kkn-fade-in kkn-d-9">
            Pantau kondisi barang, lacak inventaris, dan catat riwayat
            pengecekan — semua dalam satu sistem terpusat yang modern.
          </p>
        </div>

        {/* DAFTAR FITUR — Bounce dari kiri satu per satu */}
        <div className="relative z-10 space-y-3">
          {features.map(({ icon: Icon, text }, index) => (
            <div
              key={text}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 kkn-bounce-left kkn-d-${9 + index * 2}`}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                backdropFilter: 'blur(4px)',
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.18)' }}
              >
                <Icon size={18} className="text-white" />
              </div>
              <span className="text-white/80 text-sm font-medium">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================
          PANEL KANAN — FORM LOGIN (TAMPIL DI SEMUA UKURAN)
          ============================================================ */}
      <div className="flex-1 relative flex flex-col items-center justify-center px-4 py-10 lg:px-12 lg:py-12 lg:bg-slate-50 dark:lg:bg-gray-950">

        {/* ORB DEKORATIF MOBILE — Hanya tampil di mobile */}
        <div
          className="lg:hidden absolute -top-16 -right-16 w-52 h-52 rounded-full pointer-events-none kkn-float-a kkn-d-f1"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
          }}
        />
        <div
          className="lg:hidden absolute -bottom-20 -left-16 w-44 h-44 rounded-full pointer-events-none kkn-float-b"
          style={{
            background: 'radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)',
          }}
        />
        <div
          className="lg:hidden absolute top-1/3 right-4 w-20 h-20 rounded-full pointer-events-none kkn-float-c kkn-d-f3"
          style={{
            background: 'rgba(255,255,255,0.05)',
          }}
        />

        {/* LOGO MOBILE — Pop in (t=0.1s) */}
        <div className="lg:hidden relative z-10 flex flex-col items-center mb-7 kkn-pop-in kkn-d-1">
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center kkn-logo-pulse"
              style={{
                background: 'rgba(255,255,255,0.18)',
                border: '1px solid rgba(255,255,255,0.3)',
              }}
            >
              <Package size={22} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-wide">
              KKN Perlengkapan
            </span>
          </div>
          <p className="text-white/50 text-xs text-center">
            Sistem manajemen perlengkapan KKN
          </p>
        </div>

        {/* CARD FORM LOGIN — Fly right dengan bounce (t=0.3s) */}
        <div
          className="relative z-10 w-full max-w-md rounded-3xl p-7 sm:p-8 kkn-fly-right kkn-d-3 kkn-card-glow bg-white dark:bg-gray-900 lg:shadow-2xl lg:shadow-gray-200/60 dark:lg:shadow-none lg:border lg:border-gray-100/80 dark:lg:border-gray-800"
          style={{
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
          }}
        >
          {/* TOMBOL TOGGLE DARK MODE — Pop in (t=0.5s) */}
          <div className="flex justify-end mb-6 kkn-pop-in kkn-d-5">
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200 hover:scale-110 active:scale-95"
              title={isDark ? 'Mode Terang' : 'Mode Gelap'}
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>

          {/* HEADER CARD — Ikon + Judul + Subtitle */}
          <div className="text-center mb-8">
            {/* Ikon Besar — Pop in (t=0.5s) */}
            <div className="kkn-pop-in kkn-d-5 flex justify-center mb-5">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/60 dark:to-indigo-950/60"
                style={{ boxShadow: '0 4px 20px rgba(99, 102, 241, 0.15)' }}
              >
                <Package size={32} className="text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>

            {/* Judul Form — Reveal up (t=0.7s) */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-1 kkn-reveal-up kkn-d-7">
              Masuk ke Sistem
            </h2>

            {/* Subtitle Form — Fade in (t=0.9s) */}
            <p className="text-sm text-gray-400 dark:text-gray-500 kkn-fade-in kkn-d-9">
              Masukkan kredensial akun admin Anda
            </p>
          </div>

          {/* ALERT ERROR — Tampil jika ada error login */}
          {errors.email && (
            <div className="mb-5 flex items-start gap-3 rounded-xl px-4 py-3 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/50 kkn-reveal-up kkn-d-0">
              <svg
                className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.email[0]}
              </p>
            </div>
          )}

          {/* FORM LOGIN */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* FIELD EMAIL — Reveal up (t=0.9s) */}
            <div className="kkn-reveal-up kkn-d-9">
              <label
                htmlFor="email"
                className="block text-xs font-bold mb-2 text-gray-500 dark:text-gray-400 uppercase tracking-widest"
              >
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
                className={`kkn-input-glow w-full px-4 py-3.5 rounded-xl text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-600 border transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 ${
                  errors.email
                    ? 'border-red-300 dark:border-red-700'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              />
            </div>

            {/* FIELD PASSWORD — Reveal up (t=1.1s) */}
            <div className="kkn-reveal-up kkn-d-11">
              <label
                htmlFor="password"
                className="block text-xs font-bold mb-2 text-gray-500 dark:text-gray-400 uppercase tracking-widest"
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
                  required
                  autoComplete="current-password"
                  className={`kkn-input-glow w-full px-4 py-3.5 pr-14 rounded-xl text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-600 border transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 ${
                    errors.password
                      ? 'border-red-300 dark:border-red-700'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                />
                {/* Tombol Show/Hide Password */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-gray-300 dark:text-gray-600 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-150"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 dark:text-red-400 mt-1.5">
                  {errors.password[0]}
                </p>
              )}
            </div>

            {/* TOMBOL SUBMIT — Reveal up (t=1.3s) + Shimmer */}
            <div className="kkn-reveal-up kkn-d-13 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="kkn-btn-shimmer w-full py-3.5 px-4 rounded-xl text-white text-sm font-bold tracking-wide transition-all duration-200 hover:scale-[1.02] hover:brightness-110 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:brightness-100 flex items-center justify-center gap-2.5"
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #7c3aed 100%)',
                  boxShadow: '0 4px 24px rgba(79, 70, 229, 0.35)',
                }}
              >
                {loading ? (
                  <>
                    {/* Tiga titik bounce sebagai indikator loading */}
                    <span className="flex gap-1 items-center">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.12}s` }}
                        />
                      ))}
                    </span>
                    <span>Memproses...</span>
                  </>
                ) : (
                  'Masuk ke Sistem'
                )}
              </button>
            </div>
          </form>

          {/* FOOTER BADGE "ADMIN ONLY" — Fade in (t=1.5s) */}
          <div className="mt-7 flex items-center justify-center kkn-fade-in kkn-d-15">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <ShieldCheck size={12} className="text-gray-400" />
              <span className="text-xs text-gray-400 dark:text-gray-500 font-semibold tracking-widest uppercase">
                Admin Only
              </span>
            </div>
          </div>
        </div>

        {/* SPACER BAWAH MOBILE */}
        <div className="h-8 lg:hidden" />
      </div>
    </div>
  );
};

export default Login;