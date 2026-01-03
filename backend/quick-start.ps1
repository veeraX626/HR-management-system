# Dayflow HRMS - Quick Start Setup Script (Windows PowerShell)
# This script prepares the backend for testing

Write-Host "🚀 Dayflow HRMS Backend - Quick Start Setup" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}
Write-Host ""

# Navigate to backend directory
Write-Host "📂 Navigating to backend directory..." -ForegroundColor Cyan
Set-Location backend -ErrorAction Stop
Write-Host "✅ In backend directory" -ForegroundColor Green
Write-Host ""

# Check if dependencies are installed
if (-Not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}
Write-Host ""

# Reset database and seed
Write-Host "🗄️  Resetting database..." -ForegroundColor Yellow
npm run db:reset
Write-Host "✅ Database reset complete" -ForegroundColor Green
Write-Host ""

Write-Host "🌱 Seeding database with test data..." -ForegroundColor Yellow
npm run prisma:seed
Write-Host "✅ Database seeded" -ForegroundColor Green
Write-Host ""

# Display test credentials
Write-Host "==============================================" -ForegroundColor Green
Write-Host "📋 Test Credentials (Ready to Use)" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green
Write-Host ""
Write-Host "🔐 ADMIN (HR001):" -ForegroundColor Cyan
Write-Host "   Email: admin@dayflow.com" -ForegroundColor White
Write-Host "   Password: Admin123" -ForegroundColor White
Write-Host ""
Write-Host "👤 EMPLOYEE 1 (E001):" -ForegroundColor Cyan
Write-Host "   Email: employee1@dayflow.com" -ForegroundColor White
Write-Host "   Password: Employee@123456" -ForegroundColor White
Write-Host ""
Write-Host "👤 EMPLOYEE 2 (E002):" -ForegroundColor Cyan
Write-Host "   Email: employee2@dayflow.com" -ForegroundColor White
Write-Host "   Password: Employee@123456" -ForegroundColor White
Write-Host ""
Write-Host "👤 EMPLOYEE 3 (E003):" -ForegroundColor Cyan
Write-Host "   Email: employee3@dayflow.com" -ForegroundColor White
Write-Host "   Password: Employee@123456" -ForegroundColor White
Write-Host ""

Write-Host "==============================================" -ForegroundColor Green
Write-Host "🚀 Starting development server..." -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Server will run on: http://localhost:5000" -ForegroundColor Cyan
Write-Host "API Base URL: http://localhost:5000/api" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Yellow
Write-Host "   - Full Testing Guide: POSTMAN_TESTING.md" -ForegroundColor White
Write-Host "   - Auth Implementation: AUTH_IMPLEMENTATION.md" -ForegroundColor White
Write-Host "   - Postman Collection: Dayflow-HRMS-Auth-Collection.postman_collection.json" -ForegroundColor White
Write-Host ""
Write-Host "🧪 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Open Postman" -ForegroundColor White
Write-Host "   2. Import: Dayflow-HRMS-Auth-Collection.postman_collection.json" -ForegroundColor White
Write-Host "   3. Replace YOUR_ADMIN_TOKEN_HERE with token from step 2" -ForegroundColor White
Write-Host "   4. Run test requests" -ForegroundColor White
Write-Host ""

npm run dev
