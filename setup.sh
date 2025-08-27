#!/bin/bash

# SuperMall Quick Setup Script

echo \"🚀 Setting up SuperMall E-commerce Platform...\"

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo \"❌ Node.js is not installed. Please install Node.js 18+ first.\"
    echo \"Download from: https://nodejs.org/\"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ \"$NODE_VERSION\" -lt 18 ]; then
    echo \"❌ Node.js version 18+ is required. Current version: $(node -v)\"
    exit 1
fi

echo \"✅ Node.js version: $(node -v)\"

# Install dependencies
echo \"📦 Installing dependencies...\"
npm install

if [ $? -ne 0 ]; then
    echo \"❌ Failed to install dependencies\"
    exit 1
fi

# Create environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo \"🔧 Creating environment configuration...\"
    cp .env.example .env.local
    echo \"✅ Environment file created (.env.local)\"
    echo \"⚠️  Please update .env.local with your MongoDB connection string\"
else
    echo \"✅ Environment file already exists\"
fi

# Check if MongoDB is accessible
echo \"🔍 Checking MongoDB connection...\"

# Create a simple test script
cat > test-db.js << 'EOF'
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/supermall');
    console.log('✅ MongoDB connection successful');
    process.exit(0);
  } catch (error) {
    console.log('❌ MongoDB connection failed:', error.message);
    console.log('Please ensure MongoDB is running or update MONGO_URL in .env.local');
    process.exit(1);
  }
}

testConnection();
EOF

node test-db.js
DB_TEST_RESULT=$?

# Clean up test file
rm test-db.js

if [ $DB_TEST_RESULT -eq 0 ]; then
    echo \"🎉 Setup completed successfully!\"
    echo \"\"
    echo \"🚀 To start the development server:\"
    echo \"   npm run dev\"
    echo \"\"
    echo \"📱 Application will be available at: http://localhost:3000\"
    echo \"\"
    echo \"📚 Default accounts to test:\"
    echo \"   Admin: Create via /auth/register with role 'admin'\"
    echo \"   Vendor: Create via /auth/register with role 'vendor'\"
    echo \"   Customer: Create via /auth/register with role 'user'\"
    echo \"\"
    echo \"📖 For more information, check the README.md file\"
else
    echo \"⚠️  Setup completed with warnings. Please configure MongoDB connection.\"
    echo \"Update MONGO_URL in .env.local and ensure MongoDB is running.\"
fi

echo \"\"
echo \"Happy coding! 🎊\"