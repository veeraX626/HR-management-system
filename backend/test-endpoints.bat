@echo off
REM Dayflow HRMS Backend Testing Script
REM Tests the complete refactored backend workflow

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║   🧪 DAYFLOW HRMS BACKEND TEST SUITE                           ║
echo ║   Testing complete workflow per mentor specification           ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

set "BASE_URL=http://localhost:5000"
set "ADMIN_EMAIL=admin@dayflow.com"
set "ADMIN_PASSWORD=Admin123"
set "EMPLOYEE_EMAIL=employee1@dayflow.com"
set "EMPLOYEE_PASSWORD=Employee@123456"

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 📋 TEST 1: Health Check
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
curl -s -X GET "%BASE_URL%/health" | jq . 2>nul || curl -s -X GET "%BASE_URL%/health"
echo.

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 🔐 TEST 2: Admin Login (HR001)
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REM Get admin login response and save to temp file
curl -s -X POST "%BASE_URL%/api/auth/signin" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"%ADMIN_EMAIL%\",\"password\":\"%ADMIN_PASSWORD%\"}" > admin_login.json

echo Response:
jq . admin_login.json 2>nul || type admin_login.json
echo.

REM Extract token using PowerShell (or use jq if available)
for /f "tokens=*" %%a in ('powershell -Command "try { (Get-Content admin_login.json | ConvertFrom-Json).token } catch { 'ERROR' }"') do set ADMIN_TOKEN=%%a

echo Token saved: !ADMIN_TOKEN:~0,20!...
echo.

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 👤 TEST 3: Create New Employee via Admin
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

curl -s -X POST "%BASE_URL%/api/admin/employees" ^
  -H "Authorization: Bearer !ADMIN_TOKEN!" ^
  -H "Content-Type: application/json" ^
  -d "{\"employeeId\":\"E004\",\"email\":\"testuser@dayflow.com\",\"password\":\"TestPass@123456\",\"firstName\":\"Test\",\"lastName\":\"User\",\"phone\":\"+1-555-0104\",\"gender\":\"Male\"}" > create_employee.json

echo Response:
jq . create_employee.json 2>nul || type create_employee.json
echo.

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 🔐 TEST 4: Employee Login (E001)
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

curl -s -X POST "%BASE_URL%/api/auth/signin" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"%EMPLOYEE_EMAIL%\",\"password\":\"%EMPLOYEE_PASSWORD%\"}" > employee_login.json

echo Response:
jq . employee_login.json 2>nul || type employee_login.json
echo.

REM Extract employee token
for /f "tokens=*" %%a in ('powershell -Command "try { (Get-Content employee_login.json | ConvertFrom-Json).token } catch { 'ERROR' }"') do set EMPLOYEE_TOKEN=%%a

echo Token saved: !EMPLOYEE_TOKEN:~0,20!...
echo.

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 📄 TEST 5: Get Self Profile (/api/me)
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

curl -s -X GET "%BASE_URL%/api/me" ^
  -H "Authorization: Bearer !EMPLOYEE_TOKEN!" | jq . 2>nul || curl -s -X GET "%BASE_URL%/api/me" ^
  -H "Authorization: Bearer !EMPLOYEE_TOKEN!"
echo.

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 📋 TEST 6: List All Employees (Admin)
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

curl -s -X GET "%BASE_URL%/api/admin/employees" ^
  -H "Authorization: Bearer !ADMIN_TOKEN!" | jq . 2>nul || curl -s -X GET "%BASE_URL%/api/admin/employees" ^
  -H "Authorization: Bearer !ADMIN_TOKEN!"
echo.

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 🔒 TEST 7: Employee Cannot Access Admin Endpoints
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo (Should return 403 Forbidden)
echo.

curl -s -X GET "%BASE_URL%/api/admin/employees" ^
  -H "Authorization: Bearer !EMPLOYEE_TOKEN!" | jq . 2>nul || curl -s -X GET "%BASE_URL%/api/admin/employees" ^
  -H "Authorization: Bearer !EMPLOYEE_TOKEN!"
echo.

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 🚫 TEST 8: Invalid Credentials
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo (Should return 401 Unauthorized)
echo.

curl -s -X POST "%BASE_URL%/api/auth/signin" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@dayflow.com\",\"password\":\"WrongPassword\"}" | jq . 2>nul || curl -s -X POST "%BASE_URL%/api/auth/signin" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@dayflow.com\",\"password\":\"WrongPassword\"}"
echo.

echo ╔════════════════════════════════════════════════════════════════╗
echo ║   ✅ TEST SUITE COMPLETE                                       ║
echo ║   Check results above for any failures                         ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Clean up temp files
del admin_login.json 2>nul
del employee_login.json 2>nul
del create_employee.json 2>nul

pause
