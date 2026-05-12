@echo off
setlocal

set MONGO_DIR=%~dp0mongodb\mongodb-win32-x86_64-windows-7.0.14\bin
set DATA_DIR=%~dp0mongodb\data\db
set LOG_DIR=%~dp0mongodb\log
set LOG_FILE=%LOG_DIR%\mongod.log

:: Create required directories if they don't exist
if not exist "%DATA_DIR%" (
    echo Creating data directory...
    mkdir "%DATA_DIR%"
)
if not exist "%LOG_DIR%" (
    mkdir "%LOG_DIR%"
)

:: Check if mongod is already running
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I "mongod.exe" >NUL
if %ERRORLEVEL%==0 (
    echo MongoDB is already running.
    goto :end
)

echo Starting MongoDB...
start "MongoDB" "%MONGO_BIN%\mongod.exe" --dbpath "%DATA_DIR%" --logpath "%LOG_FILE%" --logappend --port 27118

:: Wait a moment and verify it started
timeout /t 3 /nobreak >NUL
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I "mongod.exe" >NUL
if %ERRORLEVEL%==0 (
    echo MongoDB started successfully on port 27118.
    echo Data directory : %DATA_DIR%
    echo Log file       : %LOG_FILE%
) else (
    echo ERROR: MongoDB failed to start. Check log: %LOG_FILE%
)

:end
endlocal
pause
