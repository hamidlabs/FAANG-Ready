'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, BookOpen, CheckCircle2, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import ContentWithNotesImproved from '@/components/ContentWithNotesImproved';

// Import highlight.js CSS for syntax highlighting
import 'highlight.js/styles/github-dark.css';

interface Lesson {
  id: number;
  title: string;
  estimated_hours: number;
  difficulty: string;
  completed: boolean;
  phase_name: string;
}

export default function LessonPage({ params }: { params: { id: string } }) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchLesson();
  }, [params.id]);

  const fetchLesson = async () => {
    try {
      const response = await fetch(`/api/lesson/${params.id}`);
      const lessonData = await response.json();

      setLesson(lessonData);

      // Fetch markdown content using lesson ID
      const contentResponse = await fetch(`/api/content?lessonId=${params.id}`);
      const contentData = await contentResponse.text();
      setContent(contentData);
    } catch (error) {
      console.error('Error fetching lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCompletion = async () => {
    if (!lesson) return;

    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId: lesson.id })
      });

      if (response.ok) {
        setLesson({ ...lesson, completed: !lesson.completed });
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-2xl font-bold text-indigo-600">Loading lesson...</div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-2xl font-bold text-red-600">Lesson not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => router.back()} className="bg-slate-700 hover:bg-slate-600 border-slate-600 text-white shrink-0">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Back to Dashboard</span>
            <span className="sm:hidden">Back</span>
          </Button>

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-white break-words">{lesson.title}</h1>
            <p className="text-blue-200 text-sm sm:text-base">{lesson.phase_name}</p>
          </div>

          <Button
            onClick={toggleCompletion}
            variant={lesson.completed ? "default" : "outline"}
            className={`shrink-0 w-full sm:w-auto ${lesson.completed ? "bg-emerald-600 hover:bg-emerald-700 border-0" : "bg-slate-700 hover:bg-slate-600 border-slate-600 text-white"}`}
          >
            {lesson.completed ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Completed</span>
                <span className="sm:hidden">✓ Done</span>
              </>
            ) : (
              <>
                <BookOpen className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Mark Complete</span>
                <span className="sm:hidden">Complete</span>
              </>
            )}
          </Button>
        </div>

        {/* Lesson Info */}
        <Card className="mb-6 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <Badge variant="outline" className={`${getDifficultyColor(lesson.difficulty)} text-white border-0`}>
                {lesson.difficulty}
              </Badge>
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="h-4 w-4" />
                <span className="text-sm sm:text-base">{lesson.estimated_hours}h estimated</span>
              </div>
              {lesson.completed && (
                <Badge className="bg-emerald-600 border-0">
                  ✅ Completed
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Content with Notes */}
        <Card className="bg-slate-800/70 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <div className="prose prose-sm sm:prose-base lg:prose-lg prose-invert max-w-none
                          prose-headings:text-blue-200 prose-headings:font-bold
                          prose-p:text-slate-300 prose-p:leading-relaxed
                          prose-strong:text-white prose-strong:font-semibold
                          prose-code:bg-slate-700 prose-code:text-green-400 prose-code:px-3 prose-code:py-1.5 prose-code:rounded-md prose-code:text-base prose-code:font-medium prose-code:border prose-code:border-slate-600
                          prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-600 prose-pre:overflow-x-auto prose-pre:text-sm prose-pre:shadow-lg
                          prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-slate-800/50 prose-blockquote:pl-4
                          prose-ul:text-slate-300 prose-ol:text-slate-300
                          prose-li:text-slate-300 prose-li:my-1
                          prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                          prose-table:text-sm prose-th:text-xs prose-td:text-xs sm:prose-th:text-sm sm:prose-td:text-sm
                          prose-img:rounded-lg prose-img:shadow-lg">
              <ContentWithNotesImproved content={content} lessonId={params.id} />
            </div>
          </CardContent>
        </Card>

        {/* Completion CTA */}
        {!lesson.completed && (
          <div className="mt-6 sm:mt-8">
            <Card className="bg-gradient-to-r from-emerald-600 to-blue-700 text-white border-0">
              <CardContent className="p-4 sm:p-6 text-center">
                <h3 className="text-lg sm:text-xl font-bold mb-2">🎯 Ready to mark this lesson complete?</h3>
                <p className="mb-4 text-sm sm:text-base">You're one step closer to your FAANG dream!</p>
                <Button
                  onClick={toggleCompletion}
                  variant="secondary"
                  size="lg"
                  className="bg-white text-slate-900 hover:bg-slate-100 w-full sm:w-auto"
                >
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Mark as Complete
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
