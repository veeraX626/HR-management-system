# Dayflow HRMS - API Testing Guide (Postman)

## 🚀 Quick Start

### 1. Database Setup
```bash
cd backend
npm run db:reset          # Reset database
npm run prisma:seed       # Seed test data
npm start                 # Start server
```

### 2. Server Running
- Backend: http://localhost:5000
- API Base: http://localhost:5000/api

---

## 📋 Test Credentials (Post-Seed)

### Admin Account (HR001)
```
Email: admin@dayflow.com
Password: Admin123
EmployeeId: HR001
```

### Employee 1 (E001)
```
Email: employee1@dayflow.com
Password: Employee@123456
EmployeeId: E001
```

### Employee 2 (E002)
```
Email: employee2@dayflow.com
Password: Employee@123456
EmployeeId: E002
```

### Employee 3 (E003)
```
Email: employee3@dayflow.com
Password: Employee@123456
EmployeeId: E003
```

---

## 🧪 Postman Collections

### Collection 1: Authentication Flow

#### 1.1 Admin Sign In
**POST** `http://localhost:5000/api/auth/signin`

Headers:
```json
{
  "Content-Type": "application/json"
}
```

Body (raw JSON):
```json
{
  "email": "admin@dayflow.com",
  "password": "Admin123"
}
```

Expected Response (200):
```json
{
  "success": true,
  "message": "Signed in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "xxx",
    "employeeId": "HR001",
    "email": "admin@dayflow.com",
    "role": "ADMIN",
    "isVerified": true,
    "profile": {...}
  }
}
```

**Copy the `token` value for subsequent requests!**

---

#### 1.2 Employee Sign In
**POST** `http://localhost:5000/api/auth/signin`

Body:
```json
{
  "email": "employee1@dayflow.com",
  "password": "Employee@123456"
}
```

Expected Response (200): Similar to admin, but `role: "EMPLOYEE"`

---

#### 1.3 Invalid Credentials Test (401)
**POST** `http://localhost:5000/api/auth/signin`

Body:
```json
{
  "email": "admin@dayflow.com",
  "password": "WrongPassword"
}
```

Expected Response (401):
```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

---

#### 1.4 Missing Credentials Test (400)
**POST** `http://localhost:5000/api/auth/signin`

Body:
```json
{
  "email": "admin@dayflow.com"
}
```

Expected Response (400):
```json
{
  "success": false,
  "error": "Email and password are required"
}
```

---

### Collection 2: Admin Operations

#### 2.1 List All Employees (Admin Only)
**GET** `http://localhost:5000/api/admin/employees`

Headers:
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_ADMIN_TOKEN"
}
```

Expected Response (200):
```json
{
  "success": true,
  "message": "Retrieved 3 employees",
  "data": [
    {
      "id": "xxx",
      "employeeId": "E001",
      "email": "employee1@dayflow.com",
      "role": "EMPLOYEE",
      "profile": {...}
    },
    ...
  ]
}
```

---

#### 2.2 Create New Employee (Admin Only)
**POST** `http://localhost:5000/api/admin/employees`

Headers:
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_ADMIN_TOKEN"
}
```

Body:
```json
{
  "employeeId": "E004",
  "email": "employee4@dayflow.com",
  "password": "NewEmp@123456",
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1-555-0104",
  "gender": "Male"
}
```

Expected Response (201):
```json
{
  "success": true,
  "message": "Employee created successfully",
  "data": {
    "id": "xxx",
    "employeeId": "E004",
    "email": "employee4@dayflow.com",
    "role": "EMPLOYEE",
    "profile": {
      "firstName": "John",
      "lastName": "Smith",
      ...
    }
  }
}
```

---

#### 2.3 Create Employee - Duplicate EmployeeId (409)
**POST** `http://localhost:5000/api/admin/employees`

Headers: `Authorization: Bearer YOUR_ADMIN_TOKEN`

Body:
```json
{
  "employeeId": "E001",
  "email": "newemail@dayflow.com",
  "password": "Test@123456",
  "firstName": "Test",
  "lastName": "User"
}
```

Expected Response (409):
```json
{
  "success": false,
  "error": "Employee with this email or employeeId already exists"
}
```

---

#### 2.4 Create Employee - Missing Required Fields (400)
**POST** `http://localhost:5000/api/admin/employees`

Headers: `Authorization: Bearer YOUR_ADMIN_TOKEN`

Body:
```json
{
  "employeeId": "E005",
  "email": "test@dayflow.com"
}
```

Expected Response (400):
```json
{
  "success": false,
  "error": "Missing required fields: employeeId, email, password, firstName, lastName"
}
```

---

#### 2.5 Admin Operations - Unauthorized (401 - No Token)
**GET** `http://localhost:5000/api/admin/employees`

Headers:
```json
{
  "Content-Type": "application/json"
}
```

