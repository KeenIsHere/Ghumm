@echo off
setlocal

tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I "mongod.exe" >NUL
if %ERRORLEVEL% NEQ 0 (
    echo MongoDB is not running.
    goto :end
)

echo Stopping MongoDB...
taskkill /F /IM mongod.exe /T >NUL 2>&1

timeout /t 2 /nobreak >NUL

tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I "mongod.exe" >NUL
if %ERRORLEVEL% NEQ 0 (
    echo MongoDB stopped successfully.
) else (
    echo ERROR: Could not stop MongoDB.
)

:end
endlocal
pause
