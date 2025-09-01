import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const file = searchParams.get('file')
    
    if (!file) {
      return NextResponse.json({ error: 'File parameter required' }, { status: 400 })
    }
    
    const contentDir = join(process.cwd(), 'content')
    const filePath = join(contentDir, file)
    
    // Security check - ensure file is within content directory
    if (!filePath.startsWith(contentDir)) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 400 })
    }
    
    const content = await readFile(filePath, 'utf-8')
    
    return NextResponse.json({ content })
  } catch (error) {
    console.error('Error reading file:', error)
    return NextResponse.json({ content: '# Error\n\nCould not load file content.' })
  }
}
