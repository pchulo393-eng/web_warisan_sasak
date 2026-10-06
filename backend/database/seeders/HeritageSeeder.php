<?php

namespace Database\Seeders;

use App\Models\HeritageSite;
use Illuminate\Database\Seeder;

class HeritageSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'nama' => 'Makam Kuno Selaparang',
                'kategori' => 'makam',
                'wilayah' => 'Selaparang',
                'kecamatan' => 'Suwela',
                'lat' => -8.5467,
                'lng' => 116.6002,
                'tahun_berdiri' => 'Abad ke-14',
                'kondisi_saat_ini' => 'sedang',
                'deskripsi' => 'Situs pemakaman bersejarah raja-raja dan bangsawan Kerajaan Selaparang Islam di Lombok Timur.',
                'sejarah' => 'Kerajaan Selaparang merupakan salah satu pusat peradaban Islam tertua dan terbesar di Pulau Lombok.',
            ],
            [
                'nama' => 'Masjid Langgar Pusaka Sapit',
                'kategori' => 'masjid',
                'wilayah' => 'Suela',
                'kecamatan' => 'Suwela',
                'lat' => -8.4895,
                'lng' => 116.5538,
                'tahun_berdiri' => 'Abad ke-18',
                'kondisi_saat_ini' => 'baik',
                'deskripsi' => 'Masjid bersejarah di lereng Gunung Rinjani dengan arsitektur tradisional Sasak yang khas beratap ijuk.',
                'sejarah' => 'Dibangun sebagai pusat penyebaran Islam dan peribadatan masyarakat lereng Rinjani bagian timur.',
            ],
            [
                'nama' => 'Masjid Kuno Songak Sakra',
                'kategori' => 'masjid',
                'wilayah' => 'Sakra',
                'kecamatan' => 'Sakra',
                'lat' => -8.6616,
                'lng' => 116.5020,
                'tahun_berdiri' => 'Abad ke-16',
                'kondisi_saat_ini' => 'sedang',
                'deskripsi' => 'Masjid pusaka peninggalan penyebar agama Islam awal di kawasan selatan Lombok Timur.',
                'sejarah' => 'Memiliki tiang tunggal guru berukir motif kuno dan atap tumpang bertingkat khas akulturasi Sasak-Islam.',
            ],
            [
                'nama' => 'Rumah Adat Bale Belek Jerowaru',
                'kategori' => 'rumah_adat',
                'wilayah' => 'Jerowaru',
                'kecamatan' => 'Jerowaru',
                'lat' => -8.7884,
                'lng' => 116.4814,
                'tahun_berdiri' => 'Abad ke-19',
                'kondisi_saat_ini' => 'buruk',
                'deskripsi' => 'Rumah adat tradisional Sasak berukuran besar yang membutuhkan pemeliharaan dan konservasi intensif.',
                'sejarah' => 'Tempat berkumpul para tetua adat Jerowaru dalam memutuskan perkara adat dan upacara tradisi.',
            ],
            [
                'nama' => 'Makam Tanjung Selaparang',
                'kategori' => 'makam',
                'wilayah' => 'Selaparang',
                'kecamatan' => 'Suwela',
                'lat' => -8.5442,
                'lng' => 116.5970,
                'tahun_berdiri' => 'Abad ke-15',
                'kondisi_saat_ini' => 'sedang',
                'deskripsi' => 'Kompleks makam keramat di kawasan perbukitan Tanjung Selaparang yang sering diziarahi masyarakat.',
                'sejarah' => 'Berkaitan erat dengan silsilah raja-raja Selaparang dan penyebaran agama Islam di pesisir Lombok Timur.',
            ],
            [
                'nama' => 'Rumah Adat Limbungan Suela',
                'kategori' => 'rumah_adat',
                'wilayah' => 'Suela',
                'kecamatan' => 'Suwela',
                'lat' => -8.4811,
                'lng' => 116.6122,
                'tahun_berdiri' => 'Abad ke-13',
                'kondisi_saat_ini' => 'baik',
                'deskripsi' => 'Kompleks pemukiman tradisional Sasak tertua yang mempertahankan arsitektur atap ilalang dan dinding bambu.',
                'sejarah' => 'Perkampungan adat yang masih memegang teguh hukum adat dan filosofi tata ruang ruang Sasak asli.',
            ],
            [
                'nama' => 'Rumah Adat Beleq Sembalun',
                'kategori' => 'rumah_adat',
                'wilayah' => 'Sembalun',
                'kecamatan' => 'Sembalun',
                'lat' => -8.3638,
                'lng' => 116.5394,
                'tahun_berdiri' => 'Abad ke-12',
                'kondisi_saat_ini' => 'baik',
                'deskripsi' => 'Kompleks tujuh rumah adat tertua di lembah Sembalun di bawah kaki megah Gunung Rinjani.',
                'sejarah' => 'Merupakan cikal bakal masyarakat Sembalun dengan tradisi menjaga kelestarian alam dan nilai leluhur.',
            ],
            [
                'nama' => 'Masjid Kuno Bilok Pitung Sembalun',
                'kategori' => 'masjid',
                'wilayah' => 'Sembalun',
                'kecamatan' => 'Sembalun',
                'lat' => -8.2943,
                'lng' => 116.4863,
                'tahun_berdiri' => 'Abad ke-16',
                'kondisi_saat_ini' => 'sedang',
                'deskripsi' => 'Masjid kuno pegunungan yang sarat nilai sejarah dakwah para wali di lembah Sembalun.',
                'sejarah' => 'Saksi masuknya ajaran Islam ke pedalaman lembah Rinjani pada masa lampau.',
            ],
            [
                'nama' => 'Rumah Adat Sembalun Bumbung',
                'kategori' => 'rumah_adat',
                'wilayah' => 'Sembalun',
                'kecamatan' => 'Sembalun',
                'lat' => -8.3880,
                'lng' => 116.5426,
                'tahun_berdiri' => 'Abad ke-18',
                'kondisi_saat_ini' => 'baik',
                'deskripsi' => 'Rumah adat khas dataran tinggi Sembalun Bumbung yang masih terawat baik dengan konstruksi kayu alami.',
                'sejarah' => 'Mencerminkan kearifan arsitektur tahan gempa warisan nenek moyang suku Sasak.',
            ],
        ];

        foreach ($data as $item) {
            HeritageSite::create($item);
        }
    }
}
