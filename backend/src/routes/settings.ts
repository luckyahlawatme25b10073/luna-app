import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import prisma from '../lib/prisma';

const router = Router();

// Helper to serialize notifications object into JSON string for SQLite
const serializeNotifications = (notifications: any) => {
  if (notifications && typeof notifications === 'object') {
    return JSON.stringify(notifications);
  }
  return '{}';
};

// Helper to deserialize notifications string back into object for frontend
const deserializeNotifications = (notificationsStr: any) => {
  if (typeof notificationsStr === 'string') {
    try {
      return JSON.parse(notificationsStr);
    } catch {
      return { reminders: true };
    }
  }
  return notificationsStr || { reminders: true };
};

// Validation schemas for settings
const settingsSchema = z.object({
  theme: z.enum(['light', 'dark']).optional(),
  notifications: z.object({
    reminders: z.boolean().optional()
    // We can add more notification settings here in the future
  }).optional()
});

// Get settings
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    let settings = await prisma.settings.findUnique({
      where: { userId }
    });

    if (!settings) {
      // Create default settings if not exist
      settings = await prisma.settings.create({
        data: {
          userId,
          theme: 'light',
          notifications: serializeNotifications({ reminders: true }) // default
        }
      });
    }

    res.status(200).json({
      id: settings.id,
      theme: settings.theme,
      notifications: deserializeNotifications(settings.notifications)
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update settings
router.patch('/', authenticate, validate(settingsSchema), async (req, res) => {
  try {
    const userId = req.user.id;
    const data = req.body;

    // Fetch existing settings or create new
    let settings = await prisma.settings.findUnique({
      where: { userId }
    });

    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          userId,
          theme: data.theme ?? 'light',
          notifications: serializeNotifications(data.notifications ?? { reminders: true })
        }
      });
    } else {
      // Update only provided fields
      const updateData: any = {};
      if (data.theme !== undefined) updateData.theme = data.theme;
      if (data.notifications !== undefined) {
        // Merge with existing notifications
        const currentNotifications = deserializeNotifications(settings.notifications);
        updateData.notifications = serializeNotifications({ ...currentNotifications, ...(data.notifications as any) });
      }
      settings = await prisma.settings.update({
        where: { userId },
        data: updateData
      });
    }

    res.status(200).json({
      id: settings.id,
      theme: settings.theme,
      notifications: deserializeNotifications(settings.notifications)
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;