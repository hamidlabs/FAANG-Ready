import { NextResponse } from 'next/server'
import { readdir, stat } from 'fs/promises'
import { join } from 'path'

async function getFiles(dir: string, basePath = ''): Promise<Array<{path: string, name: string, isDirectory: boolean}>> {
  const files: Array<{path: string, name: string, isDirectory: boolean}> = []
  
  try {
    const items = await readdir(dir)
    
    for (const item of items) {
      if (item.startsWith('.')) continue // Skip hidden files
      
      const fullPath = join(dir, item)
      const relativePath = basePath ? `${basePath}/${item}` : item
      const stats = await stat(fullPath)
      
      if (stats.isDirectory()) {
        files.push({ path: relativePath, name: item, isDirectory: true })
        const subFiles = await getFiles(fullPath, relativePath)
        files.push(...subFiles)
      } else if (item.endsWith('.md')) {
        files.push({ path: relativePath, name: item, isDirectory: false })
      }
    }
  } catch (error) {
    console.error('Error reading directory:', error)
  }
  
  return files
}

export async function GET() {
  try {
    const contentDir = join(process.cwd(), 'content')
    const files = await getFiles(contentDir)
    
    return NextResponse.json({ files })
  } catch (error) {
    console.error('Error in files API:', error)
    return NextResponse.json({ files: [] })
  }
}
