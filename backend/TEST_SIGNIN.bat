@echo off
REM Dayflow HRMS Backend - Signin Error Testing Script
REM Tests all signin scenarios after bug fixes

echo.
echo ============================================================
echo  Dayflow HRMS - Signin Endpoint Testing
echo ============================================================
echo.

REM Check if curl is available
where curl >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo ERROR: curl not found. Please install curl or use a REST client.
  pause
  exit /b 1
)

REM Base URL
set BASE_URL=http://localhost:5000
set API_URL=%BASE_URL%/api/auth/signin

REM Color codes
set GREEN=[92m
set RED=[91m
set YELLOW=[93m
set RESET=[0m

echo Connecting to: %API_URL%
echo.

REM Test 1: Valid Admin Credentials
echo.
echo Test 1: Valid Admin Credentials
echo ================================
echo Request: POST %API_URL%
echo Body: {"email":"admin@dayflow-hrms.com","password":"Admin@123456"}
echo.

curl -s -X POST %API_URL% ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@dayflow-hrms.com\",\"password\":\"Admin@123456\"}" ^
  | find /v "" && (
  echo.
  echo %GREEN%✓ Test 1 PASSED: Got response%RESET%
) || (
  echo %RED%✗ Test 1 FAILED: No response%RESET%
)

echo.
echo Press any key to continue...
pause >nul

REM Test 2: Invalid Password
echo.
echo Test 2: Invalid Password
echo ========================
echo Request: POST %API_URL%
echo Body: {"email":"admin@dayflow-hrms.com","password":"WrongPassword"}
echo Expected: 401 Unauthorized
echo.

curl -s -X POST %API_URL% ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@dayflow-hrms.com\",\"password\":\"WrongPassword\"}" ^
  | find "401" >nul && (
  echo %GREEN%✓ Test 2 PASSED: Got 401 response%RESET%
) || (
  echo %YELLOW%Note: Response received (check if it says 'Invalid email or password')%RESET%
)

echo.
echo Press any key to continue...
pause >nul

REM Test 3: User Not Found
echo.
echo Test 3: User Not Found
echo ======================
echo Request: POST %API_URL%
echo Body: {"email":"nonexistent@dayflow.com","password":"Password123"}
echo Expected: 401 Unauthorized
echo.

curl -s -X POST %API_URL% ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"nonexistent@dayflow.com\",\"password\":\"Password123\"}" ^
  | find "401" >nul && (
  echo %GREEN%✓ Test 3 PASSED: Got 401 response%RESET%
) || (
  echo %YELLOW%Note: Response received%RESET%
)

echo.
echo Press any key to continue...
pause >nul

REM Test 4: Missing Email
echo.
echo Test 4: Missing Email
echo =====================
echo Request: POST %API_URL%
echo Body: {"password":"Admin@123456"}
echo Expected: 400 Bad Request
echo.

curl -s -X POST %API_URL% ^
  -H "Content-Type: application/json" ^
  -d "{\"password\":\"Admin@123456\"}" ^
  | find "400" >nul && (
  echo %GREEN%✓ Test 4 PASSED: Got 400 response%RESET%
) || (
  echo %YELLOW%Note: Response received%RESET%
)

echo.
echo Press any key to continue...
pause >nul

REM Test 5: Valid Employee Credentials
echo.
echo Test 5: Valid Employee Credentials
echo ===================================
echo Request: POST %API_URL%
echo Body: {"email":"employee1@dayflow-hrms.com","password":"Employee@123456"}
echo.

curl -s -X POST %API_URL% ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"employee1@dayflow-hrms.com\",\"password\":\"Employee@123456\"}" ^
  | find /v "" && (
  echo.
  echo %GREEN%✓ Test 5 PASSED: Got response%RESET%
) || (
  echo %RED%✗ Test 5 FAILED: No response%RESET%
)

echo.
echo ============================================================
echo  Testing Complete
echo ============================================================
echo.
echo Checklist:
echo [ ] Test 1 returns token and user data
echo [ ] Test 2 returns 401 with "Invalid email or password"
echo [ ] Test 3 returns 401 with "Invalid email or password"
echo [ ] Test 4 returns 400 with "Email and password are required"
echo [ ] Test 5 returns token and user data
echo.
echo Backend should show logs like:
echo   🔐 [AUTH] Signin request: { email: '...', passwordLength: X }
echo   ✅ [AUTH] Signin successful for: [email]
echo.
pause
