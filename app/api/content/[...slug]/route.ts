import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  try {
    const { slug } = params;
    
    if (!slug || slug.length === 0) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    // Join the slug to create the topic path
    const topicId = slug[0];
    const fileName = slug[1] || 'main.md';
    
    const contentDir = path.join(process.cwd(), 'content', topicId);
    const filePath = path.join(contentDir, fileName);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: `File not found: ${fileName}` }, 
        { status: 404 }
      );
    }

    // Read the file content
    const content = fs.readFileSync(filePath, 'utf-8');
    
    return NextResponse.json({
      content,
      fileName,
      topicId
    });
    
  } catch (error) {
    console.error('Error reading content:', error);
    return NextResponse.json(
      { error: 'Failed to read content' }, 
      { status: 500 }
    );
  }
}

// Get list of files for a topic
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  try {
    const { slug } = params;
    
    if (!slug || slug.length === 0) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    const topicId = slug[0];
    
    if (slug.length === 1 && slug[0] === 'list-files') {
      // List all files for a topic
      const body = await request.json();
      const { topicId: requestTopicId } = body;
      
      const contentDir = path.join(process.cwd(), 'content', requestTopicId);
      
      if (!fs.existsSync(contentDir)) {
        return NextResponse.json({ files: [] });
      }

      const files = fs.readdirSync(contentDir)
        .filter(file => file.endsWith('.md'))
        .map(file => ({
          name: file,
          title: file.replace('.md', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        }));

      return NextResponse.json({ files });
    }
    
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    
  } catch (error) {
    console.error('Error listing files:', error);
    return NextResponse.json(
      { error: 'Failed to list files' }, 
      { status: 500 }
    );
  }
}