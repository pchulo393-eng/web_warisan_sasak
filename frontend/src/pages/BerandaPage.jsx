import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { heritageApi } from '../services/api';
import HeritageMap from '../components/HeritageMap';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { BadgeKategori, BadgeKondisi } from '../components/Badges';

export default function BerandaPage() {
  const [heritages, setHeritages] = useState([]);
  useEffect(() => { heritageApi.getAll().then(r => setHeritages(r.data.data || [])).catch(() => {}); }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-300 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-5xl mx-auto px-4 py-24 md:py-32 text-center">
          <div className="inline-block bg-white/10 border border-white/20 text-white/90 text-xs font-medium px-3 py-1 rounded-full mb-6 backdrop-blur-sm">
            Konservasi Digital Warisan Lombok
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-5 leading-tight tracking-tight">
            Warisan Budaya<br />Sasak
          </h1>
          <p className="text-lg text-emerald-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Menjelajahi dan melestarikan warisan budaya leluhur suku Sasak di Pulau Lombok melalui pemetaan digital dan analisis arsitektur berbasis AI.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/peta" className="bg-white text-emerald-700 px-7 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition shadow-lg shadow-emerald-900/20">
              Jelajahi Peta
            </Link>
            <Link to="/heritage" className="border-2 border-white/40 text-white px-7 py-3 rounded-xl font-semibold hover:bg-white/10 transition backdrop-blur-sm">
              Lihat Warisan
            </Link>
          </div>
        </div>
      </section>

      {/* Stats ringkas */}
      <section className="max-w-5xl mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { n: heritages.length, label: 'Total Warisan', icon: '🏛️' },
            { n: heritages.filter(h => h.kategori === 'masjid').length, label: 'Masjid Kuno', icon: '🕌' },
            { n: heritages.filter(h => h.kategori === 'rumah_adat').length, label: 'Rumah Adat', icon: '🏠' },
            { n: heritages.filter(h => h.kategori === 'makam').length, label: 'Makam Kuno', icon: '🗼' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center hover:shadow-md transition">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-bold text-gray-800">{s.n}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Peta */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Peta Warisan Budaya</h2>
          <p className="text-gray-500 text-sm">Lokasi {heritages.length} warisan budaya Sasak di Pulau Lombok</p>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200" style={{ height: 500 }}>
          <HeritageMap />
        </div>
      </section>

      {/* Grid Heritage */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">Daftar Warisan Budaya</h2>
            <p className="text-gray-500 text-sm">{heritages.length} warisan terdaftar</p>
          </div>
          <Link to="/heritage" className="text-emerald-600 text-sm hover:text-emerald-700 font-semibold hidden sm:block">Lihat Semua →</Link>
        </div>
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
                <p className="text-sm text-gray-500 mb-3">{h.wilayah} · {h.tahun_berdiri}</p>
                <BadgeKondisi value={h.kondisi_saat_ini} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
