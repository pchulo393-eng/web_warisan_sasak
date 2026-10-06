<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class HeritageSite extends Model
{
    protected $table = 'heritage_sites';

    protected $fillable = [
        'nama', 'slug', 'kategori', 'lat', 'lng',
        'deskripsi', 'sejarah', 'tahun_berdiri',
        'kecamatan', 'wilayah', 'kondisi_saat_ini',
        'status_aktif'
    ];

    protected $casts = [
        'lat' => 'float',
        'lng' => 'float',
        'skor_kondisi_cnn' => 'float',
        'status_aktif' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->nama);
            }
        });
    }

    public function photos()
    {
        return $this->hasMany(HeritagePhoto::class, 'heritage_id')->orderBy('urutan');
    }

    public function primaryPhoto()
    {
        return $this->hasOne(HeritagePhoto::class, 'heritage_id')->where('is_primary', true);
    }

    public function scopeKategori($query, $kategori)
    {
        return $query->where('kategori', $kategori);
    }

    public function scopeKecamatan($query, $kecamatan)
    {
        return $query->where('kecamatan', $kecamatan);
    }

    public function toGeoJsonFeature(): array
    {
        $displayPhoto = $this->primaryPhoto ?? $this->photos->first();
        return [
            'type' => 'Feature',
            'geometry' => [
                'type' => 'Point',
                'coordinates' => [$this->lng, $this->lat]
            ],
            'properties' => [
                'id' => $this->id,
                'nama' => $this->nama,
                'kategori' => $this->kategori,
                'kecamatan' => $this->kecamatan,
                'kondisi' => $this->kondisi_saat_ini,
                'thumbnail' => $displayPhoto ? asset('storage/' . $displayPhoto->url_thumbnail) : null,
            ]
        ];
    }
}
