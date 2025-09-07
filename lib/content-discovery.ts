import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface ContentFile {
  id: string;
  title: string;
  description?: string;
  estimated_hours?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  order_index: number;
  file_path: string;
  full_path: string;
  phase_id: string;
  phase_name: string;
  week_start?: number;
  week_end?: number;
}

export interface Phase {
  id: string;
  name: string;
  description: string;
  week_start: number;
  week_end: number;
  lessons: ContentFile[];
  completed: number;
  total: number;
}

// Extract metadata from filename and directory structure
function parseContentPath(filePath: string): {
  phaseId: string;
  phaseName: string;
  lessonOrder: number;
  weekStart?: number;
  weekEnd?: number;
} {
  const parts = filePath.split(path.sep);
  const phaseDir = parts[0];
  const lessonDir = parts[1];

  // Extract phase information from directory name
  // Example: "Phase 1 - English Communication Foundation"
  const phaseMatch = phaseDir.match(/Phase (\d+)\s*-\s*(.+)/);
  const phaseNumber = phaseMatch ? parseInt(phaseMatch[1]) : 1;
  const phaseName = phaseMatch ? phaseMatch[2].trim() : phaseDir;

  // Extract lesson order from directory name  
  // Example: "01-technical-english-sentence-builder"
  const lessonMatch = lessonDir?.match(/^(\d+)-/);
  const lessonOrder = lessonMatch ? parseInt(lessonMatch[1]) : 1;

  // Define week ranges for each phase (this could be moved to frontmatter later)
  const weekRanges: Record<number, [number, number]> = {
    1: [1, 4],
    2: [5, 8], 
    3: [9, 16],
    4: [17, 24],
    5: [25, 36],
    6: [37, 44],
    7: [45, 52],
    8: [53, 56],
  };

  const [weekStart, weekEnd] = weekRanges[phaseNumber] || [1, 4];

  return {
    phaseId: `phase-${phaseNumber}`,
    phaseName,
    lessonOrder,
    weekStart,
    weekEnd,
  };
}

