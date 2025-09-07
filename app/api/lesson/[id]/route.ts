import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getLessonById } from '@/lib/content-discovery';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Get lesson content from file system
    const lesson = getLessonById(params.id);
    
    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }
    
    // Get user progress from database (only for progress tracking)
    let progress = { completed: false, confidence_level: null };
    
    try {
      const client = await pool.connect();
      
      const progressQuery = `
        SELECT 
          completed_at IS NOT NULL as completed,
          confidence_level
        FROM user_progress
        WHERE lesson_id = $1
      `;
      
      const progressResult = await client.query(progressQuery, [params.id]);
      client.release();
      
      if (progressResult.rows.length > 0) {
        progress = progressResult.rows[0];
      }
    } catch (dbError) {
      console.warn('Database query failed, using default progress:', dbError instanceof Error ? dbError.message : String(dbError));
    }
    
    // Combine lesson data with progress
    const lessonWithProgress = {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      estimated_hours: lesson.estimated_hours,
      difficulty: lesson.difficulty,
      phase_name: lesson.phase_name,
      completed: progress.completed,
      confidence_level: progress.confidence_level
    };
    
    return NextResponse.json(lessonWithProgress);
  } catch (error) {
    console.error('Content discovery error:', error);
    return NextResponse.json({ error: 'Failed to fetch lesson' }, { status: 500 });
  }
}