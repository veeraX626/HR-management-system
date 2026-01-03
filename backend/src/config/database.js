import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

const prisma = new PrismaClient({
  errorFormat: 'pretty',
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'event', level: 'error' },
    { emit: 'event', level: 'warn' },
  ],
});

// Handle query events
prisma.$on('query', (e) => {
  if (process.env.DEBUG === 'true') {
    console.log(`[PRISMA QUERY] ${e.query}`);
  }
});

// Handle error events
prisma.$on('error', (e) => {
  console.error(`[PRISMA ERROR] ${e.message}`);
  logger.error(`Prisma Error: ${e.message}`, e);
});

// Handle warning events
prisma.$on('warn', (e) => {
  console.warn(`[PRISMA WARNING] ${e.message}`);
  logger.warn(`Prisma Warning: ${e.message}`);
});

// Connect to database
prisma.$connect()
  .then(() => {
    console.log('✅ [DATABASE] Connected successfully');
    logger.info('✅ Database connected');
  })
  .catch((error) => {
    console.error('❌ [DATABASE] Connection failed:', error.message);
    logger.error('❌ Database connection failed', error);
    
    // Don't exit on connection error - let the app handle it gracefully
    console.error('⚠️  Database connection error. The app will attempt to reconnect.');
  });

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('📡 [SERVER] SIGTERM received, closing connections...');
  logger.info('SIGTERM received, closing database connection');
  await prisma.$disconnect();
  console.log('✅ [SERVER] Database disconnected');
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('📡 [SERVER] SIGINT received, closing connections...');
  logger.info('SIGINT received, closing database connection');
  await prisma.$disconnect();
  console.log('✅ [SERVER] Database disconnected');
  process.exit(0);
});

export default prisma;

