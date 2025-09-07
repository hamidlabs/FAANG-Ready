import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const client = await pool.connect();
    
    // Get or create user stats
    let statsResult = await client.query('SELECT * FROM user_stats LIMIT 1');
    
    if (statsResult.rows.length === 0) {
      // Create initial stats if none exist
      await client.query(`
        INSERT INTO user_stats (current_streak, longest_streak, total_lessons_completed, total_hours_studied)
        VALUES (0, 0, 0, 0)
      `);
      statsResult = await client.query('SELECT * FROM user_stats LIMIT 1');
    }
    
    client.release();
    
    return NextResponse.json(statsResult.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
