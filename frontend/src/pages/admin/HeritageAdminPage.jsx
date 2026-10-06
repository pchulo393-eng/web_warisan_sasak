import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { heritageApi, authApi } from '../../services/api';
import Navbar from '../../components/Navbar';
import { BadgeKategori, BadgeKondisi } from '../../components/Badges';

export default function HeritageAdminPage() {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar admin onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 pt-8 pb-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Kelola Warisan</h1>
            <p className="text-sm text-gray-500">Tambah, edit, dan kelola data warisan budaya</p>
          </div>
          <Link to="/admin/heritage/tambah" className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition shadow-sm">
            + Tambah Warisan
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
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
