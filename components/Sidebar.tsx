'use client'

import { useState } from 'react'
import { ChevronRight, ChevronDown, File, Folder, Search, Filter, BookOpen } from 'lucide-react'

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

interface SidebarProps {
  files: FileItem[]
  selectedFile: string | null
  onFileSelect: (path: string) => void
  progress: Progress
  getProgress: () => { completed: number; total: number; percentage: number }
}

export default function Sidebar({ files, selectedFile, onFileSelect, progress, getProgress }: SidebarProps) {
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState('')

  const toggleDir = (path: string) => {
    const newExpanded = new Set(expandedDirs)
    if (newExpanded.has(path)) {
      newExpanded.delete(path)
    } else {
      newExpanded.add(path)
    }
    setExpandedDirs(newExpanded)
  }

  const buildTree = (files: FileItem[]) => {
    const tree: { [key: string]: FileItem[] } = {}
    const rootFiles: FileItem[] = []

    files.forEach(file => {
      if (searchTerm && !file.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return
      }
      
      const parts = file.path.split('/')
      if (parts.length === 1) {
        rootFiles.push(file)
      } else {
        const parent = parts.slice(0, -1).join('/')
        if (!tree[parent]) tree[parent] = []
        tree[parent].push(file)
      }
    })

    return { tree, rootFiles }
  }

  const getPhaseProgress = (dirPath: string) => {
    const phaseFiles = files.filter(f => f.path.startsWith(dirPath) && f.name.endsWith('.md'))
    const completed = phaseFiles.filter(f => progress[f.path]?.completed).length
    return { completed, total: phaseFiles.length }
  }

  const renderFileTree = (items: FileItem[], level = 0) => {
    return items.map(item => (
      <div key={item.path}>
        {item.isDirectory ? (
          <div>
            <button
              onClick={() => toggleDir(item.path)}
              className="flex items-center justify-between w-full p-3 text-left hover:bg-gray-800 text-gray-300 group"
            >
              <div className="flex items-center gap-3">
                {expandedDirs.has(item.path) ? 
                  <ChevronDown className="w-4 h-4" /> : 
                  <ChevronRight className="w-4 h-4" />
                }
                <span className="font-medium">{item.name}</span>
              </div>
              {(() => {
                const phaseProgress = getPhaseProgress(item.path)
                return phaseProgress.total > 0 ? (
                  <span className="text-sm text-gray-500">
                    {phaseProgress.completed}/{phaseProgress.total}
                  </span>
                ) : null
              })()}
            </button>
            {expandedDirs.has(item.path) && tree[item.path] && 
              <div className="ml-4">
                {renderFileTree(tree[item.path], level + 1)}
              </div>
            }
          </div>
        ) : (
          <button
            onClick={() => onFileSelect(item.path)}
            className={`flex items-center gap-3 w-full p-3 text-left hover:bg-gray-800 transition-colors ${
              selectedFile === item.path ? 'bg-gray-800 border-l-2 border-green-500' : ''
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${
              progress[item.path]?.completed ? 'bg-green-500' : 'bg-gray-600'
            }`}></div>
            <File className="w-4 h-4 text-gray-400" />
            <span className={`text-sm ${
              selectedFile === item.path ? 'text-green-400' : 'text-gray-300'
            }`}>
              {item.name.replace('.md', '')}
            </span>
            {progress[item.path]?.starred && (
              <div className="ml-auto">
                <svg className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            )}
          </button>
        )}
      </div>
    ))
  }

  const { tree, rootFiles } = buildTree(files)
  const totalProgress = getProgress()

  return (
    <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-green-500" />
          <h1 className="text-lg font-semibold text-white">FAANG Interview Prep</h1>
        </div>
        
        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Progress</span>
            <span className="text-gray-300">{totalProgress.completed}/{totalProgress.total} chapters</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${totalProgress.percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-500 focus:border-green-500 focus:outline-none"
          />
          <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {renderFileTree(rootFiles)}
      </div>
    </div>
  )
}