const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
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
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    console.error('Make sure your DATABASE_URL is correct in .env.local');
  } finally {
    await pool.end();
  }
}

initializeDatabase();
