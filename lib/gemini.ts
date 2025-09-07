import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const geminiModel = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 8192,
  },
});

export const geminiProModel = genAI.getGenerativeModel({ 
  model: "gemini-1.5-pro",
  generationConfig: {
    temperature: 0.8,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 8192,
  },
});

// AI Prompt Templates for FAANG Interview Prep
export const AI_PROMPTS = {
  CODE_REVIEW: `You are a senior software engineer at a FAANG company. Review this code and provide:
1. Code quality assessment (1-10 scale)
2. Time/space complexity analysis
3. Optimization suggestions
4. Interview-level feedback
5. Real-world improvements

Code to review:`,

  INTERVIEW_COACH: `You are an experienced FAANG technical interviewer. Based on the user's progress and current topic, provide:
1. Personalized study recommendations
2. Next best problems to solve
3. Weak areas to focus on
4. Interview tips specific to their level
5. Motivation and encouragement

User context:`,

  PROBLEM_HINT: `You are a helpful coding mentor. The user is stuck on this problem. Provide a subtle hint without giving away the solution:
1. Guide them toward the right approach
2. Suggest the pattern/technique to use
3. Give a small example if needed
4. Encourage independent thinking

Problem:`,

  EXPLANATION_GENERATOR: `Explain this algorithm/concept in simple terms for someone preparing for FAANG interviews:
1. What it does and why it's important
2. Step-by-step breakdown
3. Common interview variations
4. Time/space complexity
5. When to use it in interviews

Topic:`,

  MOTIVATION_COACH: `You are a motivational coach for FAANG interview preparation. Based on the user's progress, provide:
1. Encouraging message about their journey
2. Specific achievements to celebrate
3. Next milestone to work toward
4. Success story or inspiration
5. Actionable next steps

User stats:`,
} as const;

// AI Helper Functions
export async function generateCodeReview(code: string) {
  const prompt = `${AI_PROMPTS.CODE_REVIEW}\n\n${code}`;
  const result = await geminiModel.generateContent(prompt);
  return result.response.text();
}

export async function generateHint(problem: string, userAttempt?: string) {
  const prompt = `${AI_PROMPTS.PROBLEM_HINT}\n\nProblem: ${problem}\n\nUser's attempt: ${userAttempt || 'None yet'}`;
  const result = await geminiModel.generateContent(prompt);
  return result.response.text();
}

export async function generatePersonalizedFeedback(userStats: any, currentTopic: string) {
  const context = `
Current topic: ${currentTopic}
Progress: ${userStats.total_lessons_completed || 0} lessons completed
Streak: ${userStats.current_streak || 0} days
Hours studied: ${userStats.total_hours_studied || 0}
  `;
  
  const prompt = `${AI_PROMPTS.INTERVIEW_COACH}\n\n${context}`;
  const result = await geminiProModel.generateContent(prompt);
  return result.response.text();
}

export async function generateMotivationalMessage(userStats: any) {
  const stats = JSON.stringify(userStats);
  const prompt = `${AI_PROMPTS.MOTIVATION_COACH}\n\n${stats}`;
  const result = await geminiModel.generateContent(prompt);
  return result.response.text();
}

export async function explainConcept(concept: string) {
  const prompt = `${AI_PROMPTS.EXPLANATION_GENERATOR}\n\n${concept}`;
  const result = await geminiProModel.generateContent(prompt);
  return result.response.text();
}

// Chat completion for general AI assistant
export async function getChatCompletion(messages: Array<{role: string, content: string}>) {
  const conversation = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
  const prompt = `You are an expert FAANG interview preparation assistant. Help the user with their technical interview preparation. Be encouraging, precise, and practical.\n\nConversation:\n${conversation}\n\nAssistant:`;
  
  const result = await geminiModel.generateContent(prompt);
  return result.response.text();
}