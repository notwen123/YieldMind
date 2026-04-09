import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function main() {
  const dbUrl = process.env.DB_URL;
  if (!dbUrl) {
    console.error('❌ DB_URL not found in .env.local');
    process.exit(1);
  }

  const client = new Client({
    connectionString: dbUrl,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  });

  try {
    console.log('🔄 Connecting to Supabase...');
    await client.connect();
    console.log('✅ Connected.');

    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20260409000000_init.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('🚀 Pushing schema to Supabase...');
    await client.query(sql);
    console.log('✅ Schema pushed successfully!');

  } catch (error: any) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    await client.end();
  }
}

main().catch(console.error);
