import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { getLessonById } from '@/lib/content-discovery';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');
    const lessonId = searchParams.get('lessonId');
    
    let fullPath: string;
    
    if (lessonId) {
      // Use content discovery to get lesson file path
      const lesson = getLessonById(lessonId);
      if (!lesson) {
        return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
      }
      fullPath = path.join(process.cwd(), 'content', lesson.file_path);
    } else if (filePath) {
      // Legacy path-based lookup (for backwards compatibility)
      // Try main.md first (most common structure)
      fullPath = path.join(process.cwd(), 'content', filePath.replace('/main.md', ''), 'main.md');
      
      try {
        const content = await readFile(fullPath, 'utf-8');
        return new NextResponse(content, {
          headers: { 'Content-Type': 'text/plain' }
        });
      } catch (fileError) {
        // If main.md doesn't exist, try the direct path
        fullPath = path.join(process.cwd(), 'content', filePath);
      }
    } else {
      return NextResponse.json({ error: 'File path or lesson ID required' }, { status: 400 });
    }
    
    try {
      const content = await readFile(fullPath, 'utf-8');
      return new NextResponse(content, {
        headers: { 'Content-Type': 'text/plain' }
      });
    } catch (error) {
      console.error('File read error:', error);
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}
