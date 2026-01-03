# 🚀 Quick Start Guide - Dayflow HRMS Backend

## Backend Status: ✅ FULLY IMPLEMENTED & READY

---

## 🔧 System Requirements

- **Node.js**: v14+ (already installed)
- **PostgreSQL**: 16 (running in Docker)
- **Port**: 5000 (backend), 5432 (database)
- **Frontend**: http://localhost:5173

---

## 📦 Getting Started

### 1. Start PostgreSQL Database
```bash
# Already running in Docker container
docker ps  # Verify dayflow_postgres is running

# If not running:
docker-compose up -d postgres
```

### 2. Start Backend Server
```bash
cd c:\Users\hys20\Desktop\Odoo\backend
node server.js

# Expected output:
# 🚀 [SERVER] Server is running on http://localhost:5000
# ✅ [DATABASE] Connected successfully
```

### 3. Test Server is Running
```bash
# In another terminal
curl http://localhost:5000/health

# Expected response:
# { "status": "OK", "database": "Connected", ... }
```

---

## 🔐 Login Credentials

### Admin (System Administrator)
```
Email:    admin@dayflow.com
Password: Admin123
Role:     ADMIN
ID:       HR001
```

### Test Employees
```
Employee 1: employee1@dayflow.com / Employee@123456 (E001)
Employee 2: employee2@dayflow.com / Employee@123456 (E002)
Employee 3: employee3@dayflow.com / Employee@123456 (E003)
```

---

## 🌐 Core API Endpoints

### Public Endpoints
```
POST   /api/auth/signin              # Login (any user)
GET    /health                        # Server health check
```

### Authenticated Endpoints (Any User)
```
GET    /api/me                        # Your profile
PUT    /api/me                        # Update your profile
```

### Admin Only Endpoints
```
GET    /api/admin/employees           # List all employees
POST   /api/admin/employees           # Create new employee
PUT    /api/admin/employees/:id       # Update employee
DELETE /api/admin/employees/:id       # Delete employee
```

---

## 🧪 Quick Test Examples

### 1. Health Check
```bash
curl http://localhost:5000/health
```

### 2. Admin Login
```bash
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@dayflow.com","password":"Admin123"}'

# Response includes: token, user info with role: "ADMIN"
```

### 3. Get Self Profile
```bash
# First login to get a token (above), then:
curl http://localhost:5000/api/me \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

### 4. Create Employee (Admin Only)
```bash
curl -X POST http://localhost:5000/api/admin/employees \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId":"E999",
    "email":"newuser@dayflow.com",
    "password":"SecurePass@123",
    "firstName":"John",
    "lastName":"Doe"
  }'
```

---

## 🎯 Complete Workflow

```
Step 1: Login as admin@dayflow.com / Admin123
        └─ Get JWT token with role: "ADMIN"

Step 2: Create a new employee using /api/admin/employees
        └─ Set employeeId, email, password, name

Step 3: Login with new employee credentials
        └─ Get JWT token with role: "EMPLOYEE"

Step 4: Access /api/me to see own profile
        └─ Verify role is "EMPLOYEE"

Step 5: Try to access /api/admin/employees as employee
        └─ Should get 403 Forbidden
```

---

## 📝 Response Format

### Success Response (200/201)
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* actual data */ },
  "token": "eyJhbGc..." // Only for login
}
```

### Error Response (4xx/5xx)
```json
{
  "success": false,
  "error": "Specific error message"
}
```

---

## 🔑 HTTP Status Codes

