'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import ContentView from '@/components/ContentView'

interface FileItem {
  path: string
  name: string
  isDirectory: boolean
}

interface Progress {
  [key: string]: {
    completed: boolean
    starred: boolean
  }
}

export default function Home() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [progress, setProgress] = useState<Progress>({})

  useEffect(() => {
    fetch('/api/files')
      .then(res => res.json())
      .then(data => {
        setFiles(data.files || [])
        if (data.files?.length > 0) {
          const firstMdFile = data.files.find((f: FileItem) => f.name.endsWith('.md'))
          if (firstMdFile) setSelectedFile(firstMdFile.path)
        }
      })
  }, [])

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('faang-prep-progress')
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress))
    }
  }, [])

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('faang-prep-progress', JSON.stringify(progress))
  }, [progress])

  const toggleComplete = (filePath: string) => {
    setProgress(prev => ({
      ...prev,
      [filePath]: {
        ...prev[filePath],
        completed: !prev[filePath]?.completed
      }
    }))
  }

  const toggleStar = (filePath: string) => {
    setProgress(prev => ({
      ...prev,
      [filePath]: {
        ...prev[filePath],
        starred: !prev[filePath]?.starred
      }
    }))
  }

  const getProgress = () => {
    const mdFiles = files.filter(f => f.name.endsWith('.md'))
    const completed = mdFiles.filter(f => progress[f.path]?.completed).length
    return {
      completed,
      total: mdFiles.length,
      percentage: mdFiles.length > 0 ? Math.round((completed / mdFiles.length) * 100) : 0
    }
  }

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar 
        files={files}
        selectedFile={selectedFile}
        onFileSelect={setSelectedFile}
        progress={progress}
        getProgress={getProgress}
      />
      <ContentView 
        selectedFile={selectedFile}
        isCompleted={progress[selectedFile || '']?.completed || false}
        isStarred={progress[selectedFile || '']?.starred || false}
        onToggleComplete={() => selectedFile && toggleComplete(selectedFile)}
        onToggleStar={() => selectedFile && toggleStar(selectedFile)}
      />
    </div>
  )
}
