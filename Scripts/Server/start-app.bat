@echo off
setlocal
set ROOT=%~dp0

echo ============================================
echo   GhummGhamm - Starting Application
echo ============================================

:: ── 1. Start MongoDB ──────────────────────────────────────────────────────────
set MONGO_BIN=%ROOT%mongodb\mongodb-win32-x86_64-windows-7.0.14\bin
set DATA_DIR=%ROOT%mongodb\data\db
set LOG_DIR=%ROOT%mongodb\log

if not exist "%DATA_DIR%" mkdir "%DATA_DIR%"
if not exist "%LOG_DIR%"  mkdir "%LOG_DIR%"

tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I "mongod.exe" >NUL
if %ERRORLEVEL%==0 (
    echo [1/3] MongoDB already running.
) else (
    echo [1/3] Starting MongoDB...
    start "MongoDB" /MIN "%MONGO_BIN%\mongod.exe" --dbpath "%DATA_DIR%" --logpath "%LOG_DIR%\mongod.log" --logappend --port 27118
    timeout /t 5 /nobreak >NUL
    tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I "mongod.exe" >NUL
    if %ERRORLEVEL%==0 (
        echo        MongoDB started on port 27118.
    ) else (
        echo        ERROR: MongoDB failed to start. Check log: %LOG_DIR%\mongod.log
        pause
        exit /b 1
    )
)

:: ── 2. Start Backend Server ───────────────────────────────────────────────────
echo [2/3] Starting backend server (port 5742)...
start "GhummGhamm Backend" /MIN cmd /k "cd /d "%ROOT%server" && node server.js"
timeout /t 2 /nobreak >NUL

:: ── 3. Start Vite Dev Server ──────────────────────────────────────────────────
echo [3/3] Starting frontend dev server (port 3838)...
start "GhummGhamm Frontend" /MIN cmd /k "cd /d "%ROOT%client" && npm run dev"
timeout /t 3 /nobreak >NUL

:: ── 4. Open browser ──────────────────────────────────────────────────────────
echo.
echo ============================================
echo   App running!
echo   Frontend : http://localhost:3838
  echo   Backend  : http://localhost:5742/api/health
echo ============================================
echo.
start "" "http://localhost:3838"

endlocal
