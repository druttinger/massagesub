import { Router, Response } from 'express';
import { db } from '../db';
import { subscriptionPlans, userSubscriptions, paymentHistory } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Get all available subscription plans
router.get('/plans', async (req, res: Response) => {
  try {
    const plans = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.isActive, true));
    
    // Parse features JSON for each plan
    const parsedPlans = plans.map(plan => ({
      ...plan,
      features: JSON.parse(plan.features),
    }));

    res.json(parsedPlans);
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's current subscription
router.get('/my-subscription', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const subscription = await db.select({
      subscription: userSubscriptions,
      plan: subscriptionPlans,
    })
      .from(userSubscriptions)
      .innerJoin(subscriptionPlans, eq(userSubscriptions.planId, subscriptionPlans.id))
      .where(
        and(
          eq(userSubscriptions.userId, req.userId!),
          eq(userSubscriptions.status, 'active')
        )
      )
      .limit(1);

    if (subscription.length === 0) {
      return res.json({ hasSubscription: false });
    }

    const sub = subscription[0];
    res.json({
      hasSubscription: true,
      subscription: {
        ...sub.subscription,
        plan: {
          ...sub.plan,
          features: JSON.parse(sub.plan.features),
        },
      },
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Subscribe to a plan (MOCK PAYMENT)
router.post('/subscribe', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { planId, paymentDetails } = req.body;

    // Validate plan exists
    const planResults = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, planId)).limit(1);
    if (planResults.length === 0) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    const plan = planResults[0];

    // Check for existing active subscription
    const existingSub = await db.select()
      .from(userSubscriptions)
      .where(
        and(
          eq(userSubscriptions.userId, req.userId!),
          eq(userSubscriptions.status, 'active')
        )
      )
      .limit(1);

    if (existingSub.length > 0) {
      return res.status(400).json({ error: 'You already have an active subscription. Please cancel it first.' });
    }

    // MOCK PAYMENT PROCESSING
    console.log('Processing mock payment:', { planId, paymentDetails });
    const mockTransactionId = `mock_txn_${uuidv4()}`;

    // Create subscription
    const startDate = new Date();
    const nextBillingDate = new Date();
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

    const newSubscription = await db.insert(userSubscriptions).values({
      userId: req.userId!,
      planId: plan.id,
      status: 'active',
      startDate: startDate.toISOString(),
      nextBillingDate: nextBillingDate.toISOString(),
      massagesRemaining: plan.massagesPerMonth,
      createdAt: new Date().toISOString(),
    }).returning();

    // Record payment
    await db.insert(paymentHistory).values({
      userId: req.userId!,
      subscriptionId: newSubscription[0].id,
      amount: plan.priceMonthly,
      status: 'completed',
      paymentMethod: 'mock_card',
      transactionId: mockTransactionId,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({
      message: 'Subscription created successfully',
      subscription: {
        ...newSubscription[0],
        plan: {
          ...plan,
          features: JSON.parse(plan.features),
        },
      },
      payment: {
        transactionId: mockTransactionId,
        amount: plan.priceMonthly,
        status: 'completed',
      },
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cancel subscription
router.post('/cancel', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const result = await db.update(userSubscriptions)
      .set({ status: 'cancelled' })
      .where(
        and(
          eq(userSubscriptions.userId, req.userId!),
          eq(userSubscriptions.status, 'active')
        )
      )
      .returning();

    if (result.length === 0) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    res.json({ message: 'Subscription cancelled successfully' });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Pause subscription
router.post('/pause', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const result = await db.update(userSubscriptions)
      .set({ status: 'paused' })
      .where(
        and(
          eq(userSubscriptions.userId, req.userId!),
          eq(userSubscriptions.status, 'active')
        )
      )
      .returning();

    if (result.length === 0) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    res.json({ message: 'Subscription paused successfully' });
  } catch (error) {
    console.error('Pause subscription error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Resume subscription
router.post('/resume', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const result = await db.update(userSubscriptions)
      .set({ status: 'active' })
      .where(
        and(
          eq(userSubscriptions.userId, req.userId!),
          eq(userSubscriptions.status, 'paused')
        )
      )
      .returning();

    if (result.length === 0) {
      return res.status(404).json({ error: 'No paused subscription found' });
    }

    res.json({ message: 'Subscription resumed successfully' });
  } catch (error) {
    console.error('Resume subscription error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get payment history
router.get('/payment-history', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const payments = await db.select()
      .from(paymentHistory)
      .where(eq(paymentHistory.userId, req.userId!))
      .orderBy(paymentHistory.createdAt);

    res.json(payments);
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
