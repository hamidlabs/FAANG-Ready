'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, Target, Flame, Trophy, BookOpen, ArrowRight, Star, Zap, Crown, Bot, ChevronDown, ChevronUp } from 'lucide-react';
import { XPBar, StreakDisplay, AchievementGrid, GamificationManager } from '@/components/Gamification';
import FloatingAIButton from '@/components/FloatingAIButton';
import CodePlayground from '@/components/CodePlayground';
import { CelebrationManager } from '@/components/CelebrationAnimations';
import { StreakMechanicsManager, DailyGoalTracker, WeeklyProgress } from '@/components/StreakMechanics';
import PWAInstaller from '@/components/PWAInstaller';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAppStore, useUserStats } from '@/lib/store';
import { toast } from 'sonner';

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
  const [showAchievements, setShowAchievements] = useState(false);
  const [playgroundOpen, setPlaygroundOpen] = useState(false);
  const [selectedLessonForPlayground, setSelectedLessonForPlayground] = useState<Lesson | null>(null);
  const [collapsedPhases, setCollapsedPhases] = useState<Set<number>>(new Set());
  
  const { setUserStats, earnXP, setCodePlaygroundOpen } = useAppStore();
  const userStats = useUserStats();

  useEffect(() => {
    fetchData();
    // Load collapsed phases from localStorage
    const savedCollapsedPhases = localStorage.getItem('collapsedPhases');
    if (savedCollapsedPhases) {
      setCollapsedPhases(new Set(JSON.parse(savedCollapsedPhases)));
    }
  }, []);
  
  // Sync stats with store
  useEffect(() => {
    if (stats) {
      setUserStats({
        current_streak: stats.current_streak,
        longest_streak: stats.longest_streak,
        total_lessons_completed: stats.total_lessons_completed,
        total_hours_studied: stats.total_hours_studied,
      });
    }
  }, [stats, setUserStats]);

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
        // Find the lesson that was toggled
        const lesson = phases.flatMap(p => p.lessons).find(l => l.id === lessonId);
        
        if (lesson && !lesson.completed) {
          // Lesson was completed - award XP
          earnXP(50, 'Lesson completed!');
          toast.success('Great job! +50 XP earned! 🎉', {
            description: `You completed: ${lesson.title}`,
          });
        }
        
        fetchData(); // Refresh data
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Failed to update progress. Please try again.');
    }
  };

  const togglePhaseCollapse = (phaseId: number) => {
    const newCollapsedPhases = new Set(collapsedPhases);
    if (collapsedPhases.has(phaseId)) {
      newCollapsedPhases.delete(phaseId);
    } else {
      newCollapsedPhases.add(phaseId);
    }
    setCollapsedPhases(newCollapsedPhases);
    // Save to localStorage
    localStorage.setItem('collapsedPhases', JSON.stringify(Array.from(newCollapsedPhases)));
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
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div 
            className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          ></motion.div>
          <motion.div 
            className="text-2xl font-bold text-blue-200"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading your FAANG journey...
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">🚀 FAANG Interview Mastery</h1>
          <p className="text-lg sm:text-xl text-blue-200 mb-4">Your journey to Big Tech success</p>
          <div className="text-base sm:text-lg font-semibold text-blue-300">{getMotivationalMessage()}</div>
        </div>

        {/* Enhanced Stats Cards with Gamification */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, staggerChildren: 0.1 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0 overflow-hidden relative">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-orange-100 text-sm sm:text-base">Current Streak</p>
                    <p className="text-2xl sm:text-3xl font-bold">{stats.current_streak} days</p>
                    {stats.current_streak > 0 && (
                      <motion.p 
                        className="text-sm text-orange-200 mt-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        Keep it up! 🔥
                      </motion.p>
                    )}
                  </div>
                  <motion.div
                    animate={{ rotate: stats.current_streak > 7 ? [0, 10, -10, 0] : 0 }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Flame className="h-10 w-10 sm:h-12 sm:w-12 text-orange-200" />
                  </motion.div>
                </div>
                
                {/* Animated background effect for high streaks */}
                {stats.current_streak > 7 && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-red-400/20"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white border-0">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-sm sm:text-base">Completed</p>
                    <p className="text-2xl sm:text-3xl font-bold">{completedLessons}/{totalLessons}</p>
                    <div className="text-xs text-emerald-200 mt-1">
                      {Math.round(overallProgress)}% Progress
                    </div>
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <CheckCircle2 className="h-10 w-10 sm:h-12 sm:w-12 text-emerald-200" />
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm sm:text-base">Hours Studied</p>
                    <p className="text-2xl sm:text-3xl font-bold">{stats.total_hours_studied}h</p>
                    <div className="text-xs text-purple-200 mt-1">
                      Dedication pays off! 💪
                    </div>
                  </div>
                  <Clock className="h-10 w-10 sm:h-12 sm:w-12 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 relative overflow-hidden">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-amber-100 text-sm sm:text-base">Level & XP</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xl sm:text-2xl font-bold">Lv.{userStats.level}</p>
                      <Crown className="h-6 w-6 text-yellow-300" />
                    </div>
                    <div className="text-xs text-amber-200 mt-1">
                      {userStats.xp_points} XP
                    </div>
                  </div>
                  <motion.div
                    animate={{ 
                      y: [0, -5, 0],
                      rotate: [0, 5, -5, 0] 
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Trophy className="h-10 w-10 sm:h-12 sm:w-12 text-amber-200" />
                  </motion.div>
                </div>
                
                {/* Sparkle effect for high levels */}
                {userStats.level > 5 && (
                  <motion.div
                    className="absolute top-2 right-2"
                    animate={{ scale: [0, 1, 0], rotate: [0, 180, 360] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Star className="h-4 w-4 text-yellow-300" />
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
        
        {/* XP Bar */}
        <motion.div 
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-400" />
                  <span className="text-sm sm:text-base">Experience Progress</span>
                </h3>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAchievements(!showAchievements)}
                    className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600 w-full sm:w-auto"
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    <span className="text-xs sm:text-sm">Achievements</span>
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-purple-600 border-purple-500 text-white hover:bg-purple-700 w-full sm:w-auto"
                      >
                        <Target className="h-4 w-4 mr-2" />
                        <span className="text-xs sm:text-sm">Analytics</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[95vw] sm:max-w-6xl h-[90vh] bg-slate-900 border-slate-700">
                      <DialogHeader>
                        <DialogTitle className="text-white text-lg sm:text-xl">
                          📊 Learning Analytics Dashboard
                        </DialogTitle>
                      </DialogHeader>
                      <div className="flex-1 overflow-y-auto pr-2">
                        <AnalyticsDashboard />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <XPBar currentXP={userStats.xp_points} level={userStats.level} />
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Daily Goal and Weekly Progress */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <DailyGoalTracker 
            completedToday={Math.min(completedLessons, 3)} 
            dailyGoal={3} 
          />
          <WeeklyProgress 
            weeklyData={[
              { day: 'Monday', completed: true, lessons: 3 },
              { day: 'Tuesday', completed: true, lessons: 2 },
              { day: 'Wednesday', completed: completedLessons >= 1, lessons: Math.min(completedLessons, 2) },
              { day: 'Thursday', completed: false, lessons: 0 },
              { day: 'Friday', completed: false, lessons: 0 },
              { day: 'Saturday', completed: false, lessons: 0 },
              { day: 'Sunday', completed: false, lessons: 0 },
            ]}
          />
        </motion.div>
        
        {/* Achievements Panel */}
        <AnimatePresence>
          {showAchievements && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
                    <span className="text-lg sm:text-xl">Your Achievements</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <AchievementGrid unlockedAchievements={userStats.achievements} />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        <Card className="mb-6 sm:mb-8 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white text-lg sm:text-xl">
              <Target className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="break-words">Overall Progress to FAANG Success</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={overallProgress} className="h-4 sm:h-6 mb-4" />
            <div className="flex flex-col sm:flex-row justify-between gap-2 text-xs sm:text-sm text-slate-300">
              <span>{completedLessons} of {totalLessons} lessons completed</span>
              <span className="font-bold text-blue-400">{Math.round(overallProgress)}% Complete</span>
            </div>
          </CardContent>
        </Card>

        {/* Phases */}
        <div className="space-y-4 sm:space-y-6">
          {phases.map((phase) => {
            const isCollapsed = collapsedPhases.has(phase.id);
            return (
              <Card key={phase.id} className="overflow-hidden bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all">
                <CardHeader 
                  className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white cursor-pointer hover:from-indigo-500 hover:to-purple-600 transition-all"
                  onClick={() => togglePhaseCollapse(phase.id)}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-lg sm:text-xl mb-2 break-words">{phase.name}</CardTitle>
                        <motion.div
                          animate={{ rotate: isCollapsed ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="h-5 w-5 text-indigo-200" />
                        </motion.div>
                      </div>
                      <p className="text-indigo-100 text-sm sm:text-base break-words">{phase.description}</p>
                      <p className="text-xs sm:text-sm text-indigo-200 mt-1">
                        Week {phase.week_start}-{phase.week_end}
                      </p>
                    </div>
                    <div className="text-center sm:text-right shrink-0">
                      <div className="text-xl sm:text-2xl font-bold">{phase.completed}/{phase.total}</div>
                      <div className="text-xs sm:text-sm text-indigo-200">lessons</div>
                    </div>
                  </div>
                  <Progress 
                    value={phase.total > 0 ? (phase.completed / phase.total) * 100 : 0} 
                    className="mt-3 sm:mt-4 bg-indigo-400" 
                  />
                </CardHeader>
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <CardContent className="p-4 sm:p-6">
                        <div className="grid gap-3 sm:gap-4">
                          {phase.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border-2 transition-all hover:shadow-lg ${
                                lesson.completed
                                  ? 'bg-emerald-900/30 border-emerald-600/50'
                                  : 'bg-slate-700/50 border-slate-600 hover:border-blue-500/50'
                              }`}
                            >
                              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                <Button
                                  variant={lesson.completed ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => toggleLesson(lesson.id)}
                                  className={`shrink-0 ${lesson.completed ? "bg-emerald-600 hover:bg-emerald-700 border-0" : "bg-slate-600 hover:bg-slate-500 border-slate-500 text-white"}`}
                                >
                                  {lesson.completed ? (
                                    <CheckCircle2 className="h-4 w-4" />
                                  ) : (
                                    <BookOpen className="h-4 w-4" />
                                  )}
                                </Button>
                                <div className="flex-1 min-w-0">
                                  <h4 className={`font-semibold text-sm sm:text-base break-words ${lesson.completed ? 'text-emerald-300' : 'text-white'}`}>
                                    {lesson.title}
                                  </h4>
                                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 mt-1">
                                    <Badge variant="outline" className={`${getDifficultyColor(lesson.difficulty)} text-white border-0 text-xs`}>
                                      {lesson.difficulty}
                                    </Badge>
                                    <span className="text-xs sm:text-sm text-slate-400">
                                      {lesson.estimated_hours}h estimated
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                                {lesson.completed && (
                                  <motion.div 
                                    className="text-emerald-400 font-semibold text-xs sm:text-sm text-center sm:mr-2"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200 }}
                                  >
                                    ✅ Completed
                                  </motion.div>
                                )}
                                
                                <div className="flex gap-2">
                                  {/* Code Practice Button */}
                                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 sm:flex-initial">
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={() => {
                                        setSelectedLessonForPlayground(lesson);
                                        setPlaygroundOpen(true);
                                        setCodePlaygroundOpen(true);
                                      }}
                                      className="bg-purple-600 hover:bg-purple-700 border-purple-500 text-white w-full sm:w-auto"
                                    >
                                      <Bot className="h-4 w-4 mr-1 sm:mr-2" />
                                      <span className="text-xs sm:text-sm">Code</span>
                                    </Button>
                                  </motion.div>
                                  
                                  <Link href={`/lesson/${lesson.id}`} className="flex-1 sm:flex-initial">
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full">
                                      <Button variant="outline" size="sm" className="bg-blue-600 hover:bg-blue-700 border-blue-500 text-white w-full sm:w-auto">
                                        <BookOpen className="h-4 w-4 mr-1 sm:mr-2" />
                                        <span className="text-xs sm:text-sm">Study</span>
                                        <ArrowRight className="h-4 w-4 ml-1 sm:ml-2" />
                                      </Button>
                                    </motion.div>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            );
          })}
        </div>

        {/* Motivational Footer */}
        <div className="mt-8 sm:mt-12 text-center">
          <Card className="bg-gradient-to-r from-indigo-700 to-purple-800 text-white border-0">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">🎯 You're on track to FAANG success!</h3>
              <p className="text-base sm:text-lg text-indigo-100 mb-3 sm:mb-4">
                Every lesson completed brings you closer to your dream job. Keep going! 💪
              </p>
              <div className="text-xs sm:text-sm text-indigo-200">
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
      
      {/* Interactive Components */}
      <FloatingAIButton />
      
      {/* Code Playground */}
      <CodePlayground
        isOpen={playgroundOpen}
        onClose={() => {
          setPlaygroundOpen(false);
          setCodePlaygroundOpen(false);
        }}
        problemTitle={selectedLessonForPlayground?.title || 'Coding Practice'}
        language="javascript"
      />
      
      {/* PWA Installer */}
      <PWAInstaller />
      
      {/* Celebration & Gamification Managers */}
      <CelebrationManager />
      <GamificationManager />
      <StreakMechanicsManager />
    </div>
  );
}
