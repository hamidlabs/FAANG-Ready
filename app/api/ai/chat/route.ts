import { NextRequest, NextResponse } from 'next/server';
import { getChatCompletion, generatePersonalizedFeedback, generateHint } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, type = 'chat', context } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    let response: string;

    switch (type) {
      case 'hint':
        if (!context?.problem) {
          return NextResponse.json({ error: 'Problem context required for hints' }, { status: 400 });
        }
        response = await generateHint(context.problem, context.userAttempt);
        break;
      
      case 'feedback':
        if (!context?.userStats || !context?.currentTopic) {
          return NextResponse.json({ error: 'User stats and current topic required for feedback' }, { status: 400 });
        }
        response = await generatePersonalizedFeedback(context.userStats, context.currentTopic);
        break;
      
      case 'chat':
      default:
        response = await getChatCompletion(messages);
        break;
    }

    return NextResponse.json({ 
      message: response,
      timestamp: Date.now(),
    });

  } catch (error) {
    console.error('AI Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 }
    );
  }
}