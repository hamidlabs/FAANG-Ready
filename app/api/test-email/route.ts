import { NextResponse } from 'next/server';
import { sendEmail, emailTemplates } from '@/lib/email';

export async function GET() {
  try {
    // Test lesson completion email
    const lessonTemplate = emailTemplates.lessonCompleted('System Design Fundamentals', 5);
    const result = await sendEmail({
      to: 'hamid.coder.js@gmail.com',
      subject: lessonTemplate.subject,
      html: lessonTemplate.html,
    });

    if (result.success) {
      return NextResponse.json({ 
        message: 'Test email sent successfully!',
        messageId: result.messageId 
      });
    } else {
      return NextResponse.json({ 
        error: 'Failed to send test email',
        details: result.error 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json({ error: 'Failed to send test email' }, { status: 500 });
  }
}