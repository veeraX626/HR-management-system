# 🚀 Dayflow HRMS Backend - Setup Guide

## Quick Start (3 Steps)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Database
```bash
# Copy the example env file
cp .env.example .env

# Edit .env and set your PostgreSQL connection:
# DATABASE_URL="postgresql://username:password@localhost:5432/dayflow_hrms"
```

### Step 3: Initialize Database & Run
```bash
# Generate Prisma client
npm run prisma:generate

# Create database and tables
npm run db:push

# Seed with sample data (1 admin, 2 employees)
npm run prisma:seed

# Start development server
npm run dev
```

Server will be running at **http://localhost:5000**

---

## Complete Setup Instructions

### Prerequisites
- Node.js 16 or higher
- PostgreSQL 12 or higher
- Git

### Installation

```bash
# 1. Navigate to project directory
cd dayflow-hrms-backend

# 2. Install all dependencies
npm install

# 3. Create .env file
cp .env.example .env

# 4. Update .env with your database credentials
# Edit .env and modify:
# DATABASE_URL=postgresql://[user]:[password]@localhost:5432/dayflow_hrms
```

### Database Setup

```bash
# 1. Generate Prisma Client
npm run prisma:generate

# 2. Create database and apply schema
npm run db:push

# 3. Seed initial data (optional but recommended)
npm run prisma:seed
```

### Running the Server

**Development Mode (with auto-reload)**
```bash
npm run dev
```

**Production Mode**
```bash
npm start
```

---

## API Testing

### Health Check
```bash
curl http://localhost:5000/health
```

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMP999",
    "email": "test@example.com",
    "password": "TestPass@123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@dayflow-hrms.com",
    "password": "Admin@123456"
  }'
```

### Get Profile (replace TOKEN with actual JWT)
```bash
curl http://localhost:5000/api/profile \
  -H "Authorization: Bearer TOKEN"
```

---

## Default Credentials (After Seeding)

| Role   | Email                      | Password         | Employee ID |
|--------|----------------------------|------------------|-------------|
| Admin  | admin@dayflow-hrms.com     | Admin@123456     | ADMIN001    |
| Employee | employee1@dayflow-hrms.com | Employee@123456  | EMP001      |
| Employee | employee2@dayflow-hrms.com | Employee@123456  | EMP002      |

---

## Environment Variables (.env)

```env
# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/dayflow_hrms"

# Server Configuration
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Security
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (Optional - for email features)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
SMTP_FROM=noreply@dayflow-hrms.com

# Frontend URL (for verification links)
FRONTEND_URL=http://localhost:3000
```

---

## Project Features

### ✅ Authentication & Security
- [x] JWT token-based authentication
- [x] Password hashing with bcryptjs
- [x] Role-based access control (ADMIN/EMPLOYEE)
- [x] CORS enabled for frontend communication
- [x] Helmet security headers

### ✅ User Management
- [x] User registration/signup
- [x] User login/signin
- [x] Email verification (stub ready)
- [x] Profile management
- [x] Job details (department, position, salary)

### ✅ Attendance System
- [x] Check-in/Check-out functionality
- [x] Daily attendance tracking
- [x] Attendance status management (PRESENT, ABSENT, HALF_DAY, LEAVE)
- [x] Admin can manually mark attendance
- [x] Filter attendance by date range, status, employee

### ✅ Leave Management
- [x] Apply for leave (PAID, SICK, UNPAID)
- [x] Admin approval/rejection workflow
- [x] Email notifications (stub ready)
- [x] Leave history tracking
- [x] Cancel pending leave requests

### ✅ Production Ready
- [x] Global error handling
- [x] Request logging
- [x] Database connection management
- [x] Environment-based configuration
- [x] Structured code organization

---

## Available Commands

```bash
# Development
npm run dev                    # Start with nodemon (auto-reload)
npm start                      # Start production server

