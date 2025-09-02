import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { sendEmail, emailTemplates } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { lessonId } = await request.json();
    const client = await pool.connect();
    
    // Check if progress exists
    const existingProgress = await client.query(
      'SELECT * FROM user_progress WHERE lesson_id = $1',
      [lessonId]
    );
    
    if (existingProgress.rows.length > 0) {
      // Toggle completion
      if (existingProgress.rows[0].completed_at) {
        // Mark as incomplete
        await client.query(
          'UPDATE user_progress SET completed_at = NULL, updated_at = CURRENT_TIMESTAMP WHERE lesson_id = $1',
          [lessonId]
        );
      } else {
        // Mark as complete
        await client.query(
          'UPDATE user_progress SET completed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE lesson_id = $1',
          [lessonId]
        );
      }
    } else {
      // Create new progress entry as completed
      await client.query(
        'INSERT INTO user_progress (lesson_id, completed_at, confidence_level) VALUES ($1, CURRENT_TIMESTAMP, 3)',
        [lessonId]
      );
    }
    
    // Update user stats and get lesson info for email
    const updatedStats = await updateUserStats(client, lessonId);
    
    // Get lesson details for email
    const lessonQuery = await client.query(
      'SELECT title FROM lessons WHERE id = $1',
      [lessonId]
    );
    
    client.release();
    
    // Send congratulatory email when lesson is completed
    if (lessonQuery.rows.length > 0 && updatedStats.wasJustCompleted) {
      const lessonTitle = lessonQuery.rows[0].title;
      const streak = updatedStats.currentStreak;
      
      // Send email to track user engagement
      const emailTemplate = emailTemplates.lessonCompleted(lessonTitle, streak);
      await sendEmail({
        to: 'hamid.coder.js@gmail.com',
        subject: emailTemplate.subject,
        html: emailTemplate.html,
      });
      
      // Send achievement emails for milestones
      if (updatedStats.totalCompleted === 10) {
        const achievementTemplate = emailTemplates.congratulationsEmail(
          'First 10 Lessons Complete!',
          'You\'ve completed your first 10 lessons! This shows real dedication to mastering system design and coding skills.'
        );
        await sendEmail({
          to: 'hamid.coder.js@gmail.com',
          subject: achievementTemplate.subject,
          html: achievementTemplate.html,
        });
      } else if (streak === 7) {
        const achievementTemplate = emailTemplates.congratulationsEmail(
          'Week-Long Streak Master!',
          'Seven days in a row! You\'re building the kind of consistent study habits that lead to FAANG success.'
        );
        await sendEmail({
          to: 'hamid.coder.js@gmail.com',
          subject: achievementTemplate.subject,
          html: achievementTemplate.html,
        });
      } else if (streak === 30) {
        const achievementTemplate = emailTemplates.congratulationsEmail(
          'Monthly Consistency Champion!',
          'Thirty days of consistent learning! You\'re in the top 1% of dedicated learners. FAANG companies will love this commitment!'
        );
        await sendEmail({
          to: 'hamid.coder.js@gmail.com',
          subject: achievementTemplate.subject,
          html: achievementTemplate.html,
        });
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}

async function updateUserStats(client: any, lessonId: string) {
  // Check if this was just completed (for email trigger)
  const recentCompletion = await client.query(`
    SELECT completed_at FROM user_progress 
    WHERE lesson_id = $1 AND completed_at > NOW() - INTERVAL '1 minute'
  `, [lessonId]);
  const wasJustCompleted = recentCompletion.rows.length > 0;
  
  // Count completed lessons
  const completedCount = await client.query(
    'SELECT COUNT(*) FROM user_progress WHERE completed_at IS NOT NULL'
  );
  
  // Calculate total hours (estimate based on completed lessons)
  const hoursResult = await client.query(`
    SELECT SUM(l.estimated_hours) as total_hours
    FROM lessons l
    JOIN user_progress up ON l.id = up.lesson_id
    WHERE up.completed_at IS NOT NULL
  `);
  
  // Calculate streak (simplified - consecutive days with completions)
  const today = new Date().toISOString().split('T')[0];
  const recentActivity = await client.query(`
    SELECT DATE(completed_at) as completion_date, COUNT(*) as lessons_completed
    FROM user_progress 
    WHERE completed_at IS NOT NULL 
    GROUP BY DATE(completed_at)
    ORDER BY completion_date DESC
    LIMIT 30
  `);
  
  let currentStreak = 0;
  const dates = recentActivity.rows.map((row: any) => row.completion_date);
  
  if (dates.length > 0) {
    const todayDate = new Date(today);
    let checkDate = new Date(todayDate);
    
    for (let i = 0; i < dates.length; i++) {
      const activityDate = new Date(dates[i]);
      if (activityDate.toDateString() === checkDate.toDateString()) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }
  
  // Update stats
  await client.query(`
    UPDATE user_stats SET 
      total_lessons_completed = $1,
      total_hours_studied = $2,
      current_streak = $3,
      longest_streak = GREATEST(longest_streak, $3),
      last_study_date = CURRENT_DATE,
      updated_at = CURRENT_TIMESTAMP
  `, [
    parseInt(completedCount.rows[0].count),
    parseInt(hoursResult.rows[0].total_hours || 0),
    currentStreak
  ]);
  
  return {
    wasJustCompleted,
    currentStreak,
    totalCompleted: parseInt(completedCount.rows[0].count),
    totalHours: parseInt(hoursResult.rows[0].total_hours || 0),
  };
}
