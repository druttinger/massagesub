import { db } from './index';
import { subscriptionPlans, bonusContent } from './schema';
import bcrypt from 'bcryptjs';
import { users } from './schema';

export async function seedDatabase() {
  // Check if already seeded
  const existingPlans = await db.select().from(subscriptionPlans);
  if (existingPlans.length > 0) {
    console.log('Database already seeded');
    return;
  }

  // Seed subscription plans
  await db.insert(subscriptionPlans).values([
    {
      name: 'Relaxation',
      description: 'Perfect for monthly self-care and stress relief',
      priceMonthly: 89.00,
      massagesPerMonth: 1,
      durationMinutes: 60,
      features: JSON.stringify([
        '1 x 60-minute massage per month',
        'Access to bonus wellness content',
        'Priority booking',
        '10% off additional services'
      ]),
      isActive: true,
    },
    {
      name: 'Wellness',
      description: 'Ideal for active recovery and ongoing wellness',
      priceMonthly: 159.00,
      massagesPerMonth: 2,
      durationMinutes: 60,
      features: JSON.stringify([
        '2 x 60-minute massages per month',
        'Access to all bonus content',
        'Priority booking',
        '15% off additional services',
        'Free aromatherapy upgrade'
      ]),
      isActive: true,
    },
    {
      name: 'Rejuvenation',
      description: 'Complete therapeutic care for chronic pain relief',
      priceMonthly: 249.00,
      massagesPerMonth: 4,
      durationMinutes: 60,
      features: JSON.stringify([
        '4 x 60-minute massages per month',
        'Access to all bonus content',
        'Same-day booking when available',
        '20% off additional services',
        'Free aromatherapy & hot stones',
        'Monthly wellness consultation'
      ]),
      isActive: true,
    },
  ]);

  // Seed bonus content
  await db.insert(bonusContent).values([
    {
      title: 'Morning Stretch Routine for Back Pain',
      description: 'A gentle 10-minute stretching routine to start your day and alleviate lower back tension.',
      contentType: 'video',
      contentUrl: 'https://example.com/videos/morning-stretch',
      thumbnailUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
      duration: '10:23',
      category: 'wellness',
      isFeatured: true,
      subscriberOnly: false,
      publishedAt: new Date().toISOString(),
    },
    {
      title: 'Understanding Ayurvedic Body Types',
      description: 'Learn about Vata, Pitta, and Kapha doshas and how they influence your wellness journey.',
      contentType: 'video',
      contentUrl: 'https://example.com/videos/ayurveda-doshas',
      thumbnailUrl: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=400',
      duration: '15:47',
      category: 'ayurveda',
      isFeatured: true,
      subscriberOnly: true,
      publishedAt: new Date().toISOString(),
    },
    {
      title: 'Self-Massage Techniques for Neck Tension',
      description: 'Professional techniques you can use at home between appointments.',
      contentType: 'video',
      contentUrl: 'https://example.com/videos/neck-self-massage',
      thumbnailUrl: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400',
      duration: '8:15',
      category: 'technique',
      isFeatured: false,
      subscriberOnly: true,
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      title: 'Guided Meditation for Deep Relaxation',
      description: 'A calming 20-minute guided meditation to reduce stress and promote healing.',
      contentType: 'audio',
      contentUrl: 'https://example.com/audio/deep-relaxation',
      thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      duration: '20:00',
      category: 'meditation',
      isFeatured: false,
      subscriberOnly: true,
      publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      title: 'The Benefits of Regular Massage Therapy',
      description: 'Discover the science-backed benefits of incorporating massage into your wellness routine.',
      contentType: 'article',
      contentUrl: 'https://example.com/articles/massage-benefits',
      thumbnailUrl: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=400',
      duration: '5 min read',
      category: 'wellness',
      isFeatured: false,
      subscriberOnly: false,
      publishedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]);

  // Create a demo user
  const hashedPassword = await bcrypt.hash('demo123', 10);
  await db.insert(users).values({
    email: 'demo@example.com',
    password: hashedPassword,
    firstName: 'Demo',
    lastName: 'User',
    phone: '555-123-4567',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  console.log('Database seeded successfully');
}
