# ⚡ Dayflow HRMS Backend - Quick Start

**Get up and running in 3 minutes!**

---

## 🚀 30-Second Setup

```bash
# Step 1: Install
npm install

# Step 2: Configure
cp .env.example .env
# Edit .env - set your PostgreSQL DATABASE_URL

# Step 3: Database
npm run prisma:generate
npm run db:push
npm run prisma:seed

# Step 4: Run
npm run dev
```

**Server is ready at:** http://localhost:5000

---

## ✅ Verify Installation

```bash
# Check health
curl http://localhost:5000/health

# Login with admin
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@dayflow-hrms.com","password":"Admin@123456"}'
```

---

## 📝 Default Credentials

```
Email:    admin@dayflow-hrms.com
Password: Admin@123456
```

---

## 🔧 Quick Commands

```bash
npm run dev                    # Start dev server
npm run prisma:seed           # Reseed data
npm run prisma:studio         # Open database GUI
npm run db:reset              # Clear & reseed database
```

---

## 📚 Documentation

- **README.md** - Full API docs
- **SETUP.md** - Detailed setup
- **API_EXAMPLES.md** - cURL examples
- **PROJECT_SUMMARY.md** - Architecture overview

---

## 🎯 Next Steps

1. Test endpoints with API_EXAMPLES.md
2. Integrate with frontend
3. Configure SMTP for emails
4. Deploy to production

---

## 🆘 Troubleshooting

**Database connection error?**
- Check PostgreSQL is running
- Verify DATABASE_URL in .env

**Port 5000 in use?**
- Change PORT in .env or kill process

**Prisma client not found?**
- Run: `npm run prisma:generate`

---

**All set! Happy coding! 🎉**
