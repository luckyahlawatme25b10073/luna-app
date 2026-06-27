import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import prisma from '../lib/prisma';

const router = Router();

// Helper to serialize array of symptoms into JSON string for SQLite
const serializeLogData = (data: any) => {
  if (data && Array.isArray(data.symptoms)) {
    data.symptoms = JSON.stringify(data.symptoms);
  }
  return data;
};

// Helper to deserialize symptoms string back into array for frontend
const deserializeLog = (log: any) => {
  if (log && typeof log.symptoms === 'string') {
    try {
      log.symptoms = JSON.parse(log.symptoms);
    } catch {
      log.symptoms = [];
    }
  }
  return log;
};

// Validation schemas for logs
const logSchema = z.object({
  date: z.string().datetime(),
  flow: z.number().int().min(0).max(4).optional(),
  mood: z.enum(['HAPPY', 'NEUTRAL', 'SAD', 'ANXIOUS', 'EXCITED', 'TIRED', 'CALM', 'ANGRY', 'LOVED']).optional(),
  symptoms: z.array(z.string()).optional(),
  energy: z.number().int().min(1).max(5).optional(),
  pain: z.number().int().min(0).max(5).optional(),
  weight: z.number().optional(),
  sleep: z.number().optional(),
  temperature: z.number().optional(),
  notes: z.string().optional()
});

// Get logs for a specific date
router.get('/:date', authenticate, async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.user.id;
    const logDate = new Date(date);

    const log = await prisma.dailyLog.findUnique({
      where: {
        userId_date: {
          userId,
          date: logDate
        }
      }
    });

    if (!log) {
      return res.status(404).json({ error: 'Log not found for this date' });
    }

    res.status(200).json({ log: deserializeLog(log) });
  } catch (error) {
    console.error('Get log error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update or create log for a specific date
router.put('/:date', authenticate, validate(logSchema), async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.user.id;
    const logDate = new Date(date);
    const data = req.body;

    // Check if log exists for this date
    const existingLog = await prisma.dailyLog.findUnique({
      where: {
        userId_date: {
          userId,
          date: logDate
        }
      }
    });

    const serializedData = serializeLogData({ ...data });

    if (existingLog) {
      // Update existing log
      const log = await prisma.dailyLog.update({
        where: {
          userId_date: {
            userId,
            date: logDate
          }
        },
        data: {
          ...serializedData,
          updatedAt: new Date()
        }
      });
      res.status(200).json({ log: deserializeLog(log) });
    } else {
      // Create new log
      const log = await prisma.dailyLog.create({
        data: {
          userId,
          date: logDate,
          ...serializedData
        }
      });
      res.status(201).json({ log: deserializeLog(log) });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Update log error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get logs in a date range
router.get('/', authenticate, async (req, res) => {
  try {
    const { from, to } = req.query;
    const userId = req.user.id;

    let where: any = { userId };
    if (from && to) {
      where.date = {
        gte: new Date(from as string),
        lte: new Date(to as string)
      };
    } else if (from) {
      where.date = {
        gte: new Date(from as string)
      };
    } else if (to) {
      where.date = {
        lte: new Date(to as string)
      };
    }

    const logs = await prisma.dailyLog.findMany({
      where,
      orderBy: { date: 'desc' }
    });

    res.status(200).json({ logs: logs.map(deserializeLog) });
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete log for a specific date
router.delete('/:date', authenticate, async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.user.id;
    const logDate = new Date(date);

    await prisma.dailyLog.delete({
      where: {
        userId_date: {
          userId,
          date: logDate
        }
      }
    });

    res.status(200).json({ message: 'Log deleted successfully' });
  } catch (error) {
    console.error('Delete log error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;