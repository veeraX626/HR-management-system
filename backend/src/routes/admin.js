import express from 'express';
import bcryptjs from 'bcryptjs';
import prisma from '../config/database.js';
import { logger } from '../utils/logger.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

// ==================== MIDDLEWARE: Check ADMIN role ====================
const requireAdmin = asyncHandler(async (req, res, next) => {
  // Get token from Authorization header
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    console.warn('⚠️  [ADMIN] No token provided');
    return res.status(401).json({
      success: false,
      error: 'Unauthorized - No token'
    });
  }

  try {
    // Verify JWT
    const decoded = require('jsonwebtoken').verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    );

    // Check if user is ADMIN
    if (decoded.role !== 'ADMIN') {
      console.warn(`❌ [ADMIN] User ${decoded.email} is not ADMIN (role: ${decoded.role})`);
      return res.status(403).json({
        success: false,
        error: 'Forbidden - Admin access required'
      });
    }

    // Attach user to request
    req.user = decoded;
    next();
  } catch (error) {
    console.error('❌ [ADMIN] Token verification failed:', error.message);
    return res.status(401).json({
      success: false,
      error: 'Unauthorized - Invalid token'
    });
  }
});

// ==================== GET /api/admin/employees - List all employees ====================
router.get('/employees', requireAdmin, asyncHandler(async (req, res) => {
  console.log(`📋 [ADMIN] Listing employees (requested by: ${req.user.email})`);

  const employees = await prisma.user.findMany({
    where: { role: 'EMPLOYEE' },
    include: { profile: true },
    orderBy: { createdAt: 'asc' }
  });

  console.log(`✅ [ADMIN] Found ${employees.length} employees`);
  res.status(200).json({
    success: true,
    message: `Retrieved ${employees.length} employees`,
    data: employees
  });
}));

// ==================== POST /api/admin/employees - Create employee ====================
router.post('/employees', requireAdmin, asyncHandler(async (req, res) => {
  const { employeeId, email, password, firstName, lastName, phone, gender } = req.body;

  console.log(`👤 [ADMIN] Creating employee: ${employeeId} (${email}) by ${req.user.email}`);

  // Validation
  if (!employeeId || !email || !password || !firstName || !lastName) {
    console.warn('⚠️  [ADMIN] Missing required fields');
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: employeeId, email, password, firstName, lastName'
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      error: 'Password must be at least 6 characters'
    });
  }

  // Check if employee already exists
  const existingEmployee = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { employeeId }]
    }
  });

  if (existingEmployee) {
    console.warn(`❌ [ADMIN] Employee already exists: ${employeeId} or ${email}`);
    return res.status(409).json({
      success: false,
      error: 'Employee with this email or employeeId already exists'
    });
  }

  // Hash password
  const hashedPassword = await bcryptjs.hash(password, 12);

  // Create employee
  const employee = await prisma.user.create({
    data: {
      employeeId,
      email,
      password: hashedPassword,
      role: 'EMPLOYEE',
      profile: {
        create: {
          firstName,
          lastName,
          phone: phone || null,
          gender: gender || null
        }
      }
    },
    include: { profile: true }
  });

  console.log(`✅ [ADMIN] Employee created: ${employee.employeeId} (${employee.email})`);
  logger.info(`Admin ${req.user.email} created employee: ${employeeId}`);

  res.status(201).json({
    success: true,
    message: 'Employee created successfully',
    data: employee
  });
}));

// ==================== PUT /api/admin/employees/:id - Update employee ====================
router.put('/employees/:id', requireAdmin, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, phone, gender, email } = req.body;

  console.log(`✏️  [ADMIN] Updating employee: ${id} by ${req.user.email}`);

  // Check if employee exists
  const employee = await prisma.user.findUnique({
    where: { id },
    include: { profile: true }
  });

  if (!employee) {
    console.warn(`❌ [ADMIN] Employee not found: ${id}`);
    return res.status(404).json({
      success: false,
      error: 'Employee not found'
    });
  }

  // Check if email is being changed to an existing one
  if (email && email !== employee.email) {
    const existingEmail = await prisma.user.findUnique({
      where: { email }
    });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        error: 'Email already in use'
      });
    }
  }

  // Update user and profile
  const updatedEmployee = await prisma.user.update({
    where: { id },
    data: {
      email: email || employee.email,
      profile: {
        update: {
          firstName: firstName || employee.profile.firstName,
          lastName: lastName || employee.profile.lastName,
          phone: phone || employee.profile.phone,
          gender: gender || employee.profile.gender
        }
      }
    },
    include: { profile: true }
  });

  console.log(`✅ [ADMIN] Employee updated: ${id}`);
  logger.info(`Admin ${req.user.email} updated employee: ${id}`);

  res.status(200).json({
    success: true,
    message: 'Employee updated successfully',
    data: updatedEmployee
  });
}));

// ==================== DELETE /api/admin/employees/:id - Delete employee ====================
router.delete('/employees/:id', requireAdmin, asyncHandler(async (req, res) => {
  const { id } = req.params;

  console.log(`🗑️  [ADMIN] Deleting employee: ${id} by ${req.user.email}`);

  // Check if employee exists
  const employee = await prisma.user.findUnique({ where: { id } });

  if (!employee) {
    console.warn(`❌ [ADMIN] Employee not found: ${id}`);
    return res.status(404).json({
      success: false,
      error: 'Employee not found'
    });
  }

  // Don't allow deleting admin users
  if (employee.role === 'ADMIN') {
    console.warn(`❌ [ADMIN] Cannot delete admin user: ${id}`);
    return res.status(403).json({
      success: false,
      error: 'Cannot delete admin users'
    });
  }

  // Delete employee (cascade deletes profile)
  await prisma.user.delete({ where: { id } });

  console.log(`✅ [ADMIN] Employee deleted: ${id}`);
  logger.info(`Admin ${req.user.email} deleted employee: ${id}`);

  res.status(200).json({
    success: true,
    message: 'Employee deleted successfully'
  });
}));

export default router;
