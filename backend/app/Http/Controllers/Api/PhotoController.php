<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HeritagePhoto;
use App\Models\HeritageSite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class PhotoController extends Controller
{
    public function store(Request $request, $heritageId)
    {
        $request->validate([
            'foto' => 'required|file|mimes:jpeg,jpg,png,webp|max:10240',
        ]);

        $heritage = HeritageSite::findOrFail($heritageId);
        $file = $request->file('foto');
        $path = $file->store('heritage-photos', 'public');

        $thumbPath = 'heritage-photos/thumb_' . basename($path);
        $thumbPathFull = $path;

        try {
            $img = \Intervention\Image\Facades\Image::make($file)->fit(400, 300);
            Storage::disk('public')->put($thumbPath, $img->encode());
            $thumbPathFull = $thumbPath;
        } catch (\Throwable $e) {
            // fallback ke foto asli
        }

        $cnnTipe = null;
        $cnnSkorTipe = null;

        $cnnUrl = env('CNN_SERVICE_URL', 'http://localhost:5001');
        $fileContent = Storage::disk('public')->get($path);
        $fileName = basename($path);

        try {
            $responseTipe = Http::timeout(10)->attach('foto', $fileContent, $fileName)->post("$cnnUrl/classify-type");
            if ($responseTipe->successful()) {
                $resultTipe = $responseTipe->json();
                $cnnTipe = $resultTipe['tipe'] ?? null;
                $cnnSkorTipe = $resultTipe['confidence'] ?? null;
                if (!in_array($cnnTipe, ['masjid', 'makam', 'rumah_adat'])) {
                    $cnnTipe = null;
                    $cnnSkorTipe = null;
                }
            }
        } catch (\Throwable $e) {}

        $isPrimary = $heritage->photos()->count() === 0;

        $foto = HeritagePhoto::create([
            'heritage_id'       => $heritageId,
            'url_foto'          => $path,
            'url_thumbnail'     => $thumbPathFull,
            'label_tipe_cnn'    => $cnnTipe,
            'skor_tipe_cnn'     => $cnnSkorTipe,
            'is_primary'        => $isPrimary,
            'urutan'            => $heritage->photos()->count(),
        ]);

        return response()->json([
            'data' => [
                'id' => $foto->id,
                'url_foto' => asset('storage/' . $path),
                'url_thumbnail' => asset('storage/' . $thumbPathFull),
                'label_tipe_cnn' => $cnnTipe,
                'skor_tipe_cnn' => $cnnSkorTipe,
                'is_primary' => $isPrimary,
            ],
            'message' => 'Foto berhasil diupload dan diklasifikasikan tipe bangunan dengan CNN'
        ], 201);
    }

    public function reAnalyze($heritageId, $fotoId)
    {
        $foto = HeritagePhoto::where('heritage_id', $heritageId)->findOrFail($fotoId);
        $cnnUrl = env('CNN_SERVICE_URL', 'http://localhost:5001');
        $fileContent = Storage::disk('public')->get($foto->url_foto);
        $fileName = basename($foto->url_foto);

        $cnnTipe = $foto->label_tipe_cnn;
        $cnnSkorTipe = $foto->skor_tipe_cnn;

        try {
            $responseTipe = Http::timeout(10)->attach('foto', $fileContent, $fileName)->post("$cnnUrl/classify-type");
            if ($responseTipe->successful()) {
                $resultTipe = $responseTipe->json();
                $cnnTipe = $resultTipe['tipe'] ?? $cnnTipe;
                $cnnSkorTipe = $resultTipe['confidence'] ?? $cnnSkorTipe;
                if (!in_array($cnnTipe, ['masjid', 'makam', 'rumah_adat'])) {
                    $cnnTipe = $foto->label_tipe_cnn;
                    $cnnSkorTipe = $foto->skor_tipe_cnn;
                }
            }
        } catch (\Throwable $e) {}

        $foto->update([
            'label_tipe_cnn' => $cnnTipe,
            'skor_tipe_cnn' => $cnnSkorTipe,
        ]);

        return response()->json([
            'data' => [
                'id' => $foto->id,
                'label_tipe_cnn' => $cnnTipe,
                'skor_tipe_cnn' => $cnnSkorTipe,
            ],
            'message' => 'Foto berhasil dianalisis ulang'
        ]);
    }

    public function destroy($heritageId, $fotoId)
    {
        $foto = HeritagePhoto::where('heritage_id', $heritageId)->findOrFail($fotoId);
        Storage::disk('public')->delete($foto->url_foto);
        if ($foto->url_thumbnail && $foto->url_thumbnail !== $foto->url_foto) {
            Storage::disk('public')->delete($foto->url_thumbnail);
        }
        $foto->delete();
        return response()->json(['message' => 'Foto berhasil dihapus']);
    }

    public function setPrimary($heritageId, $fotoId)
    {
        HeritagePhoto::where('heritage_id', $heritageId)->update(['is_primary' => false]);
        HeritagePhoto::where('heritage_id', $heritageId)->findOrFail($fotoId)->update(['is_primary' => true]);
        return response()->json(['message' => 'Foto utama berhasil diubah']);
    }
}
