const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/sqr400'
});

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('Connected to PostgreSQL. Creating tables if not exist...');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        password_salt VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        registered_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS traffic (
        id VARCHAR(50) PRIMARY KEY,
        timestamp TIMESTAMPTZ DEFAULT NOW(),
        username VARCHAR(255) REFERENCES users(username) ON DELETE CASCADE,
        bank VARCHAR(100),
        amount NUMERIC,
        currency VARCHAR(10),
        sender_ref VARCHAR(100)
      );
    `);

    console.log('Tables created successfully. Reading db.json...');
    const dbPath = path.join(__dirname, 'data', 'db.json');
    if (fs.existsSync(dbPath)) {
      const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      
      // Migrate Users
      if (dbData.users && dbData.users.length > 0) {
        console.log(`Migrating ${dbData.users.length} users...`);
        for (const user of dbData.users) {
          await client.query(
            `INSERT INTO users (username, password_hash, password_salt, role, registered_at) 
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (username) DO NOTHING`,
            [user.username, user.passwordHash, user.passwordSalt, user.role || 'user', user.registeredAt || new Date().toISOString()]
          );
        }
      }

      // Migrate Traffic
      if (dbData.traffic && dbData.traffic.length > 0) {
        console.log(`Migrating ${dbData.traffic.length} traffic records...`);
        for (const t of dbData.traffic) {
          await client.query(
            `INSERT INTO traffic (id, timestamp, username, bank, amount, currency, sender_ref)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             ON CONFLICT (id) DO NOTHING`,
            [t.id, t.timestamp, t.username, t.bank, t.amount, t.currency, t.senderRef]
          );
        }
      }

      console.log('Migration completed successfully!');
    } else {
      console.log('data/db.json not found, skipping data import.');
    }
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    client.release();
    pool.end();
  }
}

migrate();
