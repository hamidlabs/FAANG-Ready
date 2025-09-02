import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { sendEmail, emailTemplates } from '@/lib/email';

export async function GET() {
  try {
    const client = await pool.connect();
    
    // Get weekly progress stats
    const weeklyStats = await client.query(`
      SELECT 
        COUNT(up.id) as lessons_completed_this_week,
        COALESCE(SUM(l.estimated_hours), 0) as hours_this_week
      FROM user_progress up
      JOIN lessons l ON up.lesson_id = l.id
      WHERE up.completed_at >= CURRENT_DATE - INTERVAL '7 days'
        AND up.completed_at IS NOT NULL
    `);
    
    // Get current streak
    const streakResult = await client.query(`
      SELECT current_streak, total_lessons_completed, total_hours_studied
      FROM user_stats
      LIMIT 1
    `);
    
    if (streakResult.rows.length === 0) {
      client.release();
      return NextResponse.json({ message: 'No user stats found' });
    }
    
    const weeklyData = weeklyStats.rows[0];
    const currentStats = streakResult.rows[0];
    
    // Only send if user has been active this week
    if (parseInt(weeklyData.lessons_completed_this_week) > 0) {
      const progressTemplate = emailTemplates.weeklyProgress(
        parseInt(weeklyData.lessons_completed_this_week),
        parseInt(weeklyData.hours_this_week),
        currentStats.current_streak
      );
      
      await sendEmail({
        to: 'hamid.coder.js@gmail.com',
        subject: progressTemplate.subject,
        html: progressTemplate.html,
      });
      
      console.log(`Weekly progress email sent: ${weeklyData.lessons_completed_this_week} lessons, ${weeklyData.hours_this_week} hours`);
    }
    
    client.release();
    return NextResponse.json({ 
      message: 'Weekly progress check completed',
      lessonsThisWeek: parseInt(weeklyData.lessons_completed_this_week),
      hoursThisWeek: parseInt(weeklyData.hours_this_week),
      emailSent: parseInt(weeklyData.lessons_completed_this_week) > 0
    });
  } catch (error) {
    console.error('Weekly progress error:', error);
    return NextResponse.json({ error: 'Failed to process weekly progress' }, { status: 500 });
  }
}