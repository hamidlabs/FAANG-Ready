export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY || '',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: "FAANG Prep Platform",
          email: "noreply@faangprep.com"
        },
        to: [{
          email: to,
          name: "FAANG Student"
        }],
        subject: subject,
        htmlContent: html
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Email sent via Brevo API:', result.messageId);
      return { success: true, messageId: result.messageId };
    } else {
      const errorData = await response.text();
      console.error('Brevo API error:', response.status, errorData);
      return { success: false, error: `HTTP ${response.status}: ${errorData}` };
    }
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error };
  }
}

export const emailTemplates = {
  lessonCompleted: (lessonTitle: string, streak: number) => ({
    subject: `🎉 Lesson Complete: ${lessonTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Lesson Completed!</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin: 0 0 20px 0;">Great work on completing:</h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #667eea; margin: 0; font-size: 20px;">${lessonTitle}</h3>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="display: inline-block; background: #10b981; color: white; padding: 15px 25px; border-radius: 25px; font-weight: bold;">
              🔥 ${streak} Day Streak!
            </div>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin: 20px 0;">
            You're building incredible momentum! Each lesson brings you closer to acing those FAANG interviews. 
            Keep the streak alive - your future self will thank you! 💪
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" 
               style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Continue Learning →
            </a>
          </div>
        </div>
      </div>
    `,
  }),

  streakReminder: (streak: number, name: string = 'Champion') => ({
    subject: `🔥 Don't break your ${streak}-day streak!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🔥 Streak Alert!</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin: 0 0 20px 0;">Hey ${name}!</h2>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="font-size: 48px; margin: 20px 0;">🔥</div>
            <div style="font-size: 36px; font-weight: bold; color: #f5576c; margin: 10px 0;">
              ${streak} DAYS
            </div>
            <p style="color: #666; font-size: 18px; margin: 0;">Current Streak</p>
          </div>
          
          <p style="color: #666; line-height: 1.6; text-align: center; margin: 30px 0; font-size: 18px;">
            You're on fire! 🚀 Don't let this amazing ${streak}-day streak slip away. 
            Just one lesson today keeps the momentum going!
          </p>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #856404; text-align: center;">
              ⏰ Complete a lesson in the next 12 hours to maintain your streak!
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" 
               style="background: #f5576c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Keep the Streak Alive! →
            </a>
          </div>
        </div>
      </div>
    `,
  }),

  weeklyProgress: (completedLessons: number, totalHours: number, streak: number) => ({
    subject: `📊 Your Weekly FAANG Prep Progress`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">📊 Weekly Progress Report</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin: 0 0 30px 0; text-align: center;">Amazing progress this week!</h2>
          
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 30px 0;">
            <div style="text-align: center; padding: 20px; background: #f0f9ff; border-radius: 10px;">
              <div style="font-size: 32px; font-weight: bold; color: #0ea5e9; margin-bottom: 10px;">
                ${completedLessons}
              </div>
              <div style="color: #666; font-size: 14px;">Lessons Completed</div>
            </div>
            
            <div style="text-align: center; padding: 20px; background: #f0fdf4; border-radius: 10px;">
              <div style="font-size: 32px; font-weight: bold; color: #10b981; margin-bottom: 10px;">
                ${totalHours}h
              </div>
              <div style="color: #666; font-size: 14px;">Study Time</div>
            </div>
            
            <div style="text-align: center; padding: 20px; background: #fff7ed; border-radius: 10px;">
              <div style="font-size: 32px; font-weight: bold; color: #ea580c; margin-bottom: 10px;">
                ${streak}
              </div>
              <div style="color: #666; font-size: 14px;">Day Streak</div>
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 30px 0; text-align: center;">
            <h3 style="color: #333; margin: 0 0 15px 0;">🎯 You're Interview Ready!</h3>
            <p style="color: #666; margin: 0; line-height: 1.6;">
              Keep this momentum going! You're building the skills that top tech companies are looking for.
              Every lesson completed is a step closer to your dream job at FAANG! 🚀
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" 
               style="background: #4facfe; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Continue Your Journey →
            </a>
          </div>
        </div>
      </div>
    `,
  }),

  congratulationsEmail: (achievement: string, message: string) => ({
    subject: `🏆 Achievement Unlocked: ${achievement}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #8b4513; margin: 0; font-size: 28px;">🏆 Achievement Unlocked!</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin: 30px 0;">
            <div style="font-size: 64px; margin: 20px 0;">🏆</div>
            <h2 style="color: #fcb69f; margin: 10px 0; font-size: 24px;">${achievement}</h2>
          </div>
          
          <div style="background: #fff9e6; border-left: 4px solid #fcb69f; padding: 20px; margin: 30px 0;">
            <p style="color: #8b4513; margin: 0; line-height: 1.6; font-size: 16px;">
              ${message}
            </p>
          </div>
          
          <p style="color: #666; line-height: 1.6; text-align: center; margin: 30px 0;">
            You're proving that consistency and dedication pay off! 
            Keep pushing forward - FAANG companies love candidates who show this level of commitment! 💪
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" 
               style="background: #fcb69f; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Celebrate & Continue! →
            </a>
          </div>
        </div>
      </div>
    `,
  }),
};