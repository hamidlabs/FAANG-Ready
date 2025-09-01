import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const client = await pool.connect();
    
    // Get phases with lesson counts
    const phasesQuery = `
      SELECT 
        p.*,
        COUNT(l.id) as total_lessons,
        COUNT(CASE WHEN up.completed_at IS NOT NULL THEN 1 END) as completed_lessons
      FROM phases p
      LEFT JOIN lessons l ON p.id = l.phase_id
      LEFT JOIN user_progress up ON l.id = up.lesson_id
      GROUP BY p.id
      ORDER BY p.week_start
    `;
    
    const phasesResult = await client.query(phasesQuery);
    
    // Get lessons for each phase
    const lessonsQuery = `
      SELECT 
        l.*,
        CASE WHEN up.completed_at IS NOT NULL THEN true ELSE false END as completed,
        up.confidence_level
      FROM lessons l
      LEFT JOIN user_progress up ON l.id = up.lesson_id
      ORDER BY l.phase_id, l.order_index
    `;
    
    const lessonsResult = await client.query(lessonsQuery);
    
    client.release();
    
    // Group lessons by phase
    const lessonsByPhase = lessonsResult.rows.reduce((acc, lesson) => {
      if (!acc[lesson.phase_id]) acc[lesson.phase_id] = [];
      acc[lesson.phase_id].push(lesson);
      return acc;
    }, {});
    
    // Combine phases with their lessons
    const phases = phasesResult.rows.map(phase => ({
      ...phase,
      lessons: lessonsByPhase[phase.id] || [],
      completed: parseInt(phase.completed_lessons),
      total: parseInt(phase.total_lessons)
    }));
    
    return NextResponse.json(phases);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch phases' }, { status: 500 });
  }
}
