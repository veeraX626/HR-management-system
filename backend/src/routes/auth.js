import express from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';
import { logger } from '../utils/logger.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateEmployeeId } from '../utils/employeeIdGenerator.js';

const router = express.Router();

<<<<<<< HEAD
// ==================== SIGNUP ====================
router.post('/signup', asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, yearOfJoining } = req.body;

  // Validation
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({
      success: false,
      message: 'Email, password, first name, and last name are required'
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters long'
    });
  }

  // Generate Employee ID automatically
  const employeeId = await generateEmployeeId(firstName, lastName, yearOfJoining);

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'Email already exists'
    });
  }

  // Hash password with 12 salt rounds (strong hashing)
  const hashedPassword = await bcryptjs.hash(password, 12);

  // Create user
  const user = await prisma.user.create({
    data: {
      employeeId,
      email,
      password: hashedPassword,
      role: 'EMPLOYEE',
      isVerified: false,
      profile: {
        create: {
          firstName,
          lastName
        }
      }
    },
    include: {
      profile: true
    }
  });

  // Generate verification token (stub)
  const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify?token=stub`;
  
  // Send verification email (stub - will succeed without actual SMTP)
  await emailService.sendVerificationEmail(email, verificationLink);

  logger.info(`New user registered: ${email} (${employeeId})`);

  // Generate JWT
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );

  res.status(201).json({
    success: true,
    message: 'User registered successfully. Please verify your email.',
    token,
    user: {
      id: user.id,
      employeeId: user.employeeId,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      profile: user.profile
    }
  });
}));

// ==================== SIGNIN ====================
=======
// ==================== SIGNIN (PUBLIC) ====================
// NOTE: /signup REMOVED - Only admins can create users via /api/admin/employees
>>>>>>> 23e07a23744ef28d70fc82216f1ea6bbdb137e7e
router.post('/signin', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    console.warn('⚠️  [AUTH] Missing credentials:', { email: !!email, password: !!password });
    return res.status(400).json({
      success: false,
      error: 'Email and password are required'
    });
  }

  // Find user by email
  console.log(`🔍 [AUTH] Looking up user: ${email}`);
  const user = await prisma.user.findUnique({
    where: { email },
    include: { profile: true }
  });

  if (!user) {
    console.warn(`❌ [AUTH] User not found: ${email}`);
    logger.warn(`Failed login attempt - user not found: ${email}`);
    return res.status(401).json({
      success: false,
      error: 'Invalid email or password'
    });
  }

  // Compare password with stored hash
  console.log('🔐 [AUTH] Comparing passwords for user:', email);
  const isPasswordValid = await bcryptjs.compare(password, user.password);

  if (!isPasswordValid) {
    console.warn(`❌ [AUTH] Invalid password for: ${email}`);
    logger.warn(`Failed login attempt - invalid password: ${email}`);
    return res.status(401).json({
      success: false,
      error: 'Invalid email or password'
    });
  }

  console.log('✅ [AUTH] Password valid, generating token for:', email);

  // Generate JWT with user ID and role
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );

  logger.info(`User signed in successfully: ${email} (Role: ${user.role})`);
  console.log('✅ [AUTH] Signin successful for:', email, `(${user.role})`);

  res.status(200).json({
    success: true,
    message: 'Signed in successfully',
    token,
    user: {
      id: user.id,
      employeeId: user.employeeId,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      profile: user.profile
    }
  });
}));

export default router;
