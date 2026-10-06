<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('heritage_sites', function (Blueprint $table) {
            $table->id();
            $table->string('nama', 200);
            $table->string('slug', 220)->unique();
            $table->enum('kategori', ['masjid', 'makam', 'rumah_adat', 'desa_adat']);
            $table->decimal('lat', 10, 7);
            $table->decimal('lng', 10, 7);
            $table->text('deskripsi')->nullable();
            $table->longText('sejarah')->nullable();
            $table->string('tahun_berdiri', 50)->nullable();
            $table->string('wilayah', 100);
            $table->string('kecamatan', 100)->nullable();
            $table->enum('kondisi_saat_ini', ['baik', 'sedang', 'buruk', 'belum_dikaji'])->default('belum_dikaji');

            $table->boolean('status_aktif')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('heritage_sites');
    }
};
