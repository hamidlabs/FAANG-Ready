import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { discoverContent } from '@/lib/content-discovery';

export async function GET() {
  try {
    // Get content from file system
    const phases = discoverContent();
    
    // Get user progress from database
    const client = await pool.connect();
    
    const progressQuery = `
      SELECT 
        lesson_id,
        completed_at IS NOT NULL as completed,
        confidence_level
      FROM user_progress
    `;
    
    const progressResult = await client.query(progressQuery);
    client.release();
    
    // Create a map of lesson progress by lesson ID
    const progressMap = new Map();
    progressResult.rows.forEach(row => {
      progressMap.set(row.lesson_id, {
        completed: row.completed,
        confidence_level: row.confidence_level
      });
    });
    
    // Merge content data with progress data
    const phasesWithProgress = phases.map(phase => {
      const lessonsWithProgress = phase.lessons.map(lesson => {
        const progress = progressMap.get(lesson.id) || { completed: false };
        return {
          ...lesson,
          completed: progress.completed,
          confidence_level: progress.confidence_level
        };
      });
      
      const completed = lessonsWithProgress.filter(l => l.completed).length;
      
      return {
        id: parseInt(phase.id.replace('phase-', '')),
        name: phase.name,
        description: phase.description,
        week_start: phase.week_start,
        week_end: phase.week_end,
        lessons: lessonsWithProgress,
        completed,
        total: phase.total
      };
    });
    
    return NextResponse.json(phasesWithProgress);
  } catch (error) {
    console.error('Content discovery error:', error);
    return NextResponse.json({ error: 'Failed to fetch phases' }, { status: 500 });
  }
}