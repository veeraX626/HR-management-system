import { logger } from '../utils/logger.js';

// Global error handler middleware - MUST have 4 parameters (err, req, res, next)
export const errorHandler = (err, req, res, next) => {
  // Log the error with full details
  logger.error(`Error occurred: ${err.message}`, err);
  console.error(`❌ [ERROR] ${err.message}`, err.stack);

  // Prisma database connection error (P1001)
  if (err.code === 'P1001') {
    console.error(`[DATABASE ERROR] Cannot connect to database: ${err.message}`);
    return res.status(503).json({
      success: false,
      message: 'Database connection failed. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // Prisma unique constraint violation (P2002)
  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || 'field';
    console.error(`[VALIDATION ERROR] Duplicate ${field}`);
    return res.status(409).json({
      success: false,
      message: `${field} already exists. Please use a different value.`
    });
  }

  // Prisma record not found (P2025)
  if (err.code === 'P2025') {
    console.error(`[NOT FOUND] Resource not found`);
    return res.status(404).json({
      success: false,
      message: 'Resource not found'
    });
  }

  // Prisma validation error (P2003, P2014, P2015, etc.)
  if (err.code?.startsWith('P')) {
    console.error(`[DATABASE VALIDATION ERROR] ${err.code}: ${err.message}`);
    return res.status(400).json({
      success: false,
      message: 'Data validation error. Please check your input.',
      error: process.env.NODE_ENV === 'development' ? { code: err.code, message: err.message } : undefined
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    console.error(`[JWT ERROR] Invalid token: ${err.message}`);
    return res.status(401).json({
      success: false,
      message: 'Invalid or malformed token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    console.error(`[JWT ERROR] Token expired`);
    return res.status(401).json({
      success: false,
      message: 'Token has expired. Please sign in again.'
    });
  }

  // Syntax errors
  if (err instanceof SyntaxError) {
    console.error(`[SYNTAX ERROR] Invalid JSON: ${err.message}`);
    return res.status(400).json({
      success: false,
      message: 'Invalid request format. Please check your JSON.'
    });
  }

  // Type errors
  if (err instanceof TypeError) {
    console.error(`[TYPE ERROR] ${err.message}`);
    return res.status(400).json({
      success: false,
      message: 'Type error in request processing.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // Default server error - return 500 status
  console.error(`❌ [SERVER ERROR] Status 500: ${err.message}`);
  
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'An unexpected error occurred. Please try again later.',
    ...(process.env.NODE_ENV === 'development' && { 
      details: {
        message: err.message,
        stack: err.stack,
        code: err.code
      }
    })
  });
};

