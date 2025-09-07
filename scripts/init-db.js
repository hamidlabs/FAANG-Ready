const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

async function createDatabaseIfNotExists() {
  const dbUrl = new URL(process.env.DATABASE_URL);
  const dbName = dbUrl.pathname.slice(1); // Remove leading '/'
  
  // Connect to postgres database to create target database
  const adminDbUrl = new URL(process.env.DATABASE_URL);
  adminDbUrl.pathname = '/postgres'; // Connect to default postgres db
  
  const adminPool = new Pool({
    connectionString: adminDbUrl.toString(),
  });

  try {
    const client = await adminPool.connect();
    
    // Check if database exists
    const result = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName]
    );
    
    if (result.rows.length === 0) {
      console.log(`🔧 Creating database "${dbName}"...`);
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✅ Database "${dbName}" created successfully!`);
    } else {
      console.log(`📋 Database "${dbName}" already exists`);
    }
    
    client.release();
  } finally {
    await adminPool.end();
  }
}

async function initializeDatabase() {
  try {
    // First, create database if it doesn't exist
    await createDatabaseIfNotExists();
    
    // Now connect to the target database
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    const client = await pool.connect();
    
    // Read and execute reset script first (cleans up old structure)
    const resetPath = path.join(__dirname, '../sql/reset-db.sql');
    if (fs.existsSync(resetPath)) {
      console.log('🧹 Cleaning up old database structure...');
      const resetSql = fs.readFileSync(resetPath, 'utf8');
      await client.query(resetSql);
      console.log('✅ Database reset completed!');
    } else {
      // Fallback to schema.sql if reset doesn't exist
      const schemaPath = path.join(__dirname, '../sql/schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      await client.query(schema);
    }
    
    console.log('✅ Database initialized successfully for file-based content discovery!');
    console.log('📁 Content is now automatically discovered from the content/ directory');
    
    client.release();
    await pool.end();
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    console.error('Make sure your DATABASE_URL is correct in .env.local');
    console.error('If using a cloud database, make sure you have CREATE DATABASE permissions');
  }
}

initializeDatabase();
