import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { sendEmail, emailTemplates } from '@/lib/email';

export async function GET() {
  try {
    const client = await pool.connect();
    
    // Check current user stats
    const statsResult = await client.query(`
      SELECT current_streak, last_study_date, total_lessons_completed
      FROM user_stats
      LIMIT 1
    `);
    
    if (statsResult.rows.length === 0) {
      client.release();
      return NextResponse.json({ message: 'No user stats found' });
    }
    
    const stats = statsResult.rows[0];
    const today = new Date();
    const lastStudyDate = new Date(stats.last_study_date);
    const daysSinceLastStudy = Math.floor((today.getTime() - lastStudyDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Send streak reminder if user hasn't studied today but has an active streak
    if (daysSinceLastStudy >= 1 && stats.current_streak > 0) {
      const streakTemplate = emailTemplates.streakReminder(stats.current_streak);
      await sendEmail({
        to: 'hamid.coder.js@gmail.com',
        subject: streakTemplate.subject,
        html: streakTemplate.html,
      });
      
      console.log(`Streak reminder sent for ${stats.current_streak}-day streak`);
    }
    
    client.release();
    return NextResponse.json({ 
      message: 'Streak reminder check completed',
      streakReminderSent: daysSinceLastStudy >= 1 && stats.current_streak > 0
    });
  } catch (error) {
    console.error('Streak reminder error:', error);
    return NextResponse.json({ error: 'Failed to process streak reminder' }, { status: 500 });
  }
}