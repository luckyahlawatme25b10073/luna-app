import { Router } from 'express';
import { z } from 'zod';
import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';


const router = Router();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional()
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = registerSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user with default values
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        name,
        cycleLength: 28,
        periodLength: 5,
        lastPeriodStart: null,
        anniversary: null,
        lovePin: '1234',
        apiKey: null
      }
    });

    // Generate JWT token
    const token = sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    // Set httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Return user without password
    const { passwordHash: _, ...userWithoutPassword } = user;
    res.status(201).json({
      message: 'User created successfully',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isValidPassword = await compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    // Set httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Return user without password (but include apiKey)
    const { passwordHash: _, ...userWithoutPassword } = user;
    res.status(200).json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        profilePhoto: true,
        cycleLength: true,
        periodLength: true,
        lastPeriodStart: true,
        anniversary: true,
        lovePin: true,
        apiKey: true, // Return the API key (encrypted in production)
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Schema for updating user profile/settings
const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional().nullable(),
  cycleLength: z.number().min(21).max(45).optional(),
  periodLength: z.number().min(2).max(10).optional(),
  lastPeriodStart: z.preprocess((val) => {
    if (typeof val === 'string' && val.trim() !== '') return new Date(val);
    if (val === '' || val === null) return null;
    return val;
  }, z.date().nullable().optional()),
  anniversary: z.preprocess((val) => {
    if (typeof val === 'string' && val.trim() !== '') return new Date(val);
    if (val === '' || val === null) return null;
    return val;
  }, z.date().nullable().optional()),
  lovePin: z.string().optional().nullable(),
  apiKey: z.string().optional().nullable()
});

// Update current user profile/settings
router.put('/me', authenticate, validate(updateProfileSchema), async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, cycleLength, periodLength, lastPeriodStart, anniversary, lovePin, apiKey } = req.body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (cycleLength !== undefined) updateData.cycleLength = cycleLength;
    if (periodLength !== undefined) updateData.periodLength = periodLength;
    if (lastPeriodStart !== undefined) updateData.lastPeriodStart = lastPeriodStart;
    if (anniversary !== undefined) updateData.anniversary = anniversary;
    if (lovePin !== undefined) updateData.lovePin = lovePin;
    if (apiKey !== undefined) updateData.apiKey = apiKey;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        profilePhoto: true,
        cycleLength: true,
        periodLength: true,
        lastPeriodStart: true,
        anniversary: true,
        lovePin: true,
        apiKey: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});


export default router;