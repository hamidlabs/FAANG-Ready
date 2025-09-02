'use client'

import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CheckCircle, Star, ArrowRight } from 'lucide-react'

interface ContentViewProps {
  selectedFile: string | null
  isCompleted: boolean
  isStarred: boolean
  onToggleComplete: () => void
  onToggleStar: () => void
}

export default function ContentView({ 
  selectedFile, 
  isCompleted, 
  isStarred, 
  onToggleComplete, 
  onToggleStar 
}: ContentViewProps) {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!selectedFile) {
      setContent(`# Welcome to FAANG Interview Prep

Select a file from the sidebar to view its content.

## 🎯 Your Complete FAANG Success System

This comprehensive preparation system covers:

### Phase 1: English Communication Foundation
- Technical English sentence building
- Interview conversation scripts  
- Code explanation frameworks
- Behavioral answer templates

### Phase 2: Problem-Solving Mental Framework
- Universal problem-solving methods
- Pattern recognition guides
- Debugging and testing frameworks

### Phase 3-8: Complete Technical Mastery
- Core data structures and algorithms
- Advanced patterns and techniques
- System design mastery
- Low-level design patterns

**Every file contains:**
- ✅ Real FAANG interview questions
- 🔗 Direct LeetCode practice links
- 📚 Company-specific variations
- 🎯 Success stories and strategies

Start by selecting any topic from the sidebar to begin your journey!`)
      return
    }

    setLoading(true)
    fetch(`/api/content?file=${encodeURIComponent(selectedFile)}`)
      .then(res => res.json())
      .then(data => {
        setContent(data.content || '# Error\n\nCould not load file content.')
      })
      .catch(() => {
        setContent('# Error\n\nFailed to load file.')
      })
      .finally(() => setLoading(false))
  }, [selectedFile])

  const getFileName = (path: string | null) => {
    if (!path) return 'Welcome'
    return path.split('/').pop()?.replace('.md', '') || 'Unknown'
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-gray-900 flex flex-col">
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            className="prose prose-invert prose-lg max-w-none"
            components={{
              h1: ({children}) => <h1 className="text-4xl font-bold mb-8 text-white">{children}</h1>,
              h2: ({children}) => <h2 className="text-2xl font-semibold mb-6 mt-8 text-white border-b border-gray-700 pb-3">{children}</h2>,
              h3: ({children}) => <h3 className="text-xl font-semibold mb-4 mt-6 text-white">{children}</h3>,
              h4: ({children}) => <h4 className="text-lg font-semibold mb-3 mt-5 text-white">{children}</h4>,
              p: ({children}) => <p className="mb-6 text-gray-300 leading-relaxed text-lg">{children}</p>,
              ul: ({children}) => <ul className="mb-6 ml-6 space-y-3">{children}</ul>,
              ol: ({children}) => <ol className="mb-6 ml-6 space-y-3">{children}</ol>,
              li: ({children}) => <li className="text-gray-300 text-lg">{children}</li>,
              code: ({inline, children, ...props}: any) => 
                inline ? 
                  <code className="bg-gray-800 px-2 py-1 rounded text-green-400 text-base font-mono">{children}</code> :
                  <code className="text-gray-300">{children}</code>,
              pre: ({children}) => <pre className="bg-gray-800 p-6 rounded-lg overflow-x-auto mb-6 border border-gray-700">{children}</pre>,
              blockquote: ({children}) => <blockquote className="border-l-4 border-blue-500 pl-6 italic text-gray-400 mb-6 bg-gray-800/30 py-4 rounded-r-lg">{children}</blockquote>,
              table: ({children}) => <table className="w-full border-collapse mb-6 border border-gray-700 rounded-lg overflow-hidden">{children}</table>,
              th: ({children}) => <th className="border border-gray-700 px-4 py-3 text-left bg-gray-800 font-semibold text-white">{children}</th>,
              td: ({children}) => <td className="border border-gray-700 px-4 py-3 text-gray-300">{children}</td>,
              a: ({children, href}) => <a href={href} className="text-blue-400 hover:text-blue-300 underline font-medium">{children}</a>,
              strong: ({children}) => <strong className="font-semibold text-white">{children}</strong>,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>

      {/* Bottom Action Bar */}
      {selectedFile && (
        <div className="border-t border-gray-700 bg-gray-800 px-8 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onToggleComplete}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isCompleted
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <CheckCircle className={`w-5 h-5 ${isCompleted ? 'fill-current' : ''}`} />
                {isCompleted ? 'Completed' : 'Mark as Complete'}
              </button>

              <button
                onClick={onToggleStar}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isStarred
                    ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Star className={`w-5 h-5 ${isStarred ? 'fill-current' : ''}`} />
                {isStarred ? 'Starred' : 'Star'}
              </button>
            </div>

            <div className="flex items-center gap-2 text-gray-400">
              <span>Next:</span>
              <span className="text-gray-300">Continue Learning</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}