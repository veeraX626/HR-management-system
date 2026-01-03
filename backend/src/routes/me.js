import express from 'express';
import prisma from '../config/database.js';
import { logger } from '../utils/logger.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

// ==================== MIDDLEWARE: Verify JWT Token ====================
const requireAuth = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    console.warn('⚠️  [ME] No token provided');
    return res.status(401).json({
      success: false,
      error: 'Unauthorized - No token'
    });
  }

  try {
    const decoded = require('jsonwebtoken').verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    );
    req.user = decoded;
    next();
  } catch (error) {
    console.error('❌ [ME] Token verification failed:', error.message);
    return res.status(401).json({
      success: false,
      error: 'Unauthorized - Invalid token'
    });
  }
});

// ==================== GET /api/me - Get current user profile ====================
router.get('/', requireAuth, asyncHandler(async (req, res) => {
  console.log(`📄 [ME] Getting profile for user: ${req.user.email}`);

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { profile: true }
  });

  if (!user) {
    console.warn(`❌ [ME] User not found: ${req.user.id}`);
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  console.log(`✅ [ME] Profile retrieved for: ${user.email}`);
  res.status(200).json({
    success: true,
    message: 'Profile retrieved successfully',
    data: user
  });
}));

// ==================== PUT /api/me - Update own profile ====================
router.put('/', requireAuth, asyncHandler(async (req, res) => {
  const { firstName, lastName, phone, gender, email } = req.body;

  console.log(`✏️  [ME] Updating profile for user: ${req.user.email}`);

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { profile: true }
  });

  if (!user) {
    console.warn(`❌ [ME] User not found: ${req.user.id}`);
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  // Check if email is being changed to an existing one
  if (email && email !== user.email) {
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
  const updatedUser = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      email: email || user.email,
      profile: {
        update: {
          firstName: firstName || user.profile.firstName,
          lastName: lastName || user.profile.lastName,
          phone: phone || user.profile.phone,
          gender: gender || user.profile.gender
        }
      }
    },
    include: { profile: true }
  });

  console.log(`✅ [ME] Profile updated for: ${updatedUser.email}`);
  logger.info(`User ${req.user.email} updated their profile`);

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: updatedUser
  });
}));

export default router;
