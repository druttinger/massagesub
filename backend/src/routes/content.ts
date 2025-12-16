import { Router, Response } from 'express';
import { db } from '../db';
import { bonusContent, userSubscriptions } from '../db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all bonus content (public can see non-subscriber content, subscribers see all)
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    // Check if user has active subscription
    const subscription = await db.select()
      .from(userSubscriptions)
      .where(
        and(
          eq(userSubscriptions.userId, req.userId!),
          eq(userSubscriptions.status, 'active')
        )
      )
      .limit(1);

    const hasSubscription = subscription.length > 0;

    let content;
    if (hasSubscription) {
      // Subscribers can see all content
      content = await db.select()
        .from(bonusContent)
        .orderBy(desc(bonusContent.publishedAt));
    } else {
      // Non-subscribers only see free content
      content = await db.select()
        .from(bonusContent)
        .where(eq(bonusContent.subscriberOnly, false))
        .orderBy(desc(bonusContent.publishedAt));
    }

    res.json({
      hasSubscription,
      content,
    });
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get featured/latest content for home screen
router.get('/featured', async (req, res: Response) => {
  try {
    const featured = await db.select()
      .from(bonusContent)
      .where(eq(bonusContent.isFeatured, true))
      .orderBy(desc(bonusContent.publishedAt))
      .limit(3);

    res.json(featured);
  } catch (error) {
    console.error('Get featured content error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get latest content
router.get('/latest', async (req, res: Response) => {
  try {
    const latest = await db.select()
      .from(bonusContent)
      .orderBy(desc(bonusContent.publishedAt))
      .limit(5);

    res.json(latest);
  } catch (error) {
    console.error('Get latest content error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get content by category
router.get('/category/:category', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { category } = req.params;

    // Check subscription status
    const subscription = await db.select()
      .from(userSubscriptions)
      .where(
        and(
          eq(userSubscriptions.userId, req.userId!),
          eq(userSubscriptions.status, 'active')
        )
      )
      .limit(1);

    const hasSubscription = subscription.length > 0;

    let content;
    if (hasSubscription) {
      content = await db.select()
        .from(bonusContent)
        .where(eq(bonusContent.category, category))
        .orderBy(desc(bonusContent.publishedAt));
    } else {
      content = await db.select()
        .from(bonusContent)
        .where(
          and(
            eq(bonusContent.category, category),
            eq(bonusContent.subscriberOnly, false)
          )
        )
        .orderBy(desc(bonusContent.publishedAt));
    }

    res.json({
      hasSubscription,
      content,
    });
  } catch (error) {
    console.error('Get content by category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single content item
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const contentItem = await db.select()
      .from(bonusContent)
      .where(eq(bonusContent.id, parseInt(id)))
      .limit(1);

    if (contentItem.length === 0) {
      return res.status(404).json({ error: 'Content not found' });
    }

    const item = contentItem[0];

    // Check if subscriber-only content
    if (item.subscriberOnly) {
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
        return res.status(403).json({ 
          error: 'Subscription required',
          message: 'This content is only available to subscribers'
        });
      }
    }

    res.json(item);
  } catch (error) {
    console.error('Get content item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
