import pg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pg;
dotenv.config();

// Check if we're connecting to a cloud database that requires SSL
const connectionString = process.env.DATABASE_URL;
const isCloudDatabase = connectionString && (
  connectionString.includes('render.com') || 
  connectionString.includes('amazonaws.com') ||
  connectionString.includes('heroku') ||
  connectionString.includes('azure') ||
  connectionString.includes('neon.tech')
);

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Only use SSL for cloud databases, not for localhost
  ssl: isCloudDatabase ? {
    rejectUnauthorized: false
  } : false
});

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection error:', err.message);
  } else {
    console.log('✅ Database connected successfully to:', connectionString.split('@')[1]?.split('/')[0] || 'database');
    release();
  }
});