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
      case 'easy': return 'bg-emerald-500';
      case 'medium': return 'bg-amber-500';
      case 'hard': return 'bg-rose-500';
      default: return 'bg-slate-500';
    }
  };

  const getMotivationalMessage = () => {
    if (overallProgress === 0) return "🚀 Ready to start your FAANG journey?";
    if (overallProgress < 25) return "💪 Great start! Keep the momentum going!";
    if (overallProgress < 50) return "🔥 You're on fire! Halfway there!";
    if (overallProgress < 75) return "⭐ Amazing progress! You're almost there!";
    if (overallProgress < 100) return "🏆 So close to mastery! Final push!";
    return "🎉 FAANG READY! You've mastered everything!";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <div className="text-2xl font-bold text-blue-200">Loading your FAANG journey...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🚀 FAANG Interview Mastery</h1>
          <p className="text-xl text-blue-200 mb-4">Your journey to Big Tech success</p>
          <div className="text-lg font-semibold text-blue-300">{getMotivationalMessage()}</div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-orange-500 to-red-600 text-white transform hover:scale-105 transition-transform border-0">
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

          <Card className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white transform hover:scale-105 transition-transform border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100">Completed</p>
                  <p className="text-3xl font-bold">{completedLessons}/{totalLessons}</p>
                </div>
                <CheckCircle2 className="h-12 w-12 text-emerald-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white transform hover:scale-105 transition-transform border-0">
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

          <Card className="bg-gradient-to-r from-amber-500 to-orange-600 text-white transform hover:scale-105 transition-transform border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100">Progress</p>
                  <p className="text-3xl font-bold">{Math.round(overallProgress)}%</p>
                </div>
                <Trophy className="h-12 w-12 text-amber-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overall Progress */}
        <Card className="mb-8 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Target className="h-6 w-6" />
              Overall Progress to FAANG Success
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={overallProgress} className="h-6 mb-4" />
            <div className="flex justify-between text-sm text-slate-300">
              <span>{completedLessons} of {totalLessons} lessons completed</span>
              <span className="font-bold text-blue-400">{Math.round(overallProgress)}% Complete</span>
            </div>
          </CardContent>
        </Card>

        {/* Phases */}
        <div className="space-y-6">
          {phases.map((phase) => (
            <Card key={phase.id} className="overflow-hidden bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
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
                      className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all hover:shadow-lg ${
                        lesson.completed
                          ? 'bg-emerald-900/30 border-emerald-600/50'
                          : 'bg-slate-700/50 border-slate-600 hover:border-blue-500/50'
                      }`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <Button
                          variant={lesson.completed ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleLesson(lesson.id)}
                          className={lesson.completed ? "bg-emerald-600 hover:bg-emerald-700 border-0" : "bg-slate-600 hover:bg-slate-500 border-slate-500 text-white"}
                        >
                          {lesson.completed ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <BookOpen className="h-4 w-4" />
                          )}
                        </Button>
                        <div className="flex-1">
                          <h4 className={`font-semibold ${lesson.completed ? 'text-emerald-300' : 'text-white'}`}>
                            {lesson.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className={`${getDifficultyColor(lesson.difficulty)} text-white border-0`}>
                              {lesson.difficulty}
                            </Badge>
                            <span className="text-sm text-slate-400">
                              {lesson.estimated_hours}h estimated
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {lesson.completed && (
                          <div className="text-emerald-400 font-semibold mr-2">
                            ✅ Completed
                          </div>
                        )}
                        <Link href={`/lesson/${lesson.id}`}>
                          <Button variant="outline" size="sm" className="bg-blue-600 hover:bg-blue-700 border-blue-500 text-white">
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
          <Card className="bg-gradient-to-r from-indigo-700 to-purple-800 text-white border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">🎯 You're on track to FAANG success!</h3>
              <p className="text-lg text-indigo-100 mb-4">
                Every lesson completed brings you closer to your dream job. Keep going! 💪
              </p>
              <div className="text-sm text-indigo-200">
                {overallProgress < 100 ? (
                  `Only ${Math.ceil((100 - overallProgress) / 100 * totalLessons)} lessons left to complete your journey!`
                ) : (
                  "🎉 Congratulations! You're now FAANG-ready!"
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
