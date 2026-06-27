import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import prisma from '../lib/prisma';

const router = Router();

// Validation schemas for cycles
const cycleSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional().nullable(),
  length: z.number().int().optional().nullable(),
  notes: z.string().optional().nullable()
});

// Get all cycles for the user
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const cycles = await prisma.cycle.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' }
    });
    res.status(200).json({ cycles });
  } catch (error) {
    console.error('Get cycles error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new cycle
router.post('/', authenticate, validate(cycleSchema), async (req, res) => {
  try {
    const userId = req.user.id;
    const data = req.body;

    const cycle = await prisma.cycle.create({
      data: {
        userId,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        length: data.length,
        notes: data.notes
      }
    });

    res.status(201).json({ cycle });
  } catch (error) {
    console.error('Create cycle error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific cycle by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const cycle = await prisma.cycle.findFirst({
      where: { id, userId }
    });

    if (!cycle) {
      return res.status(404).json({ error: 'Cycle not found' });
    }

    res.status(200).json({ cycle });
  } catch (error) {
    console.error('Get cycle error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a cycle
router.patch('/:id', authenticate, validate(cycleSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const data = req.body;

    const cycle = await prisma.cycle.update({
      where: { id, userId },
      data: {
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate !== undefined ? (data.endDate ? new Date(data.endDate) : null) : undefined,
        length: data.length !== undefined ? data.length : undefined,
        notes: data.notes !== undefined ? data.notes : undefined
      }
    });

    res.status(200).json({ cycle });
  } catch (error) {
    console.error('Update cycle error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a cycle
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await prisma.cycle.delete({
      where: { id, userId }
    });

    res.status(200).json({ message: 'Cycle deleted' });
  } catch (error) {
    console.error('Delete cycle error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
