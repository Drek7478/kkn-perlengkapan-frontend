// File: src/pages/Login.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import {
  Eye, EyeOff, Moon, Sun, Package,
  ClipboardList, Search, BarChart3, ShieldCheck,
  Mail, Lock
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
  // DATA FITUR UNTUK PANEL KIRI & MOBILE
  // =============================================
  const features = [
    { icon: ClipboardList, text: 'Inventaris lengkap dengan foto' },
    { icon: Search, text: 'Inspeksi kondisi berkala' },
    { icon: BarChart3, text: 'Dashboard & laporan real-time' },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-gray-950 transition-colors duration-300 overflow-hidden kkn-safe-bottom">

      {/* ============================================================
          PANEL KIRI — BRANDING & DEKORATIF (DESKTOP ONLY: lg+)
          ============================================================ */}
      <div
        className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col justify-between p-10"
        style={{ background: 'linear-gradient(145deg, #0f2460 0%, #1d4ed8 55%, #3730a3 100%)' }}
      >
        {/* ORB DEKORATIF — DENGAN BLUR (GLOW EFFECT) */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full kkn-float-a kkn-fade-in kkn-d-0 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full kkn-float-b kkn-d-f2 kkn-fade-in kkn-d-1 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.2) 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 -translate-y-1/2 right-8 w-28 h-28 rounded-full kkn-float-c kkn-d-f3 kkn-fade-in kkn-d-2 blur-2xl"
          style={{ background: 'radial-gradient(circle, rgba(96,165,250,0.18) 0%, transparent 70%)' }} />
        <div className="absolute top-1/4 left-12 w-20 h-20 rounded-full kkn-float-d kkn-d-f4 kkn-fade-in kkn-d-1 blur-2xl"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/3 right-1/4 w-14 h-14 rounded-full kkn-float-a kkn-d-f1 kkn-fade-in kkn-d-3 blur-xl"
          style={{ background: 'rgba(255,255,255,0.08)' }} />

        {/* LOGO APLIKASI — Pop in */}
        <div className="relative z-10 flex items-center gap-3 kkn-pop-in kkn-d-1">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center kkn-logo-pulse"
            style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(8px)' }}>
            <Package size={24} className="text-white" />
          </div>
          <span className="text-white font-semibold text-base tracking-wide">KKN Perlengkapan</span>
        </div>

        {/* KONTEN TENGAH — Badge + Heading + Subtitle */}
        <div className="relative z-10 space-y-4">
          {/* Badge — Slide down */}
          <div className="kkn-slide-down kkn-d-3">
            <span className="inline-flex items-center gap-2 rounded-full px-4 py-2"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)' }}>
              <ShieldCheck size={13} className="text-blue-200" />
              <span className="text-blue-100 text-xs font-semibold tracking-widest uppercase">Sistem Manajemen KKN</span>
            </span>
          </div>

          {/* Heading Besar — Reveal up */}
          <h1 className="kkn-reveal-up kkn-d-5">
            <span className="block text-4xl font-bold text-white leading-tight">Kelola Perlengkapan</span>
            <span className="block text-4xl font-bold leading-tight kkn-text-gradient">KKN</span>
            <span className="block text-4xl font-bold text-white leading-tight">dengan Mudah</span>
          </h1>

          {/* Subtitle — Reveal up */}
          <p className="text-blue-100/65 text-sm leading-relaxed max-w-xs kkn-reveal-up kkn-d-7">
            Pantau kondisi barang, lacak inventaris, dan catat riwayat pengecekan — semua dalam satu sistem terpusat yang modern.
          </p>
        </div>

        {/* DAFTAR FITUR — Bounce dari kiri satu per satu */}
        <div className="relative z-10 space-y-3">
          {features.map(({ icon: Icon, text }, index) => (
            <div key={text}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 kkn-bounce-left kkn-d-${9 + index * 2}`}
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(4px)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.18)' }}>
                <Icon size={18} className="text-white" />
              </div>
              <span className="text-white/80 text-sm font-medium">{text}</span>
            </div>
          ))}
        </div>

        {/* Gradient transisi di tepi kanan panel kiri */}
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-r from-transparent to-white/5 pointer-events-none" />
      </div>

      {/* ============================================================
          PANEL KANAN — FORM LOGIN (MOBILE: HERO + BOTTOM SHEET)
          ============================================================ */}
      <div className="flex-1 flex flex-col lg:items-center lg:justify-center lg:px-12 lg:py-12 relative kkn-bg-right">

        {/* BLOB DEKORATIF PANEL KANAN — Blur besar, opacity rendah */}
        <div className="hidden lg:block absolute -top-32 -right-20 w-72 h-72 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)' }} />
        <div className="hidden lg:block absolute -bottom-24 -left-16 w-64 h-64 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)' }} />
        <div className="hidden lg:block absolute top-1/3 left-1/4 w-40 h-40 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)' }} />

        {/* ============================================================
            HERO MOBILE — Hanya tampil di mobile (lg:hidden)
            ============================================================ */}
        <div className="lg:hidden kkn-hero-mobile px-6 pt-12 pb-16 relative">
          {/* ORB dekoratif untuk hero mobile — dengan blur */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none kkn-float-a kkn-d-f1 blur-2xl"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)' }} />
          <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full pointer-events-none kkn-float-b blur-2xl"
            style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)' }} />
          <div className="absolute top-1/3 right-4 w-20 h-20 rounded-full pointer-events-none kkn-float-c kkn-d-f3 blur-xl"
            style={{ background: 'rgba(255,255,255,0.06)' }} />

          <div className="relative z-10">
            {/* Baris atas: Logo + Toggle Dark Mode */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5 kkn-pop-in kkn-d-1">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center kkn-logo-pulse"
                  style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)' }}>
                  <Package size={20} className="text-white" />
                </div>
                <span className="text-white font-semibold text-sm tracking-wide">KKN Perlengkapan</span>
              </div>

              <button onClick={toggleTheme}
                className="w-9 h-9 rounded-xl flex items-center justify-center kkn-pop-in kkn-d-2"
                style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}
                title={isDark ? 'Mode Terang' : 'Mode Gelap'}>
                {isDark ? <Sun size={16} className="text-white" /> : <Moon size={16} className="text-white" />}
              </button>
            </div>

            {/* Badge + Judul Singkat */}
            <div className="kkn-reveal-up kkn-d-3">
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-3"
                style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <ShieldCheck size={11} className="text-blue-200" />
                <span className="text-blue-100 text-xs font-medium tracking-wide uppercase">Sistem Manajemen KKN</span>
              </span>
              <h1 className="text-2xl font-bold text-white leading-snug">
                Kelola Perlengkapan <span className="kkn-text-gradient">KKN</span>
              </h1>
            </div>

            {/* Ikon Fitur Ringkas Horizontal */}
            <div className="flex items-center gap-3 mt-5 kkn-reveal-up kkn-d-5">
              {features.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5"
                  style={{ color: 'rgba(255,255,255,0.7)' }}>
                  <Icon size={14} />
                  <span className="text-xs whitespace-nowrap">{text.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================
            CARD FORM LOGIN — GLASS + GLOW + OVERLAP
            ============================================================ */}
        <div className={`
          w-full max-w-md
          kkn-glass-card
          rounded-3xl
          p-7 sm:p-8
          kkn-card-entrance kkn-d-3 kkn-card-shadow
          kkn-bottom-sheet
          lg:kkn-card-overlap
        `}>
          {/* Toggle Dark Mode — Desktop only */}
          <div className="hidden lg:flex justify-end mb-6 kkn-pop-in kkn-d-4">
            <button onClick={toggleTheme}
              className="w-10 h-10 rounded-xl border border-gray-200/60 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200 hover:scale-110 active:scale-95 backdrop-blur-sm"
              title={isDark ? 'Mode Terang' : 'Mode Gelap'}>
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>

          {/* HEADER CARD — Ikon + Judul + Subtitle */}
          <div className="text-center mb-8">
            <div className="kkn-pop-in kkn-d-4 flex justify-center mb-5">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/60 dark:to-indigo-950/60 kkn-logo-pulse"
                style={{ boxShadow: '0 4px 20px rgba(99, 102, 241, 0.15)' }}>
                <Package size={32} className="text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-1 kkn-reveal-up kkn-d-5">
              Masuk ke Sistem
            </h2>

            <p className="text-sm text-gray-400 dark:text-gray-500 kkn-reveal-up kkn-d-6">
              Masukkan kredensial akun admin Anda
            </p>
          </div>

          {/* ALERT ERROR */}
          {errors.email && (
            <div className="mb-5 flex items-start gap-3 rounded-xl px-4 py-3 bg-red-50/90 dark:bg-red-950/60 border border-red-100 dark:border-red-900/50 backdrop-blur-sm kkn-slide-down kkn-d-0">
              <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-600 dark:text-red-400">{errors.email[0]}</p>
            </div>
          )}

          {/* FORM LOGIN */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* FIELD EMAIL */}
            <div className="kkn-reveal-up kkn-d-7">
              <label htmlFor="email" className="block text-xs font-bold mb-2 text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                Email
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
                  <Mail size={17} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@kkn.com"
                  required
                  autoComplete="email"
                  autoFocus
                  className={`kkn-input-glow w-full pl-10 pr-4 py-3.5 rounded-xl text-sm bg-gray-50/90 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-600 border transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 ${
                    errors.email ? 'border-red-300 dark:border-red-700' : 'border-gray-200/80 dark:border-gray-700'
                  }`}
                />
              </div>
            </div>

            {/* FIELD PASSWORD */}
            <div className="kkn-reveal-up kkn-d-8">
              <label htmlFor="password" className="block text-xs font-bold mb-2 text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
                  <Lock size={17} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className={`kkn-input-glow w-full pl-10 pr-14 py-3.5 rounded-xl text-sm bg-gray-50/90 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-600 border transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 ${
                    errors.password ? 'border-red-300 dark:border-red-700' : 'border-gray-200/80 dark:border-gray-700'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-gray-300 dark:text-gray-600 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-150">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 dark:text-red-400 mt-1.5">{errors.password[0]}</p>
              )}
            </div>

            {/* TOMBOL SUBMIT — GLOW BERWARNA */}
            <div className="kkn-reveal-up kkn-d-9 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="kkn-btn-shimmer kkn-btn-glow w-full py-3.5 px-4 rounded-xl text-white text-sm font-bold tracking-wide transition-all duration-200 hover:scale-[1.02] hover:brightness-110 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:brightness-100 flex items-center justify-center gap-2.5"
                style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #7c3aed 100%)' }}>
                {loading ? (
                  <>
                    <span className="flex gap-1 items-center">
                      {[0, 1, 2].map((i) => (
                        <span key={i} className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: `${i * 0.12}s` }} />
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

          {/* FOOTER BADGE */}
          <div className="mt-7 flex items-center justify-center kkn-reveal-up kkn-d-10">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 bg-gray-100/80 dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700 backdrop-blur-sm">
              <ShieldCheck size={12} className="text-gray-400" />
              <span className="text-xs text-gray-400 dark:text-gray-500 font-semibold tracking-widest uppercase">Admin Only</span>
            </div>
          </div>
        </div>

        <div className="h-6 lg:hidden" />
      </div>
    </div>
  );
};

export default Login;