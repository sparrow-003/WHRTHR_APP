@echo off
REM WHRTHR App - Quick Start Script (Windows)

echo.
echo 🌤️  WHRTHR App - Quick Start
echo ================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install it first.
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version
echo ✅ npm version:
npm --version
echo.

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Frontend setup failed.
    pause
    exit /b 1
)
echo.

REM Build frontend
echo 🔨 Building frontend...
call npm run build
if errorlevel 1 (
    echo ❌ Frontend build failed.
    pause
    exit /b 1
)
echo ✅ Frontend build successful!
echo.

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo ❌ Backend setup failed.
    cd ..
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed!
echo.
cd ..

echo ================================
echo ✨ Setup Complete!
echo ================================
echo.
echo 🚀 To start the application:
echo.
echo Command 1 (Frontend - in this folder):
echo   npm run dev
echo   → http://localhost:5173
echo.
echo Command 2 (Backend - in new terminal):
echo   cd backend
echo   npm start
echo   → http://localhost:3000
echo.
echo 📖 Documentation:
echo   - SETUP_GUIDE.md - Complete setup instructions
echo   - backend\README.md - Backend API documentation
echo   - COMPLETION_REPORT.md - Feature summary
echo.
pause
