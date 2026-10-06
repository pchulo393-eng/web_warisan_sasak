import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { heritageApi } from '../../services/api';
import Navbar from '../../components/Navbar';

const markerIcon = L.divIcon({
  className: '',
  html: `<div style="width:28px;height:28px;border-radius:50% 50% 50% 0;background:#059669;border:2.5px solid white;box-shadow:0 2px 8px rgba(0,0,0,.25);transform:rotate(-45deg);"></div>`,
  iconSize: [28, 28], iconAnchor: [14, 28],
});

function LocationPicker({ position, setPosition }) {
  useMapEvents({ click(e) { setPosition([e.latlng.lat, e.latlng.lng]); } });
  const lat = position ? parseFloat(position[0]) : null;
  const lng = position ? parseFloat(position[1]) : null;
  const isValid = !isNaN(lat) && !isNaN(lng) && lat !== null && lng !== null;
  return isValid ? <Marker position={[lat, lng]} icon={markerIcon} /> : null;
}

export default function HeritageFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    nama: '', kategori: 'masjid', wilayah: 'Suela', kecamatan: '',
    tahun_berdiri: '', deskripsi: '', sejarah: '', kondisi_saat_ini: 'belum_dikaji', status_aktif: true,
  });
  const [position, setPosition] = useState([-8.65, 116.35]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      heritageApi.getById(id).then(res => {
        const d = res.data.data;
        setForm({
          nama: d.nama, kategori: d.kategori, wilayah: d.wilayah, kecamatan: d.kecamatan || '',
          tahun_berdiri: d.tahun_berdiri || '', deskripsi: d.deskripsi || '', sejarah: d.sejarah || '',
          kondisi_saat_ini: d.kondisi_saat_ini, status_aktif: !!d.status_aktif,
        });
        if (d.lat && d.lng) setPosition([d.lat, d.lng]);
      }).catch(() => {});
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');

    const lat = position && position[0] !== '' && position[0] !== null ? parseFloat(position[0]) : null;
    const lng = position && position[1] !== '' && position[1] !== null ? parseFloat(position[1]) : null;

    if (!lat || !lng || lat < -9.5 || lat > -8.0 || lng < 115.5 || lng > 117.5) {
      setError('Koordinat harus berada di wilayah Lombok/NTB (-9.5 s/d -8.0 lat, 115.5 s/d 117.5 lng)');
      setLoading(false); return;
    }

    try {
      const payload = { ...form, lat, lng };
      if (isEdit) await heritageApi.update(id, payload);
      else await heritageApi.create(payload);
      navigate('/admin/heritage');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan data.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar admin />

      <div className="max-w-4xl mx-auto px-4 pt-8 pb-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{isEdit ? 'Edit Warisan' : 'Tambah Warisan Baru'}</h1>
          <Link to="/admin/heritage" className="text-sm text-gray-600 hover:text-emerald-600 font-medium border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition">← Kembali</Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-2xl mb-6 flex items-start gap-2">
            <span>⚠</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Warisan *</label>
              <input type="text" value={form.nama} onChange={e => setForm({ ...form, nama: e.target.value })} required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 bg-gray-50" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori *</label>
                <select value={form.kategori} onChange={e => setForm({ ...form, kategori: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50">
                  <option value="masjid">Masjid</option>
                  <option value="makam">Makam</option>
                  <option value="rumah_adat">Rumah Adat</option>
                  <option value="desa_adat">Desa Adat</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Wilayah *</label>
                <input type="text" value={form.wilayah} onChange={e => setForm({ ...form, wilayah: e.target.value })} required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50" placeholder="Contoh: Suela" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Kecamatan</label>
              <select value={form.kecamatan} onChange={e => setForm({ ...form, kecamatan: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50">
                <option value="">Pilih Kecamatan</option>
                <option value="Suela">Suela</option>
                <option value="Sakra">Sakra</option>
                <option value="Jerowaru">Jerowaru</option>
                <option value="Sembalun">Sembalun</option>
              </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tahun Berdiri</label>
                <input type="text" value={form.tahun_berdiri} onChange={e => setForm({ ...form, tahun_berdiri: e.target.value })}
                  placeholder="e.g. Abad ke-14" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Kondisi Saat Ini</label>
                <select value={form.kondisi_saat_ini} onChange={e => setForm({ ...form, kondisi_saat_ini: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50">
                  <option value="belum_dikaji">Belum Dikaji</option>
                  <option value="baik">Baik</option>
                  <option value="sedang">Sedang</option>
                  <option value="buruk">Buruk</option>
                </select>
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input type="checkbox" id="status_aktif" checked={form.status_aktif} onChange={e => setForm({ ...form, status_aktif: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4" />
                <label htmlFor="status_aktif" className="text-sm text-gray-700 font-medium">Status Aktif</label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi</label>
              <textarea rows={3} value={form.deskripsi} onChange={e => setForm({ ...form, deskripsi: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Sejarah</label>
              <textarea rows={4} value={form.sejarah} onChange={e => setForm({ ...form, sejarah: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50" />
            </div>
          </div>

          {/* Map Picker */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 mb-1">Titik Koordinat *</h2>
            <p className="text-xs text-gray-400 mb-4">Klik pada peta untuk mengatur posisi</p>
            <div className="h-64 rounded-xl overflow-hidden border border-gray-200 mb-4">
              <MapContainer center={position || [-8.65, 116.35]} zoom={10} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationPicker position={position} setPosition={setPosition} />
              </MapContainer>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Latitude</label>
                <input type="text" value={position ? position[0] ?? '' : ''} onChange={e => setPosition([e.target.value, position ? position[1] : ''])} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 font-mono" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Longitude</label>
                <input type="text" value={position ? position[1] ?? '' : ''} onChange={e => setPosition([position ? position[0] : '', e.target.value])} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 font-mono" />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={loading}
              className="flex-1 bg-emerald-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 transition shadow-sm">
              {loading ? 'Menyimpan...' : 'Simpan Warisan'}
            </button>
            <Link to="/admin/heritage" className="px-6 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 text-center transition">
              Batal
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
