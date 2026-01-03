#!/bin/bash

# Dayflow HRMS - Quick Start Setup Script
# This script prepares the backend for testing

echo "🚀 Dayflow HRMS Backend - Quick Start Setup"
echo "=============================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Navigate to backend directory
echo "📂 Navigating to backend directory..."
cd backend || exit 1
echo "✅ In backend directory"
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi
echo ""

# Reset database and seed
echo "🗄️  Resetting database..."
npm run db:reset
echo "✅ Database reset complete"
echo ""

echo "🌱 Seeding database with test data..."
npm run prisma:seed
echo "✅ Database seeded"
echo ""

# Display test credentials
echo "=============================================="
echo "📋 Test Credentials (Ready to Use)"
echo "=============================================="
echo ""
echo "🔐 ADMIN (HR001):"
echo "   Email: admin@dayflow.com"
echo "   Password: Admin123"
echo ""
echo "👤 EMPLOYEE 1 (E001):"
echo "   Email: employee1@dayflow.com"
echo "   Password: Employee@123456"
echo ""
echo "👤 EMPLOYEE 2 (E002):"
echo "   Email: employee2@dayflow.com"
echo "   Password: Employee@123456"
echo ""
echo "👤 EMPLOYEE 3 (E003):"
echo "   Email: employee3@dayflow.com"
echo "   Password: Employee@123456"
echo ""

echo "=============================================="
echo "🚀 Starting development server..."
echo "=============================================="
echo ""
echo "Server will run on: http://localhost:5000"
echo "API Base URL: http://localhost:5000/api"
echo ""
echo "📚 Documentation:"
echo "   - Full Testing Guide: POSTMAN_TESTING.md"
echo "   - Auth Implementation: AUTH_IMPLEMENTATION.md"
echo "   - Postman Collection: Dayflow-HRMS-Auth-Collection.postman_collection.json"
echo ""
echo "🧪 Next Steps:"
echo "   1. Open Postman"
echo "   2. Import: Dayflow-HRMS-Auth-Collection.postman_collection.json"
echo "   3. Replace YOUR_ADMIN_TOKEN_HERE with token from step 2"
echo "   4. Run test requests"
echo ""

npm run dev
