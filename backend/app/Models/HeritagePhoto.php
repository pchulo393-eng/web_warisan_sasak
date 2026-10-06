<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HeritagePhoto extends Model
{
    protected $fillable = [
        'heritage_id', 'url_foto', 'url_thumbnail',
        'label_tipe_cnn', 'skor_tipe_cnn',
        'is_primary', 'urutan'
    ];

    protected $casts = [
        'skor_tipe_cnn' => 'float',
        'is_primary' => 'boolean',
    ];

    public function heritage()
    {
        return $this->belongsTo(HeritageSite::class, 'heritage_id');
    }
}
