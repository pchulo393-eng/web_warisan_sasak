@echo off
echo ==========================================
echo   SETUP PERTAMA KALI - WARISAN SASAK
echo ==========================================
echo.

echo [1] Migrate & Seed Database...
cd /d D:\warisan-sasak\backend
php artisan migrate:fresh --seed
php artisan storage:link
echo.

echo [2] Install Frontend Dependencies...
cd /d D:\warisan-sasak\frontend
call npm install
echo.

echo ==========================================
echo   SETUP SELESAI!
echo   Jalankan: run.bat
echo ==========================================
pause
