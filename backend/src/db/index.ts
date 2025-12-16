import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import path from 'path';
import fs from 'fs';

// Ensure data directory exists
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const sqlite = new Database(path.join(dataDir, 'massage.db'));
export const db = drizzle(sqlite, { schema });

// Initialize database with tables
export function initializeDatabase() {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS subscription_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price_monthly REAL NOT NULL,
      massages_per_month INTEGER NOT NULL,
      duration_minutes INTEGER NOT NULL,
      features TEXT NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS user_subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      plan_id INTEGER NOT NULL REFERENCES subscription_plans(id),
      status TEXT NOT NULL DEFAULT 'active',
      start_date TEXT NOT NULL,
      next_billing_date TEXT NOT NULL,
      massages_remaining INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      subscription_id INTEGER REFERENCES user_subscriptions(id),
      date_time TEXT NOT NULL,
      duration_minutes INTEGER NOT NULL,
      service_type TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'scheduled',
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS bonus_content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      content_type TEXT NOT NULL,
      content_url TEXT NOT NULL,
      thumbnail_url TEXT,
      duration TEXT,
      category TEXT NOT NULL,
      is_featured INTEGER NOT NULL DEFAULT 0,
      subscriber_only INTEGER NOT NULL DEFAULT 1,
      published_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS payment_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      subscription_id INTEGER REFERENCES user_subscriptions(id),
      amount REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'completed',
      payment_method TEXT NOT NULL DEFAULT 'mock_card',
      transaction_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('Database initialized successfully');
}
