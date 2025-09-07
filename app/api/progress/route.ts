import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { sendEmail, emailTemplates } from '@/lib/email';
import { getLessonById, discoverContent } from '@/lib/content-discovery';

export async function POST(request: Request) {
  try {
    const { lessonId } = await request.json();
    const client = await pool.connect();
    
    // Check if progress exists
    const existingProgress = await client.query(
      'SELECT * FROM user_progress WHERE lesson_id = $1',
      [lessonId]
    );
    
    let wasJustCompleted = false;
    
    if (existingProgress.rows.length > 0) {
      // Toggle completion
      if (existingProgress.rows[0].completed_at) {
        // Mark as incomplete
        await client.query(
          'UPDATE user_progress SET completed_at = NULL, updated_at = CURRENT_TIMESTAMP WHERE lesson_id = $1',
          [lessonId]
        );
        wasJustCompleted = false;
      } else {
        // Mark as complete
        await client.query(
          'UPDATE user_progress SET completed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE lesson_id = $1',
          [lessonId]
        );
        wasJustCompleted = true;
      }
    } else {
      // Create new progress entry as completed
      await client.query(
        'INSERT INTO user_progress (lesson_id, completed_at, confidence_level) VALUES ($1, CURRENT_TIMESTAMP, 3)',
        [lessonId]
      );
      wasJustCompleted = true;
    }
    
    // Update user stats
    const updatedStats = await updateUserStats(client, lessonId, wasJustCompleted);
    
    client.release();
    
    // Get lesson details from content discovery for email
    let lessonTitle = 'Unknown Lesson';
    try {
      const { getLessonById } = await import('@/lib/content-discovery');
      const lesson = getLessonById(lessonId);
      if (lesson) {
        lessonTitle = lesson.title;
      }
    } catch (error) {
      console.error('Could not get lesson title:', error);
    }
    
    // Send congratulatory email when lesson is completed (non-blocking)
    if (updatedStats.wasJustCompleted) {
      const streak = updatedStats.currentStreak;
      
      console.log(`🎉 Lesson completed: "${lessonTitle}" - Streak: ${streak} days`);
      
      // Send emails in background (don't await to avoid blocking the response)
      const sendEmailsInBackground = async () => {
        try {
          console.log('Sending lesson completion email...');
          // Send lesson completion email
          const emailTemplate = emailTemplates.lessonCompleted(lessonTitle, streak);
          const emailResult = await sendEmail({
            to: 'hamid.coder.js@gmail.com',
            subject: emailTemplate.subject,
            html: emailTemplate.html,
          });
          
          if (emailResult.success) {
            console.log('✅ Lesson completion email sent successfully!');
          } else {
            console.log('❌ Failed to send lesson completion email:', emailResult.error);
          }
          
          // Send achievement emails for milestones
          if (updatedStats.totalCompleted === 10) {
            console.log('🏆 Achievement: First 10 Lessons Complete!');
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
            console.log('🏆 Achievement: Week-Long Streak Master!');
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
            console.log('🏆 Achievement: Monthly Consistency Champion!');
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
        } catch (error) {
          console.error('Background email error:', error);
        }
      };
      
      // Don't await - let it run in background
      sendEmailsInBackground();
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}

async function updateUserStats(client: any, lessonId: string, wasJustCompleted: boolean) {
  
  // Count completed lessons
  const completedCount = await client.query(
    'SELECT COUNT(*) FROM user_progress WHERE completed_at IS NOT NULL'
  );
  
  // Get completed lesson IDs to calculate total hours using content discovery
  const completedLessons = await client.query(`
    SELECT lesson_id FROM user_progress WHERE completed_at IS NOT NULL
  `);
  
  // Calculate total hours using content discovery
  let totalHours = 0;
  const phases = discoverContent();
  const allLessons = phases.flatMap(phase => phase.lessons);
  
  for (const progress of completedLessons.rows) {
    const lesson = allLessons.find(l => l.id === progress.lesson_id);
    if (lesson) {
      totalHours += lesson.estimated_hours || 2;
    }
  }
  
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
    totalHours,
    currentStreak
  ]);
  
  return {
    wasJustCompleted,
    currentStreak,
    totalCompleted: parseInt(completedCount.rows[0].count),
    totalHours,
  };
}