- **200** - OK (successful GET/PUT)
- **201** - Created (successful POST creating resource)
- **400** - Bad Request (validation failed)
- **401** - Unauthorized (missing/invalid token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found (resource doesn't exist)
- **409** - Conflict (duplicate email/employeeId)
- **500** - Server Error (unhandled exception)

---

## 🛡️ Security Features

- ✅ **JWT Tokens**: 7-day expiry
- ✅ **Password Hashing**: bcryptjs with 12 salt rounds
- ✅ **Role-Based Access**: ADMIN and EMPLOYEE roles
- ✅ **CORS**: Only allows localhost:5173
- ✅ **Error Handling**: No sensitive data leaked in responses

---

## 📊 Database Info

```
Host:     localhost
Port:     5432
Database: dayflow_hrms
User:     dayflow_user
Password: dayflow123

Tables:
- users       (email, employeeId, role, password)
- profiles    (firstName, lastName, phone, etc)
- attendance  (existing)
- leaves      (existing)
```

---

## 🔧 Environment Variables

Create `.env` file in `backend/` directory:
```
DATABASE_URL=postgresql://dayflow_user:dayflow123@localhost:5432/dayflow_hrms
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

---

## 📂 Important Files

### Route Files
- `src/routes/auth.js` - Login endpoint
- `src/routes/admin.js` - Admin employee management
- `src/routes/me.js` - User self profile
- `server.js` - Main server file

### Documentation
- `API_TESTING_GUIDE.md` - Complete API reference
- `IMPLEMENTATION_SUMMARY.md` - Full specs compliance
- `CHANGELOG.md` - All changes made

### Testing
- `test-endpoints.bat` - Windows batch test script
- `test-suite.js` - Node.js test suite

---

## ⚠️ Common Issues & Solutions

### Port 5000 Already in Use
```bash
# Kill existing process
Get-Process | Where-Object { $_.ProcessName -match 'node' } | Stop-Process -Force
```

### Database Connection Failed
```bash
# Check if Docker container is running
docker ps

# Start if not running
docker-compose up -d postgres

# Verify connection string in .env
DATABASE_URL=postgresql://dayflow_user:dayflow123@localhost:5432/dayflow_hrms
```

### Token Expired Error
```
Tokens last 7 days. Re-login to get a fresh token.
```

### Permission Denied Error
```
Make sure you're using ADMIN token for /api/admin/* endpoints.
Employees get 403 Forbidden.
```

---

## 🚀 Next Steps

1. ✅ Start backend: `node server.js`
2. ✅ Verify health: `curl http://localhost:5000/health`
3. ✅ Login as admin: Test /api/auth/signin
4. ✅ Create employee: Test POST /api/admin/employees
5. ✅ Login as employee: Test employee login
6. ✅ Test /api/me: Get self profile
7. ✅ Test access control: Try /api/admin/* as employee (should fail)

---

## 📞 Support

### Check Logs
```bash
# Backend logs appear in console
# Also saved to logs/ directory

# View recent logs
tail -f logs/app.log
```

### Verify Routes
```bash
# All routes should show ✅ on startup
# Look for: "✅ [ROUTES] Admin routes loaded"
```

### Test API
Use the provided `test-endpoints.bat` script or import endpoints into Postman.

---

## 🎓 Key Concepts

### JWT Authentication
- Each login returns a token
- Token includes: id, email, role, employeeId
- Token expires after 7 days
- Include token in `Authorization: Bearer <TOKEN>` header

### Role-Based Access Control
- **ADMIN**: Can access /api/admin/* endpoints
- **EMPLOYEE**: Cannot access /api/admin/* (get 403)
- Both: Can access /api/me endpoints

### Error Handling
- All errors caught by asyncHandler
- Global error middleware formats responses
- Clear, user-friendly error messages

---

## ✅ Deployment Checklist

- ✅ Backend routes implemented
- ✅ Database seeded
- ✅ Authentication working
- ✅ Authorization implemented
- ✅ Error handling complete
- ✅ Health endpoint functional
- ✅ CORS configured
- ✅ Documentation complete
- ✅ Ready for frontend integration

---

**Backend Status**: 🟢 **READY FOR USE**  
**Last Updated**: 2026-01-03  
**Version**: 1.0.0 Final

For detailed API reference, see: **API_TESTING_GUIDE.md**