Expected Response (401):
```json
{
  "success": false,
  "error": "Unauthorized - No token"
}
```

---

#### 2.6 Admin Operations - Forbidden (403 - Employee Token)
**GET** `http://localhost:5000/api/admin/employees`

Headers:
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer EMPLOYEE_TOKEN"
}
```

Expected Response (403):
```json
{
  "success": false,
  "error": "Forbidden - Admin access required"
}
```

---

#### 2.7 Update Employee (Admin Only)
**PUT** `http://localhost:5000/api/admin/employees/{USER_ID}`

Headers: `Authorization: Bearer YOUR_ADMIN_TOKEN`

Body:
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "phone": "+1-555-9999",
  "gender": "Female"
}
```

Expected Response (200): Updated employee data

---

#### 2.8 Delete Employee (Admin Only)
**DELETE** `http://localhost:5000/api/admin/employees/{USER_ID}`

Headers: `Authorization: Bearer YOUR_ADMIN_TOKEN`

Expected Response (200):
```json
{
  "success": true,
  "message": "Employee deleted successfully"
}
```

---

### Collection 3: User Profile (Self-Service)

#### 3.1 Get Current User Profile
**GET** `http://localhost:5000/api/me`

Headers:
```json
{
  "Authorization": "Bearer YOUR_TOKEN"
}
```

Expected Response (200):
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "xxx",
    "employeeId": "E001",
    "email": "employee1@dayflow.com",
    "role": "EMPLOYEE",
    "profile": {...}
  }
}
```

---

#### 3.2 Update Own Profile
**PUT** `http://localhost:5000/api/me`

Headers: `Authorization: Bearer YOUR_TOKEN`

Body:
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "phone": "+1-999-9999",
  "gender": "Female"
}
```

Expected Response (200): Updated profile data

---

### Collection 4: Attendance

#### 4.1 Get Own Attendance (Employee)
**GET** `http://localhost:5000/api/attendance`

Headers: `Authorization: Bearer EMPLOYEE_TOKEN`

Expected Response (200):
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "xxx",
      "userId": "yyy",
      "date": "2025-01-02T00:00:00Z",
      "checkInTime": "2025-01-02T09:15:00Z",
      "checkOutTime": "2025-01-02T18:30:00Z",
      "status": "PRESENT"
    }
  ]
}
```

---

#### 4.2 Check In
**POST** `http://localhost:5000/api/attendance/check-in`

Headers: `Authorization: Bearer EMPLOYEE_TOKEN`

Expected Response (200):
```json
{
  "success": true,
  "message": "Checked in successfully",
  "data": {...}
}
```

---

#### 4.3 Check Out
**POST** `http://localhost:5000/api/attendance/check-out`

Headers: `Authorization: Bearer EMPLOYEE_TOKEN`

Expected Response (200):
```json
{
  "success": true,
  "message": "Checked out successfully",
  "data": {...}
}
```

---

#### 4.4 Admin: Mark Attendance
**POST** `http://localhost:5000/api/attendance/admin/mark`

Headers: `Authorization: Bearer ADMIN_TOKEN`

Body:
```json
{
  "userId": "EMPLOYEE_USER_ID",
  "date": "2025-01-05",
  "status": "ABSENT",
  "remarks": "Sick leave"
}
```

Expected Response (200): Marked attendance record

---

### Collection 5: Leaves

#### 5.1 Get Own Leaves (Employee)
**GET** `http://localhost:5000/api/leaves`

Headers: `Authorization: Bearer EMPLOYEE_TOKEN`

Expected Response (200):
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "xxx",
      "userId": "yyy",
      "type": "PAID",
      "startDate": "2025-01-13",
      "endDate": "2025-01-17",
      "remarks": "Vacation planning",
      "status": "PENDING"
    }
  ]
}
```

---

#### 5.2 Apply for Leave (Employee)
**POST** `http://localhost:5000/api/leaves`

Headers: `Authorization: Bearer EMPLOYEE_TOKEN`

Body:
```json
{
  "type": "SICK",
  "startDate": "2025-02-01",
  "endDate": "2025-02-02",
  "remarks": "Medical appointment"
}
```

Expected Response (201):
```json
{
  "success": true,
  "message": "Leave request submitted successfully",
  "data": {...}
}
```

---

#### 5.3 Approve Leave (Admin Only)
**PATCH** `http://localhost:5000/api/leaves/{LEAVE_ID}/approve`

Headers: `Authorization: Bearer ADMIN_TOKEN`

Expected Response (200):
```json
{
  "success": true,
  "message": "Leave approved successfully",
  "data": {...}
}
```

---

#### 5.4 Reject Leave (Admin Only)
**PATCH** `http://localhost:5000/api/leaves/{LEAVE_ID}/reject`

Headers: `Authorization: Bearer ADMIN_TOKEN`

