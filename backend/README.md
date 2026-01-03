# Dayflow HRMS Backend

A complete, production-ready Human Resource Management System backend built with **Node.js/Express**, **Prisma ORM**, and **PostgreSQL**.

## Features

✅ **Authentication & Authorization**
- JWT-based authentication (signup, signin)
- Role-based access control (ADMIN, EMPLOYEE)
- Email verification stub
- Secure password hashing with bcryptjs

✅ **Employee Management**
- User profiles with personal & job details
- Employee hierarchy (reporting structure)
- Salary information management

✅ **Attendance Tracking**
- Check-in/Check-out functionality
- Daily attendance records
- Attendance status (PRESENT, ABSENT, HALF_DAY, LEAVE)
- Admin can manually mark attendance

✅ **Leave Management**
- Leave types: PAID, SICK, UNPAID
- Leave request workflow (PENDING → APPROVED/REJECTED)
- Admin approval/rejection with email notifications
- Leave balance tracking

✅ **Production-Ready**
- Comprehensive error handling
- Request logging
- Security middleware (Helmet, CORS)
- Environment-based configuration
- Database connection pooling

---

## Project Structure

```
dayflow-hrms-backend/
├── server.js                 # Express app entry point
├── package.json              # Dependencies
├── .env.example              # Environment template
├── .gitignore                # Git ignore rules
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.js               # Initial data seeding
└── src/
    ├── config/
    │   └── database.js       # Prisma client setup
    ├── middleware/
    │   ├── auth.js           # JWT verification
    │   ├── roleCheck.js      # Role authorization
    │   └── errorHandler.js   # Global error handling
    ├── routes/
    │   ├── auth.js           # /api/auth (signup, signin)
    │   ├── profile.js        # /api/profile (personal info)
    │   ├── attendance.js     # /api/attendance (check-in/out)
    │   └── leaves.js         # /api/leaves (leave requests)
    └── utils/
        ├── logger.js         # Logging utility
        └── emailService.js   # Email stub (ready for SMTP)
```

---

## Installation

### Prerequisites
- **Node.js** 16+ 
- **PostgreSQL** 12+
- **npm** or **yarn**

### Steps

1. **Clone/Setup Repository**
   ```bash
   cd dayflow-hrms-backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Create Environment File**
   ```bash
   cp .env.example .env
   ```

4. **Configure Database**
   Edit `.env` and set your PostgreSQL connection:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/dayflow_hrms"
   ```

5. **Setup Database**
   ```bash
   # Generate Prisma client
   npm run prisma:generate

   # Create database and tables
   npm run db:push

   # Seed initial data (1 admin + 2 employees)
   npm run prisma:seed
   ```

6. **Start Server**
   ```bash
   # Development (with nodemon)
   npm run dev

   # Production
   npm start
   ```

Server runs on `http://localhost:5000`

---

## API Documentation

### Health Check
```
GET /health
```

### Authentication Routes (`/api/auth`)

**Signup**
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "employeeId": "EMP003",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully. Please verify your email.",
  "token": "eyJhbGc...",
  "user": {
    "id": "user-uuid",
    "employeeId": "EMP003",
    "email": "john@example.com",
    "role": "EMPLOYEE",
    "isVerified": false
  }
}
```

**Signin**
```bash
POST /api/auth/signin
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

### Profile Routes (`/api/profile`)

**Get Own Profile**
```bash
GET /api/profile
Authorization: Bearer <token>
```

**Update Profile**
```bash
PATCH /api/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1-555-1234",
  "city": "San Francisco",
  "department": "Engineering"
}
```

### Attendance Routes (`/api/attendance`)

**Get Attendance Records**
```bash
GET /api/attendance?startDate=2024-01-01&endDate=2024-01-31&status=PRESENT
Authorization: Bearer <token>
```

**Check-In**
```bash
POST /api/attendance/check-in
Authorization: Bearer <token>
```

**Check-Out**
```bash
POST /api/attendance/check-out
Authorization: Bearer <token>
```

**Admin: Mark Attendance**
```bash
POST /api/attendance/admin/mark
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "userId": "user-uuid",
  "date": "2024-01-15",
  "status": "HALF_DAY",
  "remarks": "Medical appointment"
}
```

### Leave Routes (`/api/leaves`)

**Get Leave Requests**
```bash
GET /api/leaves?status=PENDING
Authorization: Bearer <token>
```

**Apply for Leave**
```bash
POST /api/leaves
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "PAID",
  "startDate": "2024-02-01",
  "endDate": "2024-02-05",
  "remarks": "Family vacation"
}
```

**Approve Leave (Admin)**
```bash
PATCH /api/leaves/:id/approve
Authorization: Bearer <admin-token>
```

**Reject Leave (Admin)**
```bash
PATCH /api/leaves/:id/reject
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "rejectionReason": "Insufficient information provided"
}
```

