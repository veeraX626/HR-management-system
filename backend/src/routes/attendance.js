import express from 'express';
import prisma from '../config/database.js';
import { auth } from '../middleware/auth.js';
import { roleCheck } from '../middleware/roleCheck.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// ==================== GET ATTENDANCE ====================
// Employees see their own, Admins see all
router.get('/', auth, async (req, res) => {
  try {
    const { startDate, endDate, userId, status } = req.query;
    
    // Build filter conditions
    const where = {};

    if (req.user.role === 'EMPLOYEE') {
      where.userId = req.user.id;
    } else if (userId && req.user.role === 'ADMIN') {
      where.userId = userId;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    if (status) {
      where.status = status;
    }

    const attendance = await prisma.attendance.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            employeeId: true,
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      },
      orderBy: { date: 'desc' },
      take: 100
    });

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance
    });
  } catch (error) {
    logger.error('Get attendance error', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance'
    });
  }
});

// ==================== GET SINGLE ATTENDANCE ====================
router.get('/:id', auth, async (req, res) => {
  try {
    const attendance = await prisma.attendance.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: {
            id: true,
            employeeId: true,
            email: true,
            profile: true
          }
        }
      }
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    // Employees can only see their own
    if (req.user.role === 'EMPLOYEE' && attendance.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden'
      });
    }

    res.status(200).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    logger.error('Get single attendance error', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance'
    });
  }
});

// ==================== CHECK IN ====================
router.post('/check-in', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already checked in today
    const existingRecord = await prisma.attendance.findUnique({
      where: {
        userId_date: {
          userId: req.user.id,
          date: today
        }
      }
    });

    if (existingRecord && existingRecord.checkInTime) {
      return res.status(400).json({
        success: false,
        message: 'Already checked in today'
      });
    }

    const attendance = await prisma.attendance.upsert({
      where: {
        userId_date: {
          userId: req.user.id,
          date: today
        }
      },
      create: {
        userId: req.user.id,
        date: today,
        checkInTime: new Date(),
        status: 'PRESENT'
      },
      update: {
        checkInTime: new Date(),
        status: 'PRESENT'
      }
    });

    logger.info(`Check-in recorded for user ${req.user.id}`);

    res.status(200).json({
      success: true,
      message: 'Checked in successfully',
      data: attendance
    });
  } catch (error) {
    logger.error('Check-in error', error);
    res.status(500).json({
      success: false,
      message: 'Error recording check-in'
    });
  }
});

// ==================== CHECK OUT ====================
router.post('/check-out', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await prisma.attendance.findUnique({
      where: {
        userId_date: {
          userId: req.user.id,
          date: today
        }
      }
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'No check-in record found for today'
      });
    }

    if (attendance.checkOutTime) {
      return res.status(400).json({
        success: false,
        message: 'Already checked out today'
      });
    }

    const updated = await prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        checkOutTime: new Date()
      }
    });

    logger.info(`Check-out recorded for user ${req.user.id}`);

    res.status(200).json({
      success: true,
      message: 'Checked out successfully',
      data: updated
    });
  } catch (error) {
    logger.error('Check-out error', error);
    res.status(500).json({
      success: false,
      message: 'Error recording check-out'
    });
  }
});

// ==================== ADMIN: MARK ATTENDANCE ====================
router.post('/admin/mark', [auth, roleCheck('ADMIN')], async (req, res) => {
  try {
    const { userId, date, status, remarks } = req.body;

    if (!userId || !date || !status) {
      return res.status(400).json({
        success: false,
        message: 'userId, date, and status are required'
      });
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const attendance = await prisma.attendance.upsert({
      where: {
        userId_date: {
          userId,
          date: attendanceDate
        }
      },
      create: {
        userId,
        date: attendanceDate,
        status,
        remarks
      },
      update: {
        status,
        remarks
      }
    });

    logger.info(`Admin marked attendance for user ${userId}: ${status}`);

    res.status(200).json({
      success: true,
      message: 'Attendance marked successfully',
      data: attendance
    });
  } catch (error) {
    logger.error('Mark attendance error', error);
    res.status(500).json({
      success: false,
      message: 'Error marking attendance'
    });
  }
});

export default router;
