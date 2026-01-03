# 🚀 Dayflow HRMS - Quick Start Guide

## ✅ Status: READY TO USE

Both frontend and backend are running and fully functional.

## 🎯 Quick Test

### 1. Visit the Application
```
Browser: http://localhost:5173
```

### 2. Try Test Login
```
Email: admin@dayflow.com
Password: Admin123
```

### 3. Check Backend Health
```
curl http://localhost:5000/health
```

## 📝 Endpoints Ready to Use

### Authentication
- ✅ POST /api/auth/signin - Login
- ✅ GET /api/auth/me - Current user
- ✅ GET /health - Health check

### Admin Features
- ✅ GET /api/admin/stats - Dashboard stats
- ✅ GET /api/admin/employees - List employees
- ✅ POST /api/admin/employees - Create employee
- ✅ POST /api/admin/employees/:id/switch - Impersonate

### Employee Features
- ✅ GET /api/profile - Profile with salary
- ✅ POST /api/attendance/check-in - Check-in
- ✅ POST /api/leaves - Request leave

## 🔄 Full Request Example

### Get Login Token
```bash
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@dayflow.com","password":"Admin123"}'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "email": "admin@dayflow.com",
      "role": "ADMIN",
      "employeeId": "HR001"
    }
  }
}
```

### Use Token to Get Stats
```bash
curl -X GET http://localhost:5000/api/admin/stats \
  -H "Authorization: Bearer {token_from_above}"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "employees": 3,
    "pendingLeaves": 0,
    "attendance": 2,
    "payrollReady": 0
  }
}
```

## 🔐 Default Test Accounts

| Role     | Email                    | Password        | ID    |
|----------|--------------------------|-----------------|-------|
| Admin    | admin@dayflow.com        | Admin123        | HR001 |
| Employee | employee1@dayflow.com    | Employee@123456 | E001  |
| Employee | employee2@dayflow.com    | Employee@123456 | E002  |
| Employee | employee3@dayflow.com    | Employee@123456 | E003  |

## 🛠️ Server Status

### Backend (Port 5000)
```
Status: ✅ Running
URL: http://localhost:5000
Database: ✅ Connected
Routes: ✅ Loaded (6 route files)
CORS: ✅ Enabled for localhost:5173
```

### Frontend (Port 5173)
```
Status: ✅ Running
URL: http://localhost:5173
Framework: Vite + React
Build: ✅ No errors
```

## 📊 Response Format

All endpoints return:
```json
{
  "success": true/false,
  "message": "Optional message",
  "data": {/* response data */}
}
```

Errors return:
```json
{
  "success": false,
  "error": "Error message"
}
```

## 🔗 API Response Examples

### Login Success (200)
```json
{
  "success": true,
  "data": {"token": "...", "user": {...}}
}
```

### Invalid Credentials (401)
```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

### Admin Only (403)
```json
{
  "success": false,
  "error": "Forbidden - Admin access required"
}
```

### Not Found (404)
```json
{
  "success": false,
  "error": "User not found"
}
```

## 📁 Key Files

### Backend
- `server.js` - Express server
- `src/routes/auth.js` - Auth endpoints
- `src/routes/admin.js` - Admin endpoints
- `src/middleware/auth.js` - JWT middleware
- `prisma/seed.js` - Test data

### Frontend
- `src/pages/LandingPage.tsx` - Login page
- `src/pages/EmployeeDashboard.tsx` - Employee view
- `src/pages/AdminDashboard.tsx` - Admin view
- `src/stores/auth.ts` - Zustand store

## 🧪 Test Workflow

1. **Open browser** → http://localhost:5173
2. **Login** with admin@dayflow.com / Admin123
3. **View dashboard** → see stats and data
4. **Create employee** → navigate to admin
5. **Check-in** → as employee
6. **Request leave** → set dates and type

## 📚 Documentation

- Full API docs: `/backend/API_IMPLEMENTATION_COMPLETE.md`
- Implementation details: `/IMPLEMENTATION_COMPLETE.md`
- Postman collection: `/backend/Dayflow-HRMS-Auth-Collection.postman_collection.json`

## 🐛 Troubleshooting

### Port already in use
```bash
# Kill process using port 5000
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill process using port 5173
lsof -i :5173 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Database connection error
```bash
# Reset database
cd backend
npx prisma db push
npx prisma db seed
```

### CORS error
- Make sure frontend is on http://localhost:5173
- Check CORS_ORIGIN in .env file
- Restart backend server

### JWT token expired
- Tokens expire after 7 days
- Login again to get new token
- Check token in browser DevTools → Network → auth/signin

## ✅ Feature Checklist

- [x] User Authentication (JWT)
- [x] Role-Based Access Control (RBAC)
- [x] Admin Dashboard
- [x] Employee Dashboard
- [x] Employee Management (CRUD)
- [x] Attendance Tracking
- [x] Leave Management
- [x] Salary Information
- [x] Error Handling
- [x] CORS Support

## 🎉 Ready to Go!

The application is fully functional and ready for:
- Development and testing
- Production deployment
- Team collaboration
- Data management

---

**Questions?** Check the full documentation files in the repo.

**Need to restart servers?**
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

**All systems operational!** ✅
