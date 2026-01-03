# API Examples & cURL Commands

Complete set of cURL examples for testing all Dayflow HRMS endpoints.

---

## 1. Health Check

### Check Server Status
```bash
curl -X GET http://localhost:5000/health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:45.123Z",
  "uptime": 245.67
}
```

---

## 2. Authentication

### Register New User
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMP999",
    "email": "newuser@example.com",
    "password": "SecurePass@123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully. Please verify your email.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "cly123abc...",
    "employeeId": "EMP999",
    "email": "newuser@example.com",
    "role": "EMPLOYEE",
    "isVerified": false
  }
}
```

---

### Login
```bash
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@dayflow-hrms.com",
    "password": "Admin@123456"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Signed in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "cly123xxx...",
    "employeeId": "ADMIN001",
    "email": "admin@dayflow-hrms.com",
    "role": "ADMIN",
    "isVerified": true
  }
}
```

---

### Verify Email (Stub)
```bash
curl -X POST http://localhost:5000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "token": "verification-token-from-email"
  }'
```

---

## 3. Profile Management

### Get Own Profile
```bash
curl -X GET http://localhost:5000/api/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "prof123...",
    "userId": "user123...",
    "firstName": "John",
    "lastName": "Administrator",
    "phone": "+1-555-0100",
    "gender": "Male",
    "department": "Administration",
    "position": "System Administrator",
    "joiningDate": "2023-01-15T00:00:00.000Z",
    "salary": {
      "baseSalary": 120000,
      "dearness": 5000,
      "allowances": 10000,
      "deductions": 5000
    },
    "user": {
      "id": "user123...",
      "employeeId": "ADMIN001",
      "email": "admin@dayflow-hrms.com",
      "role": "ADMIN"
    }
  }
}
```

---

### Update Personal Details
```bash
curl -X PATCH http://localhost:5000/api/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "phone": "+1-555-5555",
    "dateOfBirth": "1990-05-15",
    "gender": "Female",
    "address": "456 Oak Avenue",
    "city": "San Francisco",
    "state": "CA",
    "zipCode": "94103"
  }'
```

---

### Update Job Details
```bash
curl -X PATCH http://localhost:5000/api/profile/job-details \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "department": "Engineering",
    "position": "Senior Developer",
    "joiningDate": "2022-03-10",
    "reportingTo": "user-id-of-manager"
  }'
```

---

### Get Salary Information
```bash
curl -X GET http://localhost:5000/api/profile/salary \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
```json
{
  "success": true,
  "data": {
    "baseSalary": 100000,
    "dearness": 4000,
    "allowances": 8000,
    "deductions": 3000
  }
}
```

---

## 4. Attendance Management

### Get Attendance Records
```bash
# Get own attendance
curl -X GET http://localhost:5000/api/attendance \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Filter by date range
curl -X GET "http://localhost:5000/api/attendance?startDate=2024-01-01&endDate=2024-01-31" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Filter by status
curl -X GET "http://localhost:5000/api/attendance?status=PRESENT" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Admin: Get all attendance for specific user
curl -X GET "http://localhost:5000/api/attendance?userId=user-id" \
  -H "Authorization: Bearer admin-token..."
```

**Response:**
```json
{
  "success": true,
  "count": 20,
  "data": [
    {
      "id": "att123...",
      "userId": "user123...",
      "date": "2024-01-15T00:00:00.000Z",
      "checkInTime": "2024-01-15T09:00:00.000Z",
      "checkOutTime": "2024-01-15T18:00:00.000Z",
      "status": "PRESENT",
      "remarks": null,
      "user": {
        "employeeId": "EMP001",
        "email": "employee1@dayflow-hrms.com",
        "profile": {
          "firstName": "Jane",
          "lastName": "Developer"
        }
      }
    }
  ]
}
```

---

### Get Single Attendance Record
```bash
curl -X GET http://localhost:5000/api/attendance/att123 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### Check In
```bash
curl -X POST http://localhost:5000/api/attendance/check-in \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "success": true,
  "message": "Checked in successfully",
  "data": {
    "id": "att456...",
    "userId": "user123...",
    "date": "2024-01-15T00:00:00.000Z",
    "checkInTime": "2024-01-15T09:15:30.000Z",
    "checkOutTime": null,
    "status": "PRESENT"
  }
}
```

---

### Check Out
```bash
curl -X POST http://localhost:5000/api/attendance/check-out \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "success": true,
  "message": "Checked out successfully",
  "data": {
    "id": "att456...",
    "checkInTime": "2024-01-15T09:15:30.000Z",
    "checkOutTime": "2024-01-15T18:45:00.000Z",
    "status": "PRESENT"
  }
}
```

---

### Admin: Mark Attendance
```bash
curl -X POST http://localhost:5000/api/attendance/admin/mark \
  -H "Authorization: Bearer admin-token..." \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-id-to-mark",
    "date": "2024-01-14",
    "status": "HALF_DAY",
    "remarks": "Medical appointment"
  }'
