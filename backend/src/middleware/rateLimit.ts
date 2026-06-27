import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    error: 'Too many requests from this IP, please try again after an hour'
  },
  skipSuccessfulRequests: false
});

// Stricter limit for auth endpoints
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 failed login attempts per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many login attempts from this IP, please try again after an hour'
  },
  skipSuccessfulRequests: true // Don't count successful requests
});

// Rate limiter for email endpoints (password reset, etc.)
export const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 emails per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many email requests from this IP, please try again after 1 hour'
  }
});

/**
 * Rate limiter factory function
 * @param options { windowMs: number, max: number }
 * @returns {import('express').RequestHandler}
 */
export const rateLimiter = (options: { windowMs: number; max: number }) => {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    standardHeaders: true,
    legacyHeaders: false
  });
};

// Export all limiters
export default {
  apiLimiter,
  authLimiter,
  emailLimiter,
  rateLimiter
};