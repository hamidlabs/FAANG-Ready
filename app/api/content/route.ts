import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');
    
    if (!filePath) {
      return NextResponse.json({ error: 'File path required' }, { status: 400 });
    }
    
    // Try main.md first (most common structure)
    let fullPath = path.join(process.cwd(), 'content', filePath.replace('/main.md', ''), 'main.md');
    
    try {
      const content = await readFile(fullPath, 'utf-8');
      return new NextResponse(content, {
        headers: { 'Content-Type': 'text/plain' }
      });
    } catch (fileError) {
      // If main.md doesn't exist, try the direct path
      fullPath = path.join(process.cwd(), 'content', filePath);
      
      try {
        const content = await readFile(fullPath, 'utf-8');
        return new NextResponse(content, {
          headers: { 'Content-Type': 'text/plain' }
        });
      } catch (directError) {
        console.error('File read error:', directError);
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
      }
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}
