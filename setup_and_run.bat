@echo off
echo ==========================================
echo   Focus Flow Ecosystem - Quick Launcher
echo ==========================================

echo [1/3] Checking for Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in your PATH.
    echo Please install it from https://nodejs.org/
    pause
    exit /b
)

echo [2/3] Installing dependencies...
if not exist node_modules (
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies.
        pause
        exit /b
    )
) else (
    echo Dependencies already installed.
)

echo [3/3] Starting Development Server...
echo.
echo The app will open at http://localhost:8080 (or similar)
echo Press Ctrl+C to stop the server.
echo.
call npm run dev
pause
