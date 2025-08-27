@echo off
setlocal enabledelayedexpansion

echo 🚀 Setting up SuperMall E-commerce Platform...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version

REM Install dependencies
echo 📦 Installing dependencies...
npm install
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

REM Create environment file if it doesn't exist
if not exist \".env.local\" (
    echo 🔧 Creating environment configuration...
    copy \".env.example\" \".env.local\" >nul
    echo ✅ Environment file created (.env.local)
    echo ⚠️  Please update .env.local with your MongoDB connection string
) else (
    echo ✅ Environment file already exists
)

REM Create a simple test script for MongoDB
echo 🔍 Checking MongoDB connection...
echo const mongoose = require('mongoose'); > test-db.js
echo require('dotenv').config({ path: '.env.local' }); >> test-db.js
echo. >> test-db.js
echo async function testConnection() { >> test-db.js
echo   try { >> test-db.js
echo     await mongoose.connect(process.env.MONGO_URL ^|^| 'mongodb://localhost:27017/supermall'); >> test-db.js
echo     console.log('✅ MongoDB connection successful'); >> test-db.js
echo     process.exit(0); >> test-db.js
echo   } catch (error) { >> test-db.js
echo     console.log('❌ MongoDB connection failed:', error.message); >> test-db.js
echo     console.log('Please ensure MongoDB is running or update MONGO_URL in .env.local'); >> test-db.js
echo     process.exit(1); >> test-db.js
echo   } >> test-db.js
echo } >> test-db.js
echo. >> test-db.js
echo testConnection(); >> test-db.js

node test-db.js
set \"DB_TEST_RESULT=%errorlevel%\"

REM Clean up test file
del test-db.js >nul 2>&1

if %DB_TEST_RESULT% equ 0 (
    echo 🎉 Setup completed successfully!
    echo.
    echo 🚀 To start the development server:
    echo    npm run dev
    echo.
    echo 📱 Application will be available at: http://localhost:3000
    echo.
    echo 📚 Default accounts to test:
    echo    Admin: Create via /auth/register with role 'admin'
    echo    Vendor: Create via /auth/register with role 'vendor'
    echo    Customer: Create via /auth/register with role 'user'
    echo.
    echo 📖 For more information, check the README.md file
) else (
    echo ⚠️  Setup completed with warnings. Please configure MongoDB connection.
    echo Update MONGO_URL in .env.local and ensure MongoDB is running.
)

echo.
echo Happy coding! 🎊
pause