'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, Target, Flame, Trophy, BookOpen, ArrowRight } from 'lucide-react';

interface Phase {
  id: number;
  name: string;
  description: string;
  week_start: number;
  week_end: number;
  lessons: Lesson[];
  completed: number;
  total: number;
}

interface Lesson {
  id: number;
  title: string;
  file_path: string;
  estimated_hours: number;
  difficulty: string;
  completed: boolean;
  confidence_level?: number;
}

interface UserStats {
  current_streak: number;
  longest_streak: number;
  total_lessons_completed: number;
  total_hours_studied: number;
}

export default function Dashboard() {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [stats, setStats] = useState<UserStats>({ current_streak: 0, longest_streak: 0, total_lessons_completed: 0, total_hours_studied: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [phasesRes, statsRes] = await Promise.all([
        fetch('/api/phases'),
        fetch('/api/stats')
      ]);
      
      const phasesData = await phasesRes.json();
      const statsData = await statsRes.json();
      
      setPhases(phasesData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLesson = async (lessonId: number) => {
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId })
      });
      
      if (response.ok) {
        fetchData(); // Refresh data
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const totalLessons = phases.reduce((sum, phase) => sum + phase.total, 0);
  const completedLessons = phases.reduce((sum, phase) => sum + phase.completed, 0);
  const overallProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

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
        <div className="text-2xl font-bold text-indigo-600">Loading your FAANG journey...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🚀 FAANG Interview Mastery</h1>
          <p className="text-xl text-gray-600">Your journey to Big Tech success</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-orange-400 to-red-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Current Streak</p>
                  <p className="text-3xl font-bold">{stats.current_streak} days</p>
                </div>
                <Flame className="h-12 w-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-400 to-blue-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Completed</p>
                  <p className="text-3xl font-bold">{completedLessons}/{totalLessons}</p>
                </div>
                <CheckCircle2 className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-400 to-pink-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Hours Studied</p>
                  <p className="text-3xl font-bold">{stats.total_hours_studied}h</p>
                </div>
                <Clock className="h-12 w-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100">Progress</p>
                  <p className="text-3xl font-bold">{Math.round(overallProgress)}%</p>
                </div>
                <Trophy className="h-12 w-12 text-yellow-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overall Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6" />
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={overallProgress} className="h-4 mb-2" />
            <p className="text-sm text-gray-600">
              {completedLessons} of {totalLessons} lessons completed ({Math.round(overallProgress)}%)
            </p>
          </CardContent>
        </Card>

        {/* Phases */}
        <div className="space-y-6">
          {phases.map((phase) => (
            <Card key={phase.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-2">{phase.name}</CardTitle>
                    <p className="text-indigo-100">{phase.description}</p>
                    <p className="text-sm text-indigo-200 mt-1">
                      Week {phase.week_start}-{phase.week_end}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{phase.completed}/{phase.total}</div>
                    <div className="text-sm text-indigo-200">lessons</div>
                  </div>
                </div>
                <Progress 
                  value={phase.total > 0 ? (phase.completed / phase.total) * 100 : 0} 
                  className="mt-4 bg-indigo-400" 
                />
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-4">
                  {phase.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                        lesson.completed
                          ? 'bg-green-50 border-green-200'
                          : 'bg-white border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <Button
                          variant={lesson.completed ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleLesson(lesson.id)}
                          className={lesson.completed ? "bg-green-500 hover:bg-green-600" : ""}
                        >
                          {lesson.completed ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <BookOpen className="h-4 w-4" />
                          )}
                        </Button>
                        <div>
                          <h4 className={`font-semibold ${lesson.completed ? 'text-green-800' : 'text-gray-900'}`}>
                            {lesson.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className={`${getDifficultyColor(lesson.difficulty)} text-white`}>
                              {lesson.difficulty}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {lesson.estimated_hours}h estimated
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {lesson.completed && (
                          <div className="text-green-600 font-semibold mr-2">
                            ✅ Completed
                          </div>
                        )}
                        <Link href={`/lesson/${lesson.id}`}>
                          <Button variant="outline" size="sm">
                            <BookOpen className="h-4 w-4 mr-2" />
                            Study
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Motivational Footer */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">🎯 You're on track to FAANG success!</h3>
              <p className="text-lg text-indigo-100">
                Every lesson completed brings you closer to your dream job. Keep going! 💪
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
