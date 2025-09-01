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

      // Extract phase from topic ID (assuming format: "01-topic-name")
      const phaseMatch = topicId.match(/^(\d{2})/);
      let phase = 'phase1'; // default
      
      if (phaseMatch) {
        const num = parseInt(phaseMatch[1]);
        if (num >= 1 && num <= 4) phase = 'phase1';
        else if (num >= 5 && num <= 6) phase = 'phase2'; 
        else if (num >= 9 && num <= 13) phase = 'phase3';
        else if (num >= 14 && num <= 17) phase = 'phase4';
        else if (num >= 18 && num <= 27) phase = 'phase5';
        else if (num >= 28 && num <= 35) phase = 'phase6';
      }

      // Generate title from topic ID
      const title = topicId
        .replace(/^\d{2}-/, '') // remove number prefix
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      return {
        id: topicId,
        title,
        filename: `${topicId}/main.md`, // default to main.md
        phase,
        order_index: parseInt(phaseMatch?.[1] || '99'),
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