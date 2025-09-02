'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, BookOpen, CheckCircle2, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Lesson {
  id: number;
  title: string;
  file_path: string;
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

      // Fetch markdown content
      const contentResponse = await fetch(`/api/content?path=${encodeURIComponent(lessonData.file_path)}`);
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
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => router.back()} className="bg-slate-700 hover:bg-slate-600 border-slate-600 text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">{lesson.title}</h1>
            <p className="text-blue-200">{lesson.phase_name}</p>
          </div>

          <Button
            onClick={toggleCompletion}
            variant={lesson.completed ? "default" : "outline"}
            className={lesson.completed ? "bg-emerald-600 hover:bg-emerald-700 border-0" : "bg-slate-700 hover:bg-slate-600 border-slate-600 text-white"}
          >
            {lesson.completed ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Completed
              </>
            ) : (
              <>
                <BookOpen className="h-4 w-4 mr-2" />
                Mark Complete
              </>
            )}
          </Button>
        </div>

        {/* Lesson Info */}
        <Card className="mb-6 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className={`${getDifficultyColor(lesson.difficulty)} text-white border-0`}>
                {lesson.difficulty}
              </Badge>
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="h-4 w-4" />
                <span>{lesson.estimated_hours}h estimated</span>
              </div>
              {lesson.completed && (
                <Badge className="bg-emerald-600 border-0">
                  ✅ Completed
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <Card className="bg-slate-800/70 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="prose prose-lg prose-invert max-w-none
                          prose-headings:text-blue-200 prose-headings:font-bold
                          prose-p:text-slate-300 prose-p:leading-relaxed
                          prose-strong:text-white prose-strong:font-semibold
                          prose-code:bg-slate-700 prose-code:text-blue-300 prose-code:px-2 prose-code:py-1 prose-code:rounded
                          prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700
                          prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-slate-800/50 prose-blockquote:pl-4
                          prose-ul:text-slate-300 prose-ol:text-slate-300
                          prose-li:text-slate-300 prose-li:my-1
                          prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>

        {/* Completion CTA */}
        {!lesson.completed && (
          <div className="mt-8 text-center">
            <Card className="bg-gradient-to-r from-emerald-600 to-blue-700 text-white border-0">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">🎯 Ready to mark this lesson complete?</h3>
                <p className="mb-4">You're one step closer to your FAANG dream!</p>
                <Button
                  onClick={toggleCompletion}
                  variant="secondary"
                  size="lg"
                  className="bg-white text-slate-900 hover:bg-slate-100"
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