```

---

## 5. Leave Management

### Get Leave Requests
```bash
# Get own leave requests
curl -X GET http://localhost:5000/api/leaves \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Filter by status
curl -X GET "http://localhost:5000/api/leaves?status=PENDING" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Admin: Get all pending leaves
curl -X GET "http://localhost:5000/api/leaves?status=PENDING" \
  -H "Authorization: Bearer admin-token..."

# Filter by date range
curl -X GET "http://localhost:5000/api/leaves?startDate=2024-02-01&endDate=2024-02-28" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "leave123...",
      "userId": "user123...",
      "type": "PAID",
      "startDate": "2024-02-01T00:00:00.000Z",
      "endDate": "2024-02-05T00:00:00.000Z",
      "remarks": "Family vacation",
      "status": "PENDING",
      "approverId": null,
      "approvedAt": null,
      "user": {
        "employeeId": "EMP001",
        "email": "employee1@dayflow-hrms.com",
        "profile": {
          "firstName": "Jane",
          "lastName": "Developer"
        }
      }
    }
  ]
}
```

---

### Get Single Leave Request
```bash
curl -X GET http://localhost:5000/api/leaves/leave123 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### Apply for Leave
```bash
curl -X POST http://localhost:5000/api/leaves \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "type": "PAID",
    "startDate": "2024-02-01",
    "endDate": "2024-02-05",
    "remarks": "Family vacation"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Leave request submitted successfully",
  "data": {
    "id": "leave456...",
    "userId": "user123...",
    "type": "PAID",
    "startDate": "2024-02-01T00:00:00.000Z",
    "endDate": "2024-02-05T00:00:00.000Z",
    "remarks": "Family vacation",
    "status": "PENDING",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Approve Leave (Admin Only)
```bash
curl -X PATCH http://localhost:5000/api/leaves/leave456/approve \
  -H "Authorization: Bearer admin-token..." \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "success": true,
  "message": "Leave approved successfully",
  "data": {
    "id": "leave456...",
    "status": "APPROVED",
    "approverId": "admin-user-id",
    "approvedAt": "2024-01-15T10:35:00.000Z"
  }
}
```

---

### Reject Leave (Admin Only)
```bash
curl -X PATCH http://localhost:5000/api/leaves/leave456/reject \
  -H "Authorization: Bearer admin-token..." \
  -H "Content-Type: application/json" \
  -d '{
    "rejectionReason": "Insufficient coverage for that period"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Leave rejected successfully",
  "data": {
    "id": "leave456...",
    "status": "REJECTED",
    "approverId": "admin-user-id",
    "rejectionReason": "Insufficient coverage for that period",
    "approvedAt": "2024-01-15T10:35:00.000Z"
  }
}
```

---

### Cancel Leave (Employee)
```bash
curl -X PATCH http://localhost:5000/api/leaves/leave456/cancel \
  -H "Authorization: Bearer employee-token..." \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "success": true,
  "message": "Leave request cancelled",
  "data": {
    "id": "leave456...",
    "status": "REJECTED"
  }
}
```

---

## Error Examples

### Missing Authorization Header
```bash
curl http://localhost:5000/api/profile
```

**Response:**
```json
{
  "success": false,
  "message": "No authorization token provided"
}
```

---

### Invalid Token
```bash
curl -X GET http://localhost:5000/api/profile \
  -H "Authorization: Bearer invalid-token"
```

**Response:**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

---

### Insufficient Permissions
```bash
# Employee trying to approve leave
curl -X PATCH http://localhost:5000/api/leaves/leave123/approve \
  -H "Authorization: Bearer employee-token..."
```

**Response:**
```json
{
  "success": false,
  "message": "Forbidden: Required role(s) ADMIN not found"
}
```

---

### Duplicate Email
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMP123",
    "email": "admin@dayflow-hrms.com",
    "password": "Password@123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Response:**
```json
{
  "success": false,
  "message": "Email or Employee ID already exists"
}
```

---

## Tips for Testing

### Store Token in Variable (Bash)
```bash
# Login and save token
TOKEN=$(curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@dayflow-hrms.com","password":"Admin@123456"}' \
  | jq -r '.token')

# Use token in subsequent requests
curl http://localhost:5000/api/profile \
  -H "Authorization: Bearer $TOKEN"
```

---

### Pretty Print JSON Response
```bash
curl -X GET http://localhost:5000/api/profile \
  -H "Authorization: Bearer token..." | jq .
```

---

### Save Response to File
```bash
curl -X GET http://localhost:5000/api/profile \
  -H "Authorization: Bearer token..." \
  > response.json
```

---

### Test with Custom User
Replace these values in your requests:
- `newuser@example.com` - your test email
- `TOKEN` - JWT from login response
- `user-id` - User ID from response
- `leave-id` - Leave ID from list response

---

## Common Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | GET request successful |
| 201 | Created | User registered |
| 400 | Bad Request | Invalid password |
| 401 | Unauthorized | No token provided |
| 403 | Forbidden | Employee can't approve |
| 404 | Not Found | User doesn't exist |
| 409 | Conflict | Email already exists |
| 500 | Server Error | Database connection failed |

---

**All examples ready to use! 🚀**
