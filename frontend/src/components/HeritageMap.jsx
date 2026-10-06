import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import { heritageApi } from '../services/api';

// Icon URLs per kategori
const ICONS = {
  masjid:     { url: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png' },
  makam:      { url: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png' },
  rumah_adat: { url: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png' },
  desa_adat:  { url: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png' },
};

const makeIcon = (kategori) => L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

const KONDISI_WARNA = {
  baik: '#1D9E75',
  sedang: '#BA7517',
  buruk: '#E24B4A',
  belum_dikaji: '#888',
};

export default function HeritageMap({ filter = {}, onSelect, height = '100%' }) {
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    heritageApi.getGeoJson().then(res => setFeatures(res.data.features || [])).catch(() => {});
  }, []);

  const filtered = features.filter(f => {
    const p = f.properties;
    if (filter.kategori && p.kategori !== filter.kategori) return false;
    if (filter.kecamatan && p.kecamatan !== filter.kecamatan) return false;
    return true;
  });

  return (
    <div style={{ height, width: '100%' }}>
      <MapContainer center={[-8.65, 116.35]} zoom={10} style={{ height: '100%', width: '100%' }}>
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>' />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satelit">
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="&copy; Esri" />
          </LayersControl.BaseLayer>
        </LayersControl>

        {filtered.map(f => (
          <Marker
            key={f.properties.id}
            position={[f.geometry.coordinates[1], f.geometry.coordinates[0]]}
            icon={makeIcon(f.properties.kategori)}
          >
            <Popup>
              <div style={{ minWidth: 180 }}>
                {f.properties.thumbnail && (
                  <img src={f.properties.thumbnail} alt={f.properties.nama}
                    style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 4, marginBottom: 8 }} />
                )}
                <strong style={{ fontSize: 13 }}>{f.properties.nama}</strong>
                <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>{f.properties.kecamatan || f.properties.wilayah}</div>
                <div style={{ marginTop: 4, display: 'flex', gap: 4, alignItems: 'center' }}>
                  <span style={{
                    background: KONDISI_WARNA[f.properties.kondisi],
                    color: 'white', fontSize: 10, padding: '2px 6px', borderRadius: 4
                  }}>
                    {f.properties.kondisi?.toUpperCase() || 'BELUM DIKAJI'}
                  </span>
                </div>
                <div style={{ marginTop: 8, display: 'flex', gap: 4 }}>
                  <a href={`/heritage/${f.properties.id}`}
                    style={{ fontSize: 11, padding: '4px 8px', background: '#1D9E75', color: 'white', borderRadius: 4, textDecoration: 'none' }}>
                    Detail
                  </a>
                  <a href={`https://maps.google.com/maps?q=${f.geometry.coordinates[1]},${f.geometry.coordinates[0]}`}
                    target="_blank" rel="noreferrer"
                    style={{ fontSize: 11, padding: '4px 8px', background: '#378ADD', color: 'white', borderRadius: 4, textDecoration: 'none' }}>
                    Navigasi
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

