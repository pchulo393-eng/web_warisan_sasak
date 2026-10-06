import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { heritageApi } from '../../services/api';
import Navbar from '../../components/Navbar';

const TIPE_BADGE = {
  masjid: { label: 'Masjid Kuno', cls: 'bg-blue-100 text-blue-800 border-blue-300', icon: '🕌' },
  makam: { label: 'Makam Kuno', cls: 'bg-purple-100 text-purple-800 border-purple-300', icon: '🗼' },
  rumah_adat: { label: 'Rumah Adat', cls: 'bg-amber-100 text-amber-800 border-amber-300', icon: '🏠' },
};

function TipeBadge({ value, skor }) {
  if (!value) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium border border-gray-200 bg-gray-50 text-gray-600">
        <span className="text-sm">❓</span>
        <span>Belum Diketahui</span>
      </span>
    );
  }
  const info = TIPE_BADGE[value] || { label: value, cls: 'bg-gray-100 text-gray-800 border-gray-300', icon: '❓' };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold border ${info.cls}`}>
      <span className="text-sm">{info.icon}</span>
      <span>{info.label}</span>
      {typeof skor === 'number' && (
        <span className="ml-1 text-[10px] opacity-80">({(skor * 100).toFixed(0)}%)</span>
      )}
    </span>
  );
}

export default function FotoPage() {
  const { id } = useParams();
  const [heritage, setHeritage] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [lastUploadedResult, setLastUploadedResult] = useState(null);
  const [error, setError] = useState('');

  const fetchHeritage = async () => {
    try {
      const res = await heritageApi.getById(id);
      setHeritage(res.data.data);
      setPhotos(res.data.data.foto || []);
    } catch {}
  };

  useEffect(() => { fetchHeritage(); }, [id]);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    setError('');
    setLastUploadedResult(null);

    for (const file of files) {
      const formData = new FormData();
      formData.append('foto', file);
      try {
        const res = await heritageApi.uploadPhoto(id, formData);
        setLastUploadedResult(res.data.data);
      } catch (err) {
        const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Gagal mengupload foto.';
        setError(`Gagal upload "${file.name}": ${msg}`);
      }
    }

    setUploading(false);
    fetchHeritage();
    e.target.value = null;
  };

  const handleDelete = async (fotoId) => {
    if (!confirm('Hapus foto ini?')) return;
    try { await heritageApi.deletePhoto(id, fotoId); fetchHeritage(); } catch {}
  };

  const handleSetPrimary = async (fotoId) => {
    try { await heritageApi.setPrimaryPhoto(id, fotoId); fetchHeritage(); } catch {}
  };

  const [reAnalyzing, setReAnalyzing] = useState(null);

  const handleReAnalyze = async (fotoId) => {
    setReAnalyzing(fotoId);
    try {
      await heritageApi.reAnalyzePhoto(id, fotoId);
      fetchHeritage();
    } catch {}
    setReAnalyzing(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar admin />

      <div className="max-w-4xl mx-auto px-4 pt-8 pb-16">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Kelola Foto & Analisis CNN</h1>
            <p className="text-sm text-gray-500">{heritage?.nama}</p>
          </div>
          <Link to="/admin/heritage" className="text-sm text-gray-600 hover:text-emerald-600 font-medium border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition">← Kembali</Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-2xl mb-6 flex items-start gap-2">
            <span>⚠</span> {error}
          </div>
        )}

        {/* Notifikasi Hasil CNN */}
        {lastUploadedResult && (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-emerald-900 p-5 rounded-2xl mb-6 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-sm mb-1.5 flex items-center gap-1.5">
                  <span>✨</span> Foto berhasil dianalisis CNN!
                </p>
                <div className="space-y-1 text-xs text-emerald-800">
                  <div>
                    Tipe: <strong className="uppercase">{lastUploadedResult.label_tipe_cnn?.replace('_', ' ')}</strong>
                    {lastUploadedResult.skor_tipe_cnn && ` (${(lastUploadedResult.skor_tipe_cnn * 100).toFixed(1)}%)`}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 items-end">
                <TipeBadge value={lastUploadedResult.label_tipe_cnn} skor={lastUploadedResult.skor_tipe_cnn} />
              </div>
            </div>
          </div>
        )}

        {/* Dropzone Upload */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
          <h2 className="text-sm font-semibold text-gray-700 mb-1">Upload Foto Baru</h2>
          <p className="text-xs text-gray-400 mb-4">
            Foto otomatis dianalisis model CNN untuk klasifikasi <strong>tipe bangunan</strong> (masjid/makam/rumah adat)
          </p>
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-emerald-500 transition-colors bg-gray-50/50">
            <input
              type="file" multiple accept="image/jpeg,image/png,image/webp"
              onChange={handleUpload} disabled={uploading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
            />
            {uploading && (
              <div className="mt-4">
                <p className="text-sm text-emerald-600 font-medium">Sedang mengunggah & menganalisis...</p>
                <div className="mt-2 w-48 mx-auto bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-500 h-1.5 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Galeri */}
        <h2 className="text-base font-semibold text-gray-800 mb-4">Galeri Foto ({photos.length})</h2>

        {photos.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center text-gray-400 border border-gray-100">
            <div className="text-4xl mb-2">📷</div>
            <p className="text-sm">Belum ada foto untuk heritage ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map(p => (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex flex-col justify-between group hover:shadow-md transition">
                <div>
                  <div className="h-44 bg-gray-100 overflow-hidden relative">
                    <img src={p.url_thumbnail || p.url_foto} alt="" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    {p.is_primary && (
                      <span className="absolute top-2.5 left-2.5 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                        UTAMA
                      </span>
                    )}
                  </div>
                  <div className="p-3.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Tipe Bangunan</span>
                      <TipeBadge value={p.label_tipe_cnn} skor={p.skor_tipe_cnn} />
                    </div>
                  </div>
                </div>

                <div className="p-3.5 pt-0 flex gap-2 border-t border-gray-50 mt-2">
                  {!p.is_primary && (
                    <button onClick={() => handleSetPrimary(p.id)}
                      className="flex-1 bg-gray-50 hover:bg-emerald-50 text-gray-600 hover:text-emerald-700 text-xs py-1.5 rounded-lg font-medium border border-gray-200 transition">
                      Utama
                    </button>
                  )}
                  <button onClick={() => handleDelete(p.id)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 text-xs px-2.5 py-1.5 rounded-lg font-medium border border-red-200 transition">
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
