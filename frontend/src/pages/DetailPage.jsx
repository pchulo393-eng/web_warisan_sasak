import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { heritageApi } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { BadgeKategori, BadgeKondisi, BadgeTipeCNN } from '../components/Badges';

const markerIcon = L.divIcon({
  className: '',
  html: `<div style="width:28px;height:28px;border-radius:50% 50% 50% 0;background:#059669;border:2.5px solid white;box-shadow:0 2px 8px rgba(0,0,0,.25);transform:rotate(-45deg);"></div>`,
  iconSize: [28, 28], iconAnchor: [14, 28],
});

const KONDISI_RING = { baik: 'ring-emerald-500', sedang: 'ring-amber-500', buruk: 'ring-red-500', belum_dikaji: 'ring-gray-400' };

export default function DetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    heritageApi.getById(id).then(r => { setData(r.data.data); setActivePhoto(0); }).catch(() => {});
  }, [id]);

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-3"></div>
        <p className="text-gray-400 text-sm">Memuat data...</p>
      </div>
    </div>
  );

  const photos = data.foto || [];
  const mainPhoto = photos[activePhoto];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pt-6 pb-16">
        {/* Back Button */}
        <Link to="/heritage" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-emerald-600 transition mb-6 border border-gray-200 rounded-lg px-2.5 py-1.5 hover:bg-gray-50">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Kembali ke Warisan
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kiri: Galeri + Deskripsi */}
          <div className="lg:col-span-2 space-y-6">
            {/* Foto Utama */}
            {mainPhoto ? (
              <div className="rounded-2xl overflow-hidden bg-gray-100 shadow-sm ring-1 ring-gray-200">
                <img src={mainPhoto.url_foto} alt={data.nama} className="w-full h-80 md:h-96 object-cover" />
              </div>
            ) : (
              <div className="rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 h-80 flex items-center justify-center text-6xl text-gray-200 ring-1 ring-gray-200">🏛️</div>
            )}

            {/* Thumbnails */}
            {photos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {photos.map((p, i) => (
                  <button key={p.id} onClick={() => setActivePhoto(i)}
                    className={`flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === activePhoto ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                    <img src={p.url_thumbnail || p.url_foto} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

                {/* CNN badges foto aktif */}
                {mainPhoto && (
                  <div className="flex gap-2 flex-wrap">
                    {/* Kondisi badge removed */}
                    {mainPhoto.label_tipe_cnn && <BadgeTipeCNN value={mainPhoto.label_tipe_cnn} />}
                    {mainPhoto.skor_tipe_cnn && <span className="text-[11px] text-gray-400 flex items-center gap-1">Skor CNN: {(mainPhoto.skor_tipe_cnn * 100).toFixed(1)}%</span>}
                  </div>
                )}

            {/* Deskripsi */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{data.nama}</h1>
              {data.deskripsi && <p className="text-gray-600 leading-relaxed mb-6">{data.deskripsi}</p>}
              {data.sejarah && (
                <div className="border-t border-gray-100 pt-5">
                  <h3 className="font-semibold text-gray-800 mb-2.5 flex items-center gap-2">
                    <span className="text-emerald-600">📖</span> Sejarah
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">{data.sejarah}</p>
                </div>
              )}
            </div>
          </div>

          {/* Kanan: Info + Peta */}
          <div className="space-y-5">
            {/* Info Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="font-semibold text-gray-800 mb-4 text-sm uppercase tracking-wider">Informasi</h2>
              <div className="space-y-3.5">
                {[
                  ['Kategori', <BadgeKategori value={data.kategori} />],
                  ['Wilayah', <span className="text-gray-800 font-medium">{data.wilayah}</span>],
                  ['Kecamatan', <span className="text-gray-800 font-medium">{data.kecamatan || '-'}</span>],
                  ['Tahun Berdiri', <span className="text-gray-800 font-medium">{data.tahun_berdiri || '-'}</span>],
                  ['Kondisi', <BadgeKondisi value={data.kondisi_saat_ini} />],
                ].map(([label, val], i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{label}</span>
                    {val}
                  </div>
                ))}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Koordinat</span>
                  <span className="text-xs text-gray-400 font-mono">{data.lat}, {data.lng}</span>
                </div>
              </div>
            </div>

            {/* Mini Map */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <MapContainer center={[data.lat, data.lng]} zoom={14} style={{ height: 200, width: '100%' }}
                scrollWheelZoom={false} dragging={false} doubleClickZoom={false} zoomControl={false} attributionControl={false}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[data.lat, data.lng]} icon={markerIcon} />
              </MapContainer>
            </div>

            {/* Navigasi */}
            <a href={`https://maps.google.com/maps?q=${data.lat},${data.lng}`} target="_blank" rel="noreferrer"
              className="block text-center bg-emerald-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition shadow-sm">
              Google Maps
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
