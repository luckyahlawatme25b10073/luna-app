import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { rateLimiter } from './middleware/rateLimit';
import authRouter from './routes/auth';
import cyclesRouter from './routes/cycles';
import logsRouter from './routes/logs';
import settingsRouter from './routes/settings';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFound';
import prisma from './lib/prisma';
import redis from './lib/redis';

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed origins config
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

// Middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin matches allowed list, ends with .vercel.app, or is localhost
    const isAllowed = allowedOrigins.includes(origin) || 
                      origin.endsWith('.vercel.app') || 
                      /^http:\/\/localhost:\d+$/.test(origin);

    if (isAllowed) {
      return callback(null, true);
    }
    
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true
}));
app.use(helmet());
app.use(compression());

// Rate limiting
// General limiter: 100 requests per minute
const generalLimiter = rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 100
});

// Auth limiter: 5 requests per minute
const authLimiter = rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 5
});

// Apply limiters only in production mode to prevent 429 errors during local testing
if (process.env.NODE_ENV === 'production') {
  app.use(generalLimiter);
  app.use('/api/auth', authLimiter);
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    version: '1.0.1',
    timestamp: new Date().toISOString(),
    services: {
      database: !!prisma,
      redis: !!redis
    }
  });
});

// API routes
app.use('/api/auth', authRouter);
app.use('/api/cycles', cyclesRouter);
app.use('/api/logs', logsRouter);
app.use('/api/settings', settingsRouter);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Start server (only if not running on Vercel serverless)
if (!process.env.VERCEL) {
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    console.log(`\nReceived ${signal}. Shutting down gracefully...`);

    server.close(async (err) => {
      if (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
      }

      // Close database connections
      await prisma.$disconnect();

      // Close Redis connection if available
      if (redis) {
        await redis.quit().catch(() => {});
      }

      console.log('Process terminated');
      process.exit(0);
    });
  };

  // Handle termination signals
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  // Handle unhandled promises
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
  });
}

export default app;