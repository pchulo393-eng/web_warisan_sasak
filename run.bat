@echo off
echo ==========================================
echo   WARISAN BUDAYA SASAK - START ALL SERVICES
echo ==========================================
echo.

:: 1. Backend Laravel
echo [1/3] Starting Backend Laravel (port 8001)...
start "Backend Laravel" cmd /c "cd /d D:\warisan-sasak\backend && php artisan serve --port=8001"
timeout /t 3 /nobreak >nul

:: 2. CNN Service Python
echo [2/3] Starting CNN Service (port 5001)...
start "CNN Service" cmd /c "cd /d D:\warisan-sasak\cnn-service && D:\warisan-sasak\cnn-env\Scripts\python.exe app.py"
timeout /t 3 /nobreak >nul

:: 3. Frontend React
echo [3/3] Starting Frontend React (port 5174)...
start "Frontend React" cmd /c "cd /d D:\warisan-sasak\frontend && npm run dev"
timeout /t 2 /nobreak >nul

echo.
echo ==========================================
echo   SEMUA SERVICE SUDAH JALAN!
echo ==========================================
echo.
echo   Backend  : http://localhost:8001
echo   Frontend : http://localhost:5174
echo   CNN      : http://localhost:5002
echo.
echo   Buka browser: http://localhost:5174
echo   Login admin : admin@warisan.com / admin123
echo.
pause
