const KATEGORI = {
  masjid:     { label: 'Masjid',      cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  makam:      { label: 'Makam',       cls: 'bg-gray-100 text-gray-700 border-gray-200' },
  rumah_adat: { label: 'Rumah Adat',  cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  desa_adat:  { label: 'Desa Adat',   cls: 'bg-purple-50 text-purple-700 border-purple-200' },
};

const KONDISI = {
  baik:         { label: 'Baik',         cls: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  sedang:       { label: 'Sedang',       cls: 'bg-amber-100 text-amber-800 border-amber-200' },
  buruk:        { label: 'Buruk',        cls: 'bg-red-100 text-red-800 border-red-200' },
  belum_dikaji: { label: 'Belum Dikaji', cls: 'bg-gray-100 text-gray-600 border-gray-200' },
};

const TIPE_CNN = {
  masjid:  { label: 'Masjid Kuno',   cls: 'bg-blue-100 text-blue-800 border-blue-200' },
  makam:   { label: 'Makam Kuno',    cls: 'bg-gray-100 text-gray-700 border-gray-200' },
  rumah_adat: { label: 'Rumah Adat', cls: 'bg-amber-100 text-amber-800 border-amber-200' },
};

export function BadgeKategori({ value }) {
  const info = KATEGORI[value] || KATEGORI.masjid;
  return <span className={`inline-flex items-center text-[11px] px-2 py-0.5 rounded-full font-semibold border ${info.cls}`}>{info.label}</span>;
}

export function BadgeKondisi({ value }) {
  const info = KONDISI[value] || KONDISI.belum_dikaji;
  return <span className={`inline-flex items-center text-[11px] px-2 py-0.5 rounded-full font-semibold border ${info.cls}`}>{info.label}</span>;
}

export function BadgeTipeCNN({ value }) {
  const info = TIPE_CNN[value];
  if (!info) return <span className="inline-flex items-center text-[11px] px-2 py-0.5 rounded-full font-semibold border bg-gray-100 text-gray-500 border-gray-200">Tidak Dikenal</span>;
  return <span className={`inline-flex items-center text-[11px] px-2 py-0.5 rounded-full font-semibold border ${info.cls}`}>{info.label}</span>;
}