**Cancel Leave**
```bash
PATCH /api/leaves/:id/cancel
Authorization: Bearer <token>
```

---

## Database Schema

### Users
- `id` - UUID (primary key)
- `employeeId` - Unique employee identifier
- `email` - Unique email address
- `password` - Hashed password
- `role` - ADMIN or EMPLOYEE
- `isVerified` - Email verification status
- `createdAt`, `updatedAt` - Timestamps

### Profiles
- `id` - UUID (primary key)
- `userId` - FK to Users
- `firstName`, `lastName` - Name fields
- `phone`, `gender`, `dateOfBirth` - Personal details
- `address`, `city`, `state`, `zipCode` - Address details
- `department`, `position`, `joiningDate` - Job details
- `reportingTo` - Manager/supervisor reference
- `salary` - JSON (baseSalary, dearness, allowances, deductions)

### Attendance
- `id` - UUID (primary key)
- `userId` - FK to Users
- `date` - Attendance date (unique per user)
- `checkInTime`, `checkOutTime` - Timestamps
- `status` - PRESENT, ABSENT, HALF_DAY, LEAVE
- `remarks` - Optional comments

### Leaves
- `id` - UUID (primary key)
- `userId` - FK to Users (requester)
- `type` - PAID, SICK, UNPAID
- `startDate`, `endDate` - Leave period
- `status` - PENDING, APPROVED, REJECTED
- `approverId` - FK to Users (approver)
- `rejectionReason` - Optional rejection reason
- `createdAt`, `updatedAt` - Timestamps

---

## Seeding Initial Data

The seed script creates:

**Admin User**
- Email: `admin@dayflow-hrms.com`
- Password: `Admin@123456`
- Employee ID: `ADMIN001`

**Employee 1**
- Email: `employee1@dayflow-hrms.com`
- Password: `Employee@123456`
- Employee ID: `EMP001`

**Employee 2**
- Email: `employee2@dayflow-hrms.com`
- Password: `Employee@123456`
- Employee ID: `EMP002`

Run seed:
```bash
npm run prisma:seed
```

---

## Available Scripts

```bash
npm start              # Start production server
npm run dev            # Start dev server with nodemon
npm run prisma:generate # Generate Prisma client
npm run prisma:migrate # Create migration
npm run prisma:deploy  # Deploy migrations to production DB
npm run prisma:studio  # Open Prisma Studio GUI
npm run db:push        # Push schema to DB (no migration file)
npm run db:reset       # Reset database (migration + seed)
npm run prisma:seed    # Run seed script
```

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dayflow_hrms

# Server
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# JWT
JWT_SECRET=your-super-secret-key

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@dayflow-hrms.com
```

---

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Descriptive error message"
}
```

Status codes:
- `200` - Success
- `201` - Created
- `400` - Bad request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not found
- `409` - Conflict (duplicate)
- `500` - Server error

---

## Security Features

- ✅ **Helmet.js** - HTTP headers security
- ✅ **CORS** - Cross-origin resource sharing
- ✅ **bcryptjs** - Password hashing (12 rounds)
- ✅ **JWT** - Stateless authentication
- ✅ **Rate limiting** - (Ready to add)
- ✅ **Input validation** - Basic validation
- ✅ **Error handling** - Global error middleware

---

## Logging

Logs are stored in `/logs/` directory:
- `app.log` - Application logs
- `error.log` - Error logs
- `debug.log` - Debug logs (dev mode only)

---

## Database Migrations

Create a new migration:
```bash
npx prisma migrate dev --name description
```

Deploy to production:
```bash
npx prisma migrate deploy
```

---

## Next Steps for Production

1. **Configure SMTP** for real email sending (email verification, leave notifications)
2. **Add Rate Limiting** using express-rate-limit
3. **Implement Refresh Tokens** for enhanced security
4. **Add Request Validation** using joi or zod
5. **Setup CI/CD** pipeline (GitHub Actions, GitLab CI)
6. **Configure Database** connection pooling for production
7. **Add Monitoring** (Sentry, DataDog)
8. **Implement Caching** (Redis) for frequently accessed data
9. **Add API Documentation** (Swagger/OpenAPI)
10. **Setup Testing** (Jest, Supertest)

---

## Troubleshooting

**Database Connection Failed**
```
Check DATABASE_URL in .env
Ensure PostgreSQL is running
Verify credentials
```

**JWT Token Error**
```
Ensure JWT_SECRET is set in .env
Token may be expired
Check Authorization header format
```

**Email Not Sending**
```
Configure valid SMTP credentials
Check SMTP_USER and SMTP_PASS
Verify SMTP_HOST and SMTP_PORT
```

---

## License

ISC

---

## Support

For issues or questions, create an issue in the repository.

**Happy coding! 🚀**
