import express from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';
import { logger } from '../utils/logger.js';
import { emailService } from '../utils/emailService.js';

const router = express.Router();

// ==================== SIGNUP ====================
router.post('/signup', async (req, res) => {
  try {
    const { employeeId, email, password, firstName, lastName } = req.body;

    // Validation
    if (!employeeId || !email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { employeeId }
        ]
      }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email or Employee ID already exists'
      });
    }

    // Hash password
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
    const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify?token=stub`;
    
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
  } catch (error) {
    logger.error('Signup error', error);
    res.status(500).json({
      success: false,
      message: 'Error creating user'
    });
  }
});

// ==================== SIGNIN ====================
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Compare password
    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      logger.warn(`Failed login attempt for ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

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

    logger.info(`User signed in: ${email}`);

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
  } catch (error) {
    logger.error('Signin error', error);
    res.status(500).json({
      success: false,
      message: 'Error signing in'
    });
  }
});

// ==================== EMAIL VERIFICATION (Stub) ====================
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;

    // This is a stub - In production, verify actual token from email
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token required'
      });
    }

    // For now, mark any request as verified (stub implementation)
    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    logger.error('Verification error', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying email'
    });
  }
});

export default router;
