@echo off
echo ============================================
echo   GhummGhamm - Stopping Application
echo ============================================

echo Stopping frontend (Vite)...
taskkill /FI "WINDOWTITLE eq GhummGhamm Frontend*" /T /F >NUL 2>&1

echo Stopping backend (Node)...
taskkill /FI "WINDOWTITLE eq GhummGhamm Backend*" /T /F >NUL 2>&1

echo Stopping MongoDB...
taskkill /F /IM mongod.exe /T >NUL 2>&1

timeout /t 2 /nobreak >NUL
echo All services stopped.
