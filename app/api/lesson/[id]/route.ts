import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await pool.connect();
    
    const query = `
      SELECT 
        l.*,
        p.name as phase_name,
        CASE WHEN up.completed_at IS NOT NULL THEN true ELSE false END as completed,
        up.confidence_level
      FROM lessons l
      JOIN phases p ON l.phase_id = p.id
      LEFT JOIN user_progress up ON l.id = up.lesson_id
      WHERE l.id = $1
    `;
    
    const result = await client.query(query, [params.id]);
    client.release();
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch lesson' }, { status: 500 });
  }
}
