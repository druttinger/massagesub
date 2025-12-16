import { Router, Response } from 'express';
import { db } from '../db';
import { appointments, userSubscriptions } from '../db/schema';
import { eq, and, gte } from 'drizzle-orm';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Get user's appointments
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userAppointments = await db.select()
      .from(appointments)
      .where(eq(appointments.userId, req.userId!))
      .orderBy(appointments.dateTime);

    res.json(userAppointments);
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get upcoming appointments
router.get('/upcoming', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const now = new Date().toISOString();
    const upcoming = await db.select()
      .from(appointments)
      .where(
        and(
          eq(appointments.userId, req.userId!),
          gte(appointments.dateTime, now),
          eq(appointments.status, 'scheduled')
        )
      )
      .orderBy(appointments.dateTime);

    res.json(upcoming);
  } catch (error) {
    console.error('Get upcoming appointments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Book appointment
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { dateTime, durationMinutes, serviceType, notes, useSubscription } = req.body;

    let subscriptionId = null;

    // If using subscription, check if user has one with remaining massages
    if (useSubscription) {
      const subscription = await db.select()
        .from(userSubscriptions)
        .where(
          and(
            eq(userSubscriptions.userId, req.userId!),
            eq(userSubscriptions.status, 'active')
          )
        )
        .limit(1);

      if (subscription.length === 0) {
        return res.status(400).json({ error: 'No active subscription found' });
      }

      if (subscription[0].massagesRemaining <= 0) {
        return res.status(400).json({ error: 'No massages remaining in your subscription this month' });
      }

      // Decrement massages remaining
      await db.update(userSubscriptions)
        .set({ massagesRemaining: subscription[0].massagesRemaining - 1 })
        .where(eq(userSubscriptions.id, subscription[0].id));

      subscriptionId = subscription[0].id;
    }

    const newAppointment = await db.insert(appointments).values({
      userId: req.userId!,
      subscriptionId,
      dateTime,
      durationMinutes: durationMinutes || 60,
      serviceType,
      status: 'scheduled',
      notes,
      createdAt: new Date().toISOString(),
    }).returning();

    res.status(201).json(newAppointment[0]);
  } catch (error) {
    console.error('Book appointment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cancel appointment
router.post('/:id/cancel', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const appointment = await db.select()
      .from(appointments)
      .where(
        and(
          eq(appointments.id, parseInt(id)),
          eq(appointments.userId, req.userId!)
        )
      )
      .limit(1);

    if (appointment.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // If appointment was booked with subscription, restore the massage credit
    if (appointment[0].subscriptionId) {
      const subscription = await db.select()
        .from(userSubscriptions)
        .where(eq(userSubscriptions.id, appointment[0].subscriptionId))
        .limit(1);

      if (subscription.length > 0) {
        await db.update(userSubscriptions)
          .set({ massagesRemaining: subscription[0].massagesRemaining + 1 })
          .where(eq(userSubscriptions.id, subscription[0].id));
      }
    }

    await db.update(appointments)
      .set({ status: 'cancelled' })
      .where(eq(appointments.id, parseInt(id)));

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get available time slots (mock data for now)
router.get('/available-slots', async (req, res: Response) => {
  try {
    const { date } = req.query;
    
    // Generate mock available slots for the requested date
    const baseDate = date ? new Date(date as string) : new Date();
    const slots = [];
    
    const hours = [9, 10, 11, 13, 14, 15, 16, 17];
    for (const hour of hours) {
      const slotDate = new Date(baseDate);
      slotDate.setHours(hour, 0, 0, 0);
      
      // Randomly mark some as unavailable for realism
      if (Math.random() > 0.3) {
        slots.push({
          dateTime: slotDate.toISOString(),
          available: true,
        });
      }
    }

    res.json(slots);
  } catch (error) {
    console.error('Get available slots error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
