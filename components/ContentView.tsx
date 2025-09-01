'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Star, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Topic, Phase } from '@/lib/types';
import { fetchTopicContent, fetchTopicFiles } from '@/lib/content';

interface ContentViewProps {
  topic: Topic;
  isCompleted: boolean;
  isStarred: boolean;
  onToggleComplete: () => void;
  onToggleStar: () => void;
  phases: Phase[];
  onTopicSelect: (topic: Topic) => void;
}

export default function ContentView({
  topic,
  isCompleted,
  isStarred,
  onToggleComplete,
  onToggleStar,
  phases,
  onTopicSelect
}: ContentViewProps) {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [availableFiles, setAvailableFiles] = useState<Array<{name: string, title: string}>>([]);
  const [currentFile, setCurrentFile] = useState<string>('main.md');

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      try {
        // Load available files for this topic
        const files = await fetchTopicFiles(topic.id);
        setAvailableFiles(files);
        
        // Load content for current file
        const topicContent = await fetchTopicContent(topic.id, currentFile);
        setContent(topicContent);
      } catch (error) {
        console.error('Error loading content:', error);
        setContent('# Error Loading Content\n\nCould not load the content for this topic.');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [topic.id, currentFile]);

  // Get next and previous topics
  const getNavigationTopics = () => {
    const allTopics: Topic[] = [];
    phases.forEach(phase => {
      allTopics.push(...phase.topics);
    });

    const currentIndex = allTopics.findIndex(t => t.id === topic.id);
    const prevTopic = currentIndex > 0 ? allTopics[currentIndex - 1] : null;
    const nextTopic = currentIndex < allTopics.length - 1 ? allTopics[currentIndex + 1] : null;

    return { prevTopic, nextTopic };
  };

  const { prevTopic, nextTopic } = getNavigationTopics();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">Loading content...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-dark-300 bg-dark-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">{topic.title}</h1>
            <p className="text-gray-400 text-sm">
              {phases.find(p => p.id === topic.phase)?.title}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Actions */}
            <Button
              onClick={onToggleComplete}
              className={`flex items-center gap-2 transition-colors ${
                isCompleted
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-dark-300 text-gray-300 hover:bg-dark-400 hover:text-white'
              }`}
            >
              <CheckCircle className={`w-5 h-5 ${
                isCompleted ? 'fill-current' : ''
              }`} />
              {isCompleted ? 'Completed' : 'Mark as Complete'}
            </Button>

            <Button
              size="icon"
              onClick={onToggleStar}
              className={`transition-colors ${
                isStarred
                  ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                  : 'bg-dark-300 text-gray-400 hover:bg-dark-400 hover:text-yellow-400'
              }`}
            >
              <Star className={`w-5 h-5 ${
                isStarred ? 'fill-current' : ''
              }`} />
            </Button>
          </div>
        </div>
        
        {/* File selector */}
        {availableFiles.length > 1 && (
          <div className="flex gap-2 flex-wrap">
            {availableFiles.map((file) => (
              <Button
                key={file.name}
                variant={currentFile === file.name ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentFile(file.name)}
                className={`text-xs ${
                  currentFile === file.name 
                    ? 'bg-green-600 text-white' 
                    : 'bg-dark-300 text-gray-300 border-dark-400 hover:bg-dark-400 hover:text-white'
                }`}
              >
                {file.title}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="markdown prose prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t border-dark-300 bg-dark-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            {prevTopic && (
              <Button
                variant="ghost"
                onClick={() => onTopicSelect(prevTopic)}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors h-auto p-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <div className="text-left">
                  <div className="text-xs text-gray-500">Previous</div>
                  <div className="text-sm">{prevTopic.title}</div>
                </div>
              </Button>
            )}
          </div>

          <div>
            {nextTopic && (
              <Button
                variant="ghost"
                onClick={() => onTopicSelect(nextTopic)}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors h-auto p-2"
              >
                <div className="text-right">
                  <div className="text-xs text-gray-500">Next</div>
                  <div className="text-sm">{nextTopic.title}</div>
                </div>
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}