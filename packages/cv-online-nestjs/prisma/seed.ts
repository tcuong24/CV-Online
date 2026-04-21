
import 'dotenv/config';  
import { PrismaClient } from '../generated/prisma/client';  

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL not set in .env');
}

const pool = new Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();  // ← quan trọng: đóng pool để tránh leak
  });

async function main() {
  console.log('🌱 Starting seed...');

  // Execute seed.sql first
  try {
    const fs = await import('fs');
    const path = await import('path');
    const sqlPath = path.join(__dirname, 'seed.sql');
    if (fs.existsSync(sqlPath)) {
      console.log('📖 Reading seed.sql...');
      const sql = fs.readFileSync(sqlPath, 'utf-8');
      
      // Split by semicolon and filter empty lines to execute cleanly, 
      // or execute as one big block if the driver supports it (pg usually does)
      console.log('🚀 Executing seed.sql...');
      await prisma.$executeRawUnsafe(sql);
      console.log('✅ SQL seed completed.');
    }
  } catch (err) {
    console.error('⚠️ Warning: Could not execute seed.sql:', err.message);
  }

  // Create users
  const user1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      fullName: 'John Doe',
      passwordHash: 'hashed_password_here',
      subscriptionType: 'free',
    },
  });

  console.log('✅ Created user:', user1.email);

  console.log('✅ Created user:', user1.email);

  console.log('🎉 Seed completed!');
}