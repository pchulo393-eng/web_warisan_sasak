<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('heritage_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('heritage_id')->constrained('heritage_sites')->cascadeOnDelete();
            $table->string('url_foto', 500);
            $table->string('url_thumbnail', 500)->nullable();

            $table->boolean('is_primary')->default(false);
            $table->integer('urutan')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('heritage_photos');
    }
};
