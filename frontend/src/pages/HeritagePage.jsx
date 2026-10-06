import { Link } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { heritageApi } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { BadgeKategori, BadgeKondisi } from '../components/Badges';

export default function HeritagePage() {
  const [heritages, setHeritages] = useState([]);
   const [search, setSearch] = useState('');
  const [kategori, setKategori] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.q = search;
      if (kategori) params.kategori = kategori;
      if (kecamatan) params.kecamatan = kecamatan;
      const res = await heritageApi.getAll(params);
      setHeritages(res.data.data || []);
    } catch { setHeritages([]); }
    finally { setLoading(false); }
  }, [search, kategori, kecamatan]);

  useEffect(() => { const t = setTimeout(fetchData, 300); return () => clearTimeout(t); }, [fetchData]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pt-10 pb-16">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">Daftar Warisan Budaya Sasak</h1>
        <p className="text-gray-500 text-sm mb-8">Temukan warisan budaya berdasarkan kategori dan kecamatan</p>

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input type="text" placeholder="Cari nama, deskripsi, kecamatan..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50" />
            </div>
            <select value={kategori} onChange={e => setKategori(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="">Semua Kategori</option>
              <option value="masjid">Masjid</option>
              <option value="makam">Makam</option>
              <option value="rumah_adat">Rumah Adat</option>
            </select>
            <select value={kecamatan} onChange={e => setKecamatan(e.target.value)}
               className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="">Semua Kecamatan</option>
              <option value="Suela">Suela</option>
              <option value="Sembalun">Sembalun</option>
              <option value="Sakra">Sakra</option>
              <option value="Jerowaru">Jerowaru</option>
            </select>
          </div>
            {(search || kategori || kecamatan) && (
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
              <span>Filter aktif:</span>
              {search && <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-lg">"{search}"</span>}
              {kategori && <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-lg">{kategori.replace('_', ' ')}</span>}
              {kecamatan && <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-lg">{kecamatan}</span>}
                <button onClick={() => { setSearch(''); setKategori(''); setKecamatan(''); }} className="text-red-500 hover:text-red-700 ml-1">Reset</button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
            <p className="text-gray-400 text-sm mt-3">Memuat data...</p>
          </div>
        ) : heritages.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-3">🔍</div>
            <p>Tidak ada warisan budaya ditemukan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {heritages.map(h => (
              <Link to={`/heritage/${h.id}`} key={h.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
                  {h.thumbnail ? (
                    <img src={h.thumbnail} alt={h.nama} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl text-gray-200">🏛️</div>
                  )}
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <BadgeKategori value={h.kategori} />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-800 mb-1.5 group-hover:text-emerald-700 transition-colors">{h.nama}</h3>
                  <p className="text-sm text-gray-500 mb-3">{h.kecamatan || h.wilayah} · {h.tahun_berdiri}</p>
                  <BadgeKondisi value={h.kondisi_saat_ini} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

