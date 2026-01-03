import express from 'express';
import prisma from '../config/database.js';
import { auth } from '../middleware/auth.js';
import { roleCheck } from '../middleware/roleCheck.js';
import { logger } from '../utils/logger.js';
import { emailService } from '../utils/emailService.js';

const router = express.Router();

// ==================== GET LEAVES ====================
// Employees see their own, Admins see all
router.get('/', auth, async (req, res) => {
  try {
    const { userId, status, startDate, endDate } = req.query;

    const where = {};

    if (req.user.role === 'EMPLOYEE') {
      where.userId = req.user.id;
    } else if (userId && req.user.role === 'ADMIN') {
      where.userId = userId;
    }

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.startDate = {};
      if (startDate) where.startDate.gte = new Date(startDate);
      if (endDate) where.startDate.lte = new Date(endDate);
    }

    const leaves = await prisma.leave.findMany({
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
        },
        approver: {
          select: {
            id: true,
            employeeId: true,
            profile: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    res.status(200).json({
      success: true,
      count: leaves.length,
      data: leaves
    });
  } catch (error) {
    logger.error('Get leaves error', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching leaves'
    });
  }
});

// ==================== GET SINGLE LEAVE ====================
router.get('/:id', auth, async (req, res) => {
  try {
    const leave = await prisma.leave.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: {
            id: true,
            employeeId: true,
            email: true,
            profile: true
          }
        },
        approver: {
          select: {
            id: true,
            employeeId: true,
            profile: true
          }
        }
      }
    });

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    // Employees can only see their own
    if (req.user.role === 'EMPLOYEE' && leave.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden'
      });
    }

    res.status(200).json({
      success: true,
      data: leave
    });
  } catch (error) {
    logger.error('Get single leave error', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching leave'
    });
  }
});

// ==================== APPLY FOR LEAVE ====================
router.post('/', auth, async (req, res) => {
  try {
    const { type, startDate, endDate, remarks } = req.body;

    if (!type || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'type, startDate, and endDate are required'
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: 'Start date must be before end date'
      });
    }

    const leave = await prisma.leave.create({
      data: {
        userId: req.user.id,
        type,
        startDate: start,
        endDate: end,
        remarks,
        status: 'PENDING'
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    logger.info(`Leave request created for user ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Leave request submitted successfully',
      data: leave
    });
  } catch (error) {
    logger.error('Create leave error', error);
    res.status(500).json({
      success: false,
      message: 'Error creating leave request'
    });
  }
});

// ==================== APPROVE LEAVE (ADMIN) ====================
router.patch('/:id/approve', [auth, roleCheck('ADMIN')], async (req, res) => {
  try {
    const leave = await prisma.leave.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: {
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    if (leave.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: `Leave is already ${leave.status.toLowerCase()}`
      });
    }

    const updated = await prisma.leave.update({
      where: { id: req.params.id },
      data: {
        status: 'APPROVED',
        approverId: req.user.id,
        approvedAt: new Date()
      },
      include: {
        user: {
          select: {
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    // Send approval email (stub - returns success)
    await emailService.sendLeaveApprovalEmail(
      updated.user.email,
      {
        type: updated.type,
        startDate: updated.startDate.toDateString(),
        endDate: updated.endDate.toDateString()
      },
      'APPROVED'
    );

    logger.info(`Leave approved by admin ${req.user.id} for leave ${req.params.id}`);

    res.status(200).json({
      success: true,
      message: 'Leave approved successfully',
      data: updated
    });
  } catch (error) {
    logger.error('Approve leave error', error);
    res.status(500).json({
      success: false,
      message: 'Error approving leave'
    });
  }
});

// ==================== REJECT LEAVE (ADMIN) ====================
router.patch('/:id/reject', [auth, roleCheck('ADMIN')], async (req, res) => {
  try {
    const { rejectionReason } = req.body;

    const leave = await prisma.leave.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: {
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    if (leave.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: `Leave is already ${leave.status.toLowerCase()}`
      });
    }

    const updated = await prisma.leave.update({
      where: { id: req.params.id },
      data: {
        status: 'REJECTED',
        approverId: req.user.id,
        approvedAt: new Date(),
        rejectionReason: rejectionReason || 'No reason provided'
      },
      include: {
        user: {
          select: {
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    // Send rejection email (stub - returns success)
    await emailService.sendLeaveApprovalEmail(
      updated.user.email,
      {
        type: updated.type,
        startDate: updated.startDate.toDateString(),
        endDate: updated.endDate.toDateString(),
        rejectionReason: updated.rejectionReason
      },
      'REJECTED'
    );

    logger.info(`Leave rejected by admin ${req.user.id} for leave ${req.params.id}`);

    res.status(200).json({
      success: true,
      message: 'Leave rejected successfully',
      data: updated
    });
  } catch (error) {
    logger.error('Reject leave error', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting leave'
    });
  }
});

// ==================== CANCEL LEAVE (Employee can cancel own pending) ====================
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const leave = await prisma.leave.findUnique({
      where: { id: req.params.id }
    });

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    // Employee can only cancel own leave
    if (req.user.role === 'EMPLOYEE' && leave.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden'
      });
    }

    if (leave.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a ${leave.status.toLowerCase()} leave request`
      });
    }

    const updated = await prisma.leave.update({
      where: { id: req.params.id },
      data: {
        status: 'REJECTED'
      }
    });

    logger.info(`Leave cancelled by user ${req.user.id}`);

    res.status(200).json({
      success: true,
      message: 'Leave request cancelled',
      data: updated
    });
  } catch (error) {
    logger.error('Cancel leave error', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling leave'
    });
  }
});

export default router;
