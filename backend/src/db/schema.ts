import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// Users table
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  phone: text('phone'),
  createdAt: text('created_at').notNull().default(new Date().toISOString()),
  updatedAt: text('updated_at').notNull().default(new Date().toISOString()),
});

// Subscription plans
export const subscriptionPlans = sqliteTable('subscription_plans', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description').notNull(),
  priceMonthly: real('price_monthly').notNull(),
  massagesPerMonth: integer('massages_per_month').notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  features: text('features').notNull(), // JSON array stored as text
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
});

// User subscriptions
export const userSubscriptions = sqliteTable('user_subscriptions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  planId: integer('plan_id').notNull().references(() => subscriptionPlans.id),
  status: text('status').notNull().default('active'), // active, paused, cancelled
  startDate: text('start_date').notNull(),
  nextBillingDate: text('next_billing_date').notNull(),
  massagesRemaining: integer('massages_remaining').notNull(),
  createdAt: text('created_at').notNull().default(new Date().toISOString()),
});

// Appointments
export const appointments = sqliteTable('appointments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  subscriptionId: integer('subscription_id').references(() => userSubscriptions.id),
  dateTime: text('date_time').notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  serviceType: text('service_type').notNull(),
  status: text('status').notNull().default('scheduled'), // scheduled, completed, cancelled
  notes: text('notes'),
  createdAt: text('created_at').notNull().default(new Date().toISOString()),
});

// Bonus content (videos, articles, etc.)
export const bonusContent = sqliteTable('bonus_content', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  contentType: text('content_type').notNull(), // video, article, audio
  contentUrl: text('content_url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  duration: text('duration'), // for videos/audio
  category: text('category').notNull(), // wellness, technique, meditation, etc.
  isFeatured: integer('is_featured', { mode: 'boolean' }).notNull().default(false),
  subscriberOnly: integer('subscriber_only', { mode: 'boolean' }).notNull().default(true),
  publishedAt: text('published_at').notNull(),
  createdAt: text('created_at').notNull().default(new Date().toISOString()),
});

// Payment history (mocked for now)
export const paymentHistory = sqliteTable('payment_history', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  subscriptionId: integer('subscription_id').references(() => userSubscriptions.id),
  amount: real('amount').notNull(),
  status: text('status').notNull().default('completed'), // pending, completed, failed
  paymentMethod: text('payment_method').notNull().default('mock_card'),
  transactionId: text('transaction_id').notNull(),
  createdAt: text('created_at').notNull().default(new Date().toISOString()),
});

// Types for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type Appointment = typeof appointments.$inferSelect;
export type BonusContent = typeof bonusContent.$inferSelect;
export type PaymentHistory = typeof paymentHistory.$inferSelect;
