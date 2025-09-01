import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const contentDir = path.join(process.cwd(), 'content');
    
    // Check if content directory exists
    if (!fs.existsSync(contentDir)) {
      return NextResponse.json({ topics: [] });
    }

    // Get all topic directories
    const topicDirs = fs.readdirSync(contentDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    // Process each topic directory
    const topics = topicDirs.map(topicId => {
      const topicDir = path.join(contentDir, topicId);
      const files = fs.readdirSync(topicDir)
        .filter(file => file.endsWith('.md'))
        .map(file => ({
          name: file,
          title: file.replace('.md', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        }));

      const title = topicId
        .replace(/^(\d{2}-)/, '')
        .replace(/-/g, ' ')
        .replace(/(\b\w)/g, k => k.toUpperCase());

      return {
        id: topicId,
        title: title,
        filename: `${topicId}/main.md`, // default to main.md
        phase: topicId,
        order_index: parseInt(topicId.match(/^(\d{2})/)?.[1] || '99'),
        completed: false,
        starred: false,
        files
      };
    });

    // Sort by order_index
    topics.sort((a, b) => a.order_index - b.order_index);

    return NextResponse.json({ topics });
    
  } catch (error) {
    console.error('Error discovering topics:', error);
    return NextResponse.json(
      { error: 'Failed to discover topics' }, 
      { status: 500 }
    );
  }
}