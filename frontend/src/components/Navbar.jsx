import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ admin = false, onLogout }) {
  const loc = useLocation();

  const linkClass = (path) =>
    `text-sm font-medium transition-colors ${loc.pathname === path ? 'text-emerald-300' : 'text-gray-200 hover:text-emerald-300'}`;

  if (admin) {
    return (
<nav className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-14 items-center">
          <div className="flex items-center gap-3">
<Link to="/" className="text-lg font-bold text-white tracking-tight">Warisan Sasak</Link>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">Admin</span>
          </div>
          <div className="flex gap-5 items-center">
            <Link to="/admin" className={linkClass('/admin')}>Dashboard</Link>
            <Link to="/admin/heritage" className={linkClass('/admin/heritage')}>Warisan</Link>
            <button onClick={onLogout} className="text-sm text-white bg-red-500 hover:bg-red-600 font-medium transition-colors cursor-pointer rounded-lg px-3 py-1 shadow-sm">Logout</button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-14 items-center">
        <Link to="/" className="text-lg font-bold text-white tracking-tight">Warisan Sasak</Link>
        <div className="hidden sm:flex gap-5 items-center">
          <Link to="/" className={linkClass('/')}>Beranda</Link>
              <Link to="/heritage" className={linkClass('/heritage')}>Warisan</Link>
          <Link to="/peta" className={linkClass('/peta')}>Peta</Link>
          <Link to="/login" className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-emerald-700 transition shadow-sm">Masuk Admin</Link>
        </div>
      </div>
    </nav>
  );
}
