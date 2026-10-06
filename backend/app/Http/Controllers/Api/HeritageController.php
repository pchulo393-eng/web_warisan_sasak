<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HeritageSite;
use Illuminate\Http\Request;

class HeritageController extends Controller
{
    public function index(Request $request)
    {
        $query = HeritageSite::with(['primaryPhoto', 'photos'])->where('status_aktif', true);

        if ($request->has('kategori') && $request->kategori !== '') {
            $query->where('kategori', $request->kategori);
        }
        if ($request->has('kecamatan') && $request->kecamatan !== '') {
            $query->where('kecamatan', $request->kecamatan);
        }
        if ($request->has('q') && $request->q !== '') {
            $query->where(function ($q) use ($request) {
                $q->where('nama', 'like', "%{$request->q}%")
                  ->orWhere('deskripsi', 'like', "%{$request->q}%")
                  ->orWhere('wilayah', 'like', "%{$request->q}%")
                  ->orWhere('kecamatan', 'like', "%{$request->q}%");
            });
        }

        $data = $query->get()->map(function ($h) {
            $displayPhoto = $h->primaryPhoto ?? $h->photos->first();
            return [
                'id' => $h->id,
                'nama' => $h->nama,
                'slug' => $h->slug,
                'kategori' => $h->kategori,
                'wilayah' => $h->wilayah,
                'tahun_berdiri' => $h->tahun_berdiri,
                'kondisi_saat_ini' => $h->kondisi_saat_ini,
                'skor_kondisi_cnn' => $h->skor_kondisi_cnn,
                'lat' => $h->lat,
                'lng' => $h->lng,
                'thumbnail' => $displayPhoto ? asset('storage/' . $displayPhoto->url_thumbnail) : null,
            ];
        });

        return response()->json(['data' => $data, 'total' => $data->count()]);
    }

    public function show($id)
    {
        $heritage = HeritageSite::with('photos')->findOrFail($id);
        return response()->json([
            'data' => array_merge($heritage->toArray(), [
                'foto' => $heritage->photos->map(fn ($p) => [
                    'id' => $p->id,
                    'url_foto' => asset('storage/' . $p->url_foto),
                    'url_thumbnail' => $p->url_thumbnail ? asset('storage/' . $p->url_thumbnail) : null,
                    'label_tipe_cnn' => $p->label_tipe_cnn,
                    'skor_tipe_cnn' => $p->skor_tipe_cnn,
                    'is_primary' => $p->is_primary,
                ])
            ])
        ]);
    }

    public function geojson()
    {
        $features = HeritageSite::with('primaryPhoto')
            ->where('status_aktif', true)
            ->get()
            ->map(fn ($h) => $h->toGeoJsonFeature());

        return response()->json([
            'type' => 'FeatureCollection',
            'features' => $features
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama'         => 'required|string|max:200',
            'kategori'     => 'required|in:masjid,makam,rumah_adat,desa_adat',
            'lat'          => 'required|numeric|between:-9.5,-8.0',
            'lng'          => 'required|numeric|between:115.5,117.5',
            'wilayah'      => 'required|string',
            'deskripsi'    => 'nullable|string',
            'sejarah'      => 'nullable|string',
            'tahun_berdiri'=> 'nullable|string',
            'kecamatan'    => 'nullable|string',
            'kondisi_saat_ini' => 'nullable|in:baik,sedang,buruk,belum_dikaji',
        ]);

        $heritage = HeritageSite::create($validated);
        return response()->json(['data' => $heritage, 'message' => 'Heritage berhasil ditambahkan'], 201);
    }

    public function update(Request $request, $id)
    {
        $heritage = HeritageSite::findOrFail($id);
        $heritage->update($request->validate([
            'nama'         => 'sometimes|string|max:200',
            'kategori'     => 'sometimes|in:masjid,makam,rumah_adat,desa_adat',
            'lat'          => 'sometimes|numeric|between:-9.5,-8.0',
            'lng'          => 'sometimes|numeric|between:115.5,117.5',
            'wilayah'      => 'sometimes|string',
            'deskripsi'    => 'nullable|string',
            'sejarah'      => 'nullable|string',
            'tahun_berdiri'=> 'nullable|string',
            'kecamatan'    => 'nullable|string',
            'kondisi_saat_ini' => 'nullable|in:baik,sedang,buruk,belum_dikaji',
            'status_aktif' => 'sometimes|boolean',
        ]));
        return response()->json(['data' => $heritage, 'message' => 'Heritage berhasil diperbarui']);
    }

    public function destroy($id)
    {
        HeritageSite::findOrFail($id)->delete();
        return response()->json(['message' => 'Heritage berhasil dihapus']);
    }
}
