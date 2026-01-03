import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { logger } from './src/utils/logger.js';
import { errorHandler } from './src/middleware/errorHandler.js';

// Routes
import authRoutes from './src/routes/auth.js';
import profileRoutes from './src/routes/profile.js';
import attendanceRoutes from './src/routes/attendance.js';
import leaveRoutes from './src/routes/leaves.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

console.log('🚀 [SERVER] Initializing Dayflow HRMS Backend...');
console.log(`📍 [SERVER] Environment: ${NODE_ENV}`);
console.log(`🔧 [SERVER] Port: ${PORT}`);

// ==================== Middleware ====================
// Security
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing with error handling
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging with detailed timing
app.use((req, res, next) => {
  const start = Date.now();
  const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Store request info on response object
  res.locals.requestId = requestId;
  res.locals.startTime = start;
  
  // Log request details
  console.log(`📨 [${requestId}] ${req.method} ${req.path}`);
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusClass = res.statusCode >= 400 ? '❌' : '✅';
    console.log(`${statusClass} [${requestId}] ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
    logger.info(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
});

// ==================== Health Check ====================
app.get('/health', (req, res) => {
  try {
    const health = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: NODE_ENV,
      version: '1.0.0'
    };
    
    console.log('🏥 [HEALTH] Health check passed');
    res.status(200).json(health);
  } catch (error) {
    console.error('🏥 [HEALTH] Health check failed:', error.message);
    res.status(503).json({
      status: 'ERROR',
      message: 'Health check failed',
      error: error.message
    });
  }
});

// ==================== API Routes ====================
console.log('📚 [ROUTES] Loading API routes...');

try {
  app.use('/api/auth', authRoutes);
  console.log('✅ [ROUTES] Auth routes loaded');
  
  app.use('/api/profile', profileRoutes);
  console.log('✅ [ROUTES] Profile routes loaded');
  
  app.use('/api/attendance', attendanceRoutes);
  console.log('✅ [ROUTES] Attendance routes loaded');
  
  app.use('/api/leaves', leaveRoutes);
  console.log('✅ [ROUTES] Leave routes loaded');
} catch (error) {
  console.error('❌ [ROUTES] Failed to load routes:', error.message);
  logger.error('Failed to load routes', error);
}

// ==================== 404 Handler ====================
app.use('*', (req, res) => {
  console.warn(`⚠️  [404] Route not found: ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// ==================== Error Handler ====================
app.use(errorHandler);

// ==================== Unhandled Error Handlers ====================
// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('💥 [FATAL] Uncaught Exception:', error.message);
  console.error(error.stack);
  logger.error('Uncaught Exception', error);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 [FATAL] Unhandled Rejection at:', promise);
  console.error('Reason:', reason);
  logger.error('Unhandled Promise Rejection', reason);
});

// ==================== Server Start ====================
const server = app.listen(PORT, () => {
  console.log(`🚀 [SERVER] Server is running on http://localhost:${PORT}`);
  console.log(`🌐 [SERVER] CORS origin: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
  logger.info(`Environment: ${NODE_ENV}`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ [SERVER] Port ${PORT} is already in use`);
    logger.error(`Port ${PORT} is already in use`);
    process.exit(1);
  } else {
    console.error(`❌ [SERVER] Server error: ${error.message}`);
    logger.error('Server error', error);
  }
});

export default app;

