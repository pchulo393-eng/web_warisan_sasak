import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../services/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authApi.login(email, password);
      localStorage.setItem('admin_token', res.data.token);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Periksa email dan password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-4">
      {/* Tombol Kembali Floating */}
      <button
        type="button"
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/90 backdrop-blur-md border border-gray-200 text-gray-700 hover:text-emerald-700 hover:bg-white hover:border-emerald-300 shadow-sm hover:shadow transition-all duration-200 text-sm font-medium group"
      >
        <svg
          className="w-4 h-4 transition-transform group-hover:-translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Kembali ke Beranda</span>
      </button>

      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-2xl font-bold text-white hover:text-emerald-800 transition">Warisan Sasak</h1>
          </Link>
          <p className="text-sm text-gray-500 mt-1">Panel Admin Konservasi Budaya</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl shadow-emerald-950/5 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">Masuk Admin</h2>
          <p className="text-sm text-gray-400 mb-6">Masukkan kredensial Anda</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3.5 rounded-xl mb-4 flex items-start gap-2.5">
              <span className="text-red-500 mt-0.5">⚠</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50 transition"
                placeholder="admin@warisan.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50 transition"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-50 transition-all shadow-sm shadow-emerald-600/20"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Memproses...
                </span>
              ) : (
                'Masuk'
              )}
            </button>
          </form>
        </div>

        <p className="text-xs text-gray-400 text-center mt-6">
          Demo: <span className="font-mono text-gray-500">admin@warisan.com</span> / <span className="font-mono text-gray-500">admin123</span>
        </p>
      </div>
    </div>
  );
}
