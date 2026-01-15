#!/bin/bash

# This script sets up and runs both frontend and backend# WHRTHR App - Quick Start Script


echo "🌤️  WHRTHR App - Quick Start"
echo "================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.httpjs is not installed. Please install it first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Frontend dependency installation failed."
    exit 1
fi

# Build frontend
echo ""
echo "🔨 Building frontend..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful!"
else
    echo "❌ Frontend build failed."
    exit 1
fi

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd backend

if [ $? -ne 0 ]; then
    echo "❌ Failed to navigate to backend directory."
    exit 1
fi

npm install

if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed!"
else
    echo "❌ Backend setup failed."
    exit 1
fi

cd ..

echo ""
echo "================================"
echo "✨ Setup Complete!"
echo "================================"
echo ""
echo "🚀 To start the application:"
echo ""
echo "Terminal 1 (Frontend):"
echo "  npm run dev"
echo "  → ://localhost:5173"
echo ""
echo "Terminal 2 (Backend):"
echo "  cd backend && npm start"
echo "  → http://localhost:3000"
echo ""
echo "📖 Documentation:"
echo "  - SETUP_GUIDE.md - Complete setup instructions"
echo "  - backend/README.md - Backend API documentation"
echo "  - COMPLETION_REPORT.md - Feature summary"
echo ""