Body:
```json
{
  "rejectionReason": "Insufficient notice"
}
```

Expected Response (200):
```json
{
  "success": true,
  "message": "Leave rejected successfully",
  "data": {...}
}
```

---

#### 5.5 Cancel Leave (Employee - Pending Only)
**PATCH** `http://localhost:5000/api/leaves/{LEAVE_ID}/cancel`

Headers: `Authorization: Bearer EMPLOYEE_TOKEN`

Expected Response (200):
```json
{
  "success": true,
  "message": "Leave cancelled successfully",
  "data": {...}
}
```

---

### Collection 6: Profile Management

#### 6.1 Get Own Full Profile
**GET** `http://localhost:5000/api/profile`

Headers: `Authorization: Bearer YOUR_TOKEN`

Expected Response (200):
```json
{
  "success": true,
  "data": {
    "id": "xxx",
    "userId": "yyy",
    "firstName": "Jane",
    "lastName": "Developer",
    "phone": "+1-555-0101",
    "department": "Engineering",
    ...
  }
}
```

---

#### 6.2 Update Profile Details
**PATCH** `http://localhost:5000/api/profile`

Headers: `Authorization: Bearer YOUR_TOKEN`

Body:
```json
{
  "firstName": "Janet",
  "phone": "+1-555-9999",
  "city": "San Francisco",
  "state": "CA"
}
```

Expected Response (200): Updated profile

---

#### 6.3 Update Job Details
**PATCH** `http://localhost:5000/api/profile/job-details`

Headers: `Authorization: Bearer YOUR_TOKEN`

Body:
```json
{
  "department": "Management",
  "position": "Senior Developer",
  "joiningDate": "2024-01-15"
}
```

Expected Response (200): Updated profile

---

#### 6.4 Get Salary Info
**GET** `http://localhost:5000/api/profile/salary`

Headers: `Authorization: Bearer YOUR_TOKEN`

Expected Response (200):
```json
{
  "success": true,
  "data": {}
}
```

---

### Collection 7: Health Check

#### 7.1 Server Health
**GET** `http://localhost:5000/health`

Expected Response (200):
```json
{
  "status": "OK",
  "timestamp": "2025-01-03T10:00:00Z",
  "uptime": 1234.56,
  "environment": "development",
  "version": "1.0.0",
  "database": "Connected"
}
```

---

## 🔐 JWT Token Anatomy

The JWT returned from signin contains:
```json
{
  "id": "user-id",
  "email": "user@dayflow.com",
  "role": "ADMIN" | "EMPLOYEE",
  "employeeId": "HR001" | "E001",
  "iat": 1234567890,
  "exp": 1234654290
}
```

Expiration: **7 days** from issue

---

## ✅ Error Codes Reference

| Status | Error | Cause |
|--------|-------|-------|
| 400 | Missing required fields | Invalid request body |
| 400 | Invalid email or password | Wrong password |
| 400 | Email and password are required | Missing credentials |
| 401 | Invalid or expired token | Bad/expired JWT |
| 401 | Unauthorized - No token | Missing Authorization header |
| 401 | Unauthorized - Invalid token | Malformed token |
| 403 | Forbidden - Admin access required | Non-admin calling admin endpoint |
| 403 | Forbidden | Insufficient permissions |
| 404 | Resource not found | Record doesn't exist |
| 409 | Already exists | Duplicate email/employeeId |
| 500 | Internal Server Error | Server error |

---

## 🧑‍💻 Frontend Integration

### 1. Sign In User
```javascript
const response = await fetch('http://localhost:5000/api/auth/signin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const { token, user } = await response.json();
localStorage.setItem('auth_token', token);
```

### 2. Authenticated Request
```javascript
const response = await fetch('http://localhost:5000/api/me', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
  }
});
```

### 3. Check Auth Status
```javascript
const token = localStorage.getItem('auth_token');
if (!token || !isTokenValid(token)) {
  // Redirect to login
}
```

---

## 📝 Notes

- All passwords are hashed with **bcryptjs** (cost factor 12)
- JWTs expire in **7 days**
- Employee IDs follow pattern: **E###** (employee) or **HR###** (admin)
- Emails must be unique
- Role-based access control enforced at middleware level
- Proper JSON error responses (no HTML errors)
- CORS enabled for frontend @ http://localhost:5173

---

## 🚀 Production Checklist

- [ ] Set `JWT_SECRET` in `.env` (current: `'your-secret-key'`)
- [ ] Configure SMTP for email notifications
- [ ] Set `CORS_ORIGIN` to production domain
- [ ] Set `NODE_ENV` to `production`
- [ ] Use PostgreSQL in production
- [ ] Enable HTTPS/SSL
- [ ] Implement rate limiting
- [ ] Add request validation schemas
- [ ] Set up monitoring/alerting