// Generate title from filename if not provided in frontmatter
function generateTitle(filename: string, dirName: string): string {
  // Try to extract from directory name first
  const dirMatch = dirName.match(/^\d+-(.+)/);
  if (dirMatch) {
    return dirMatch[1]
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Fallback to filename
  return filename
    .replace('.md', '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Scan content directory and build content structure
export function discoverContent(contentDir: string = 'content'): Phase[] {
  const contentPath = path.join(process.cwd(), contentDir);
  
  if (!fs.existsSync(contentPath)) {
    console.warn(`Content directory not found: ${contentPath}`);
    return [];
  }

  const allContent: ContentFile[] = [];
  const phases: Map<string, Phase> = new Map();

  // Get all markdown files in a lesson directory
  function getAllMarkdownFiles(lessonDir: string): string[] {
    const items = fs.readdirSync(lessonDir, { withFileTypes: true });
    const markdownFiles = items
      .filter(item => item.isFile() && item.name.endsWith('.md'))
      .map(item => item.name)
      .sort();
    
    return markdownFiles;
  }

  // Generate lesson title based on filename
  function generateLessonTitle(filename: string, baseLessonName: string): string {
    // Remove .md extension
    const nameWithoutExt = filename.replace('.md', '');
    
    // If it's main.md, just use the base lesson name
    if (nameWithoutExt === 'main') {
      return baseLessonName;
    }
    
    // For other files, append the type
    const fileType = nameWithoutExt
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return `${baseLessonName} - ${fileType}`;
  }

  // Scan phase directories
  function scanPhases(contentPath: string) {
    const phaseItems = fs.readdirSync(contentPath, { withFileTypes: true });
    
    for (const phaseItem of phaseItems) {
      if (!phaseItem.isDirectory()) continue;
      
      const phasePath = path.join(contentPath, phaseItem.name);
      const lessonItems = fs.readdirSync(phasePath, { withFileTypes: true });
      
      for (const lessonItem of lessonItems) {
        if (!lessonItem.isDirectory()) continue;
        
        const lessonDir = path.join(phasePath, lessonItem.name);
        const markdownFiles = getAllMarkdownFiles(lessonDir);
        
        if (markdownFiles.length === 0) continue;
        
        // Get base lesson name from directory
        const baseLessonName = generateTitle('', lessonItem.name);
        
        // Process each markdown file in the lesson directory
        for (const markdownFile of markdownFiles) {
          try {
            const filePath = path.join(lessonDir, markdownFile);
            const relativeFilePath = path.join(phaseItem.name, lessonItem.name, markdownFile);
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const { data: frontmatter } = matter(fileContent);
            
            const pathInfo = parseContentPath(relativeFilePath);
            
            // Generate unique ID from full file path (no truncation for uniqueness)
            const id = Buffer.from(relativeFilePath).toString('base64').replace(/[^a-zA-Z0-9]/g, '');
            
            const contentFile: ContentFile = {
              id,
              title: frontmatter.title || generateLessonTitle(markdownFile, baseLessonName),
              description: frontmatter.description,
              estimated_hours: frontmatter.estimated_hours || frontmatter.estimatedHours || 2,
              difficulty: frontmatter.difficulty || 'medium',
              order_index: frontmatter.order || pathInfo.lessonOrder,
              file_path: relativeFilePath,
              full_path: filePath,
              phase_id: pathInfo.phaseId,
              phase_name: pathInfo.phaseName,
              week_start: pathInfo.weekStart,
              week_end: pathInfo.weekEnd,
            };

            allContent.push(contentFile);

            // Create or update phase
            if (!phases.has(pathInfo.phaseId)) {
              phases.set(pathInfo.phaseId, {
                id: pathInfo.phaseId,
                name: pathInfo.phaseName,
                description: `Master ${pathInfo.phaseName.toLowerCase()} for FAANG interviews`,
                week_start: pathInfo.weekStart!,
                week_end: pathInfo.weekEnd!,
                lessons: [],
                completed: 0,
                total: 0,
              });
            }
          } catch (error) {
            console.error(`Error processing file ${markdownFile} in lesson ${lessonItem.name}:`, error);
          }
        }
      }
    }
  }

  scanPhases(contentPath);

  // Group lessons by phase and sort them
  allContent.forEach(lesson => {
    const phase = phases.get(lesson.phase_id);
    if (phase) {
      phase.lessons.push(lesson);
    }
  });

  // Sort lessons within each phase and calculate totals
  const result: Phase[] = Array.from(phases.values()).map(phase => {
    phase.lessons.sort((a, b) => a.order_index - b.order_index);
    phase.total = phase.lessons.length;
    return phase;
  });

  // Sort phases by phase number
  result.sort((a, b) => {
    const aNum = parseInt(a.id.split('-')[1]);
    const bNum = parseInt(b.id.split('-')[1]);
    return aNum - bNum;
  });

  return result;
}

// Get a specific lesson by ID
export function getLessonById(lessonId: string, contentDir: string = 'content'): ContentFile | null {
  const phases = discoverContent(contentDir);
  
  for (const phase of phases) {
    const lesson = phase.lessons.find(l => l.id === lessonId);
    if (lesson) {
      return lesson;
    }
  }
  
  return null;
}

// Get lesson content
export function getLessonContent(lesson: ContentFile): string {
  try {
    return fs.readFileSync(lesson.full_path, 'utf-8');
  } catch (error) {
    console.error(`Error reading lesson content:`, error);
    return '';
  }
}

// Search for lessons
export function searchContent(query: string, contentDir: string = 'content'): ContentFile[] {
  const phases = discoverContent(contentDir);
  const allLessons = phases.flatMap(phase => phase.lessons);
  
  const lowercaseQuery = query.toLowerCase();
  
  return allLessons.filter(lesson => 
    lesson.title.toLowerCase().includes(lowercaseQuery) ||
    lesson.description?.toLowerCase().includes(lowercaseQuery) ||
    lesson.phase_name.toLowerCase().includes(lowercaseQuery)
  );
}