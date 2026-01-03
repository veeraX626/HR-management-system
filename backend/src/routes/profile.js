import express from 'express';
import prisma from '../config/database.js';
import { auth } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// ==================== GET OWN PROFILE ====================
router.get('/', auth, async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.id },
      include: {
        user: {
          select: {
            id: true,
            employeeId: true,
            email: true,
            role: true,
            isVerified: true,
            createdAt: true
          }
        }
      }
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    logger.error('Get profile error', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile'
    });
  }
});

// ==================== UPDATE OWN PROFILE ====================
router.patch('/', auth, async (req, res) => {
  try {
    const { firstName, lastName, phone, dateOfBirth, gender, address, city, state, zipCode } = req.body;

    const profile = await prisma.profile.update({
      where: { userId: req.user.id },
      data: {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        phone: phone || undefined,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        gender: gender || undefined,
        address: address || undefined,
        city: city || undefined,
        state: state || undefined,
        zipCode: zipCode || undefined
      },
      include: {
        user: {
          select: {
            id: true,
            employeeId: true,
            email: true,
            role: true
          }
        }
      }
    });

    logger.info(`Profile updated for user ${req.user.id}`);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: profile
    });
  } catch (error) {
    logger.error('Update profile error', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
});

// ==================== UPDATE JOB DETAILS ====================
router.patch('/job-details', auth, async (req, res) => {
  try {
    const { department, position, joiningDate, reportingTo } = req.body;

    const profile = await prisma.profile.update({
      where: { userId: req.user.id },
      data: {
        department: department || undefined,
        position: position || undefined,
        joiningDate: joiningDate ? new Date(joiningDate) : undefined,
        reportingTo: reportingTo || undefined
      }
    });

    logger.info(`Job details updated for user ${req.user.id}`);

    res.status(200).json({
      success: true,
      message: 'Job details updated successfully',
      data: profile
    });
  } catch (error) {
    logger.error('Update job details error', error);
    res.status(500).json({
      success: false,
      message: 'Error updating job details'
    });
  }
});

// ==================== GET SALARY INFO ====================
router.get('/salary', auth, async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.id },
      select: {
        salary: true
      }
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: profile.salary || {}
    });
  } catch (error) {
    logger.error('Get salary error', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching salary information'
    });
  }
});

export default router;