# Database
npm run prisma:generate       # Generate Prisma client
npm run prisma:migrate        # Create a new migration
npm run prisma:deploy         # Deploy migrations to DB
npm run db:push               # Push schema to DB directly
npm run db:reset              # Reset DB (recreate + reseed)
npm run prisma:seed           # Run seed script
npm run prisma:studio         # Open Prisma Studio GUI
```

---

## Directory Structure

```
.
├── server.js                 # Express app setup
├── package.json              # Dependencies & scripts
├── .env.example              # Environment template
├── .gitignore                # Git ignore file
├── README.md                 # Documentation
├── SETUP.md                  # This file
│
├── prisma/
│   ├── schema.prisma         # Database schema (models)
│   └── seed.js               # Initial data seeding
│
└── src/
    ├── config/
    │   └── database.js       # Prisma client & connection
    │
    ├── middleware/
    │   ├── auth.js           # JWT verification middleware
    │   ├── roleCheck.js      # Role authorization
    │   └── errorHandler.js   # Global error handler
    │
    ├── routes/
    │   ├── auth.js           # Authentication endpoints
    │   ├── profile.js        # Profile management
    │   ├── attendance.js     # Attendance tracking
    │   └── leaves.js         # Leave management
    │
    └── utils/
        ├── logger.js         # Logging utility
        └── emailService.js   # Email service (stub)
```

---

## Common Issues & Solutions

### Issue: Database Connection Failed
**Solution:**
1. Verify PostgreSQL is running: `psql --version`
2. Check DATABASE_URL in .env
3. Verify database exists: `psql -l`
4. Test connection: `psql -U username -d dayflow_hrms`

### Issue: Port 5000 Already in Use
**Solution:**
```bash
# Change port in .env
PORT=5001

# Or kill process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:5000 | xargs kill -9
```

### Issue: JWT Secret Not Set
**Solution:**
```bash
# Generate a strong secret:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Add to .env:
JWT_SECRET=<generated-value>
```

### Issue: Prisma Client Not Generated
**Solution:**
```bash
npm run prisma:generate
npm run db:push
```

---

## Testing the API

### Using cURL

**Check Server Health**
```bash
curl http://localhost:5000/health
```

**Register New User**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMP123",
    "email": "newuser@example.com",
    "password": "Secure@Password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Login**
```bash
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@dayflow-hrms.com",
    "password": "Admin@123456"
  }'
```

**Get Your Profile** (use token from login response)
```bash
curl http://localhost:5000/api/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman

1. Import the API into Postman
2. Set up environment variables:
   - `baseUrl`: `http://localhost:5000`
   - `token`: (will be set after login)
3. Test each endpoint

---

## Database Visualization

### Prisma Studio (GUI)
```bash
npm run prisma:studio
```
Opens http://localhost:5555 with interactive database viewer

### SQL Queries
```bash
# Connect to database
psql -U username -d dayflow_hrms

# List tables
\dt

# View users
SELECT * FROM "User";

# View attendance
SELECT * FROM "Attendance";
```

---

## Deployment Guide

### Deploying to Production

1. **Environment Setup**
   ```bash
   NODE_ENV=production
   JWT_SECRET=<strong-secret>
   DATABASE_URL=<production-db>
   ```

2. **Database Migrations**
   ```bash
   npm run prisma:deploy
   npm run prisma:seed  # Only if needed
   ```

3. **Start Server**
   ```bash
   npm start
   ```

### Recommended Platforms
- **Backend**: Railway, Render, Fly.io, Heroku
- **Database**: PostgreSQL on Vercel, Railway, AWS RDS
- **Monitoring**: Sentry, DataDog

---

## Next Steps

1. ✅ Complete this setup guide
2. ✅ Test API with sample requests
3. 📧 Configure SMTP for real email notifications
4. 🔐 Add rate limiting (express-rate-limit)
5. 🧪 Add API tests (Jest, Supertest)
6. 📚 Add Swagger/OpenAPI documentation
7. 🔄 Implement refresh tokens
8. 📊 Add analytics/monitoring
9. 🚀 Deploy to production

---

## Support & Documentation

- Full API docs: See [README.md](README.md)
- Database schema: See [prisma/schema.prisma](prisma/schema.prisma)
- Seed data: See [prisma/seed.js](prisma/seed.js)

---

## Quick Reference

| Task | Command |
|------|---------|
| Start dev server | `npm run dev` |
| Run migrations | `npm run prisma:migrate` |
| Seed database | `npm run prisma:seed` |
| View database | `npm run prisma:studio` |
| Deploy changes | `npm run prisma:deploy` |
| Install packages | `npm install` |
| Reset database | `npm run db:reset` |

---

**Happy coding! 🎉**
