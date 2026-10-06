import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { heritageApi, authApi } from '../../services/api';
import Navbar from '../../components/Navbar';
import { BadgeKategori, BadgeKondisi } from '../../components/Badges';

export default function DashboardPage() {
  const [heritages, setHeritages] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    try { const res = await heritageApi.getAll(); setHeritages(res.data.data || []); } catch {}
  };

  useEffect(() => { fetchData(); }, []);

  const handleLogout = async () => {
    try { await authApi.logout(); } catch {}
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus?')) return;
    await heritageApi.delete(id);
    fetchData();
  };

  const stats = [
    { label: 'Total Warisan', val: heritages.length, color: 'text-gray-800', bg: 'bg-gray-50' },
    { label: 'Kondisi Baik', val: heritages.filter(h => h.kondisi_saat_ini === 'baik').length, color: 'text-emerald-700', bg: 'bg-emerald-50' },
    { label: 'Kondisi Sedang', val: heritages.filter(h => h.kondisi_saat_ini === 'sedang').length, color: 'text-amber-700', bg: 'bg-amber-50' },
    { label: 'Kondisi Buruk', val: heritages.filter(h => h.kondisi_saat_ini === 'buruk').length, color: 'text-red-700', bg: 'bg-red-50' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar admin onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 pt-8 pb-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Admin</h1>
            <p className="text-sm text-gray-500">Ringkasan data warisan budaya Sasak</p>
          </div>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="text-xs text-gray-400 font-medium">{s.label}</div>
              <div className={`text-3xl font-bold mt-1 ${s.color}`}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* Tabel */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800 text-sm">Daftar Warisan</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/50 text-gray-500 text-xs">
                <tr>
                  <th className="text-left px-5 py-3 font-medium">Nama</th>
                  <th className="text-left px-5 py-3 font-medium">Kategori</th>
                  <th className="text-left px-5 py-3 font-medium">Wilayah</th>
                  <th className="text-left px-5 py-3 font-medium">Kondisi</th>
                  <th className="text-right px-5 py-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {heritages.map(h => (
                  <tr key={h.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-5 py-3.5 text-gray-800 font-medium">{h.nama}</td>
                    <td className="px-5 py-3.5"><BadgeKategori value={h.kategori} /></td>
                    <td className="px-5 py-3.5 text-gray-500">{h.wilayah}</td>
                    <td className="px-5 py-3.5"><BadgeKondisi value={h.kondisi_saat_ini} /></td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex gap-2 justify-end">
                        <Link to={`/admin/heritage/${h.id}/edit`} className="text-blue-600 hover:text-blue-700 text-xs font-semibold border border-blue-300 rounded-lg px-2.5 py-1 hover:bg-blue-50 transition">Edit</Link>
                        <Link to={`/admin/heritage/${h.id}/foto`} className="text-emerald-600 hover:text-emerald-700 text-xs font-semibold border border-emerald-300 rounded-lg px-2.5 py-1 hover:bg-emerald-50 transition">Foto</Link>
                        <button onClick={() => handleDelete(h.id)} className="text-red-500 hover:text-red-700 text-xs font-semibold border border-red-300 rounded-lg px-2.5 py-1 hover:bg-red-50 transition cursor-pointer">Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
