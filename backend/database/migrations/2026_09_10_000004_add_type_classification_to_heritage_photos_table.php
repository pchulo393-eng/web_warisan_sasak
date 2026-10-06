<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('heritage_photos', function (Blueprint $table) {
            $table->string('label_tipe_cnn', 50)->nullable()->after('label_kondisi_cnn');
            $table->decimal('skor_tipe_cnn', 5, 4)->nullable()->after('skor_cnn');
        });
    }

    public function down(): void
    {
        Schema::table('heritage_photos', function (Blueprint $table) {
            $table->dropColumn(['label_tipe_cnn', 'skor_tipe_cnn']);
        });
    }
};
