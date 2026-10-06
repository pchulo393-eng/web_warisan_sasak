<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\HeritageController;
use App\Http\Controllers\Api\PhotoController;
use Illuminate\Support\Facades\Route;

// PUBLIK
Route::get('/heritage/geojson', [HeritageController::class, 'geojson']);
Route::get('/heritage', [HeritageController::class, 'index']);
Route::get('/heritage/{id}', [HeritageController::class, 'show']);

// AUTH
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    Route::post('/admin/heritage', [HeritageController::class, 'store']);
    Route::put('/admin/heritage/{id}', [HeritageController::class, 'update']);
    Route::delete('/admin/heritage/{id}', [HeritageController::class, 'destroy']);

    Route::post('/admin/heritage/{id}/photos', [PhotoController::class, 'store']);
    Route::delete('/admin/heritage/{heritageId}/photos/{fotoId}', [PhotoController::class, 'destroy']);
    Route::patch('/admin/heritage/{heritageId}/photos/{fotoId}/primary', [PhotoController::class, 'setPrimary']);
    Route::get('/metrics', function () {
    $url = env('CNN_SERVICE_URL', 'http://localhost:5001') . '/metrics';
    try {
        $response = Http::timeout(5)->get($url);
        if ($response->successful()) {
            return response()->json($response->json());
        }
        return response()->json(['error' => 'CNN metrics error'], $response->status());
    } catch (\Throwable $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});
});
