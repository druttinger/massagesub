import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { generateToken, authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Register new user
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Email, password, first name, and last name are required' });
    }

    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await db.insert(users).values({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone: phone || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }).returning();

    const newUser = result[0];
    const token = generateToken(newUser.id);

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      },
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const userResults = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (userResults.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = userResults[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user profile
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userResults = await db.select().from(users).where(eq(users.id, req.userId!)).limit(1);
    
    if (userResults.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResults[0];
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { firstName, lastName, phone } = req.body;

    await db.update(users)
      .set({
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.id, req.userId!));

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
