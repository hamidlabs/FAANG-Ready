'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Flame, AlertCircle, Shield, Calendar, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAppStore, useUserStats } from '@/lib/store';
import { toast } from 'sonner';

interface StreakWarningProps {
  hoursLeft: number;
}

export function StreakWarning({ hoursLeft }: StreakWarningProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || hoursLeft > 6) return null;

  const getUrgencyLevel = () => {
    if (hoursLeft <= 2) return { color: 'bg-red-600', text: 'URGENT', icon: '🚨' };
    if (hoursLeft <= 4) return { color: 'bg-orange-600', text: 'WARNING', icon: '⚠️' };
    return { color: 'bg-yellow-600', text: 'REMINDER', icon: '⏰' };
  };

  const { color, text, icon } = getUrgencyLevel();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.95 }}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
      >
        <Card className={`${color} text-white border-0 shadow-2xl`}>
          <CardContent className="p-4 flex items-center gap-3">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: hoursLeft <= 2 ? [0, -5, 5, 0] : 0 
              }}
              transition={{ 
                duration: hoursLeft <= 2 ? 0.5 : 1.5,
                repeat: Infinity 
              }}
              className="text-2xl"
            >
              {icon}
            </motion.div>
            
            <div className="flex-1">
              <div className="font-bold text-sm">{text}: Streak at Risk!</div>
              <div className="text-sm opacity-90">
                Only {hoursLeft} hour{hoursLeft !== 1 ? 's' : ''} left to maintain your streak
              </div>
            </div>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => setDismissed(true)}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              ✕
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

interface StreakFreezeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StreakFreezeModal({ isOpen, onClose }: StreakFreezeModalProps) {
  const userStats = useUserStats();
  const { setUserStats } = useAppStore();

  const useStreakFreeze = () => {
    // In a real app, this would update the database
    setUserStats({
      ...userStats,
      // Add streak freeze logic here
    });
    
    toast.success('🛡️ Streak freeze activated! Your streak is safe for 24 hours.');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full mx-4"
          >
            <Card className="bg-gradient-to-br from-blue-900 to-purple-900 text-white border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-blue-400" />
                  Streak Freeze Available!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-6xl mb-4"
                  >
                    🛡️
                  </motion.div>
                  <p className="text-slate-200 mb-4">
                    Protect your {userStats.current_streak}-day streak! Use a streak freeze to give yourself a 24-hour buffer.
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Streak Freezes Available:</span>
                    <Badge variant="outline" className="bg-blue-600 text-white border-blue-500">
                      3 remaining
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="flex-1 bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                  >
                    Not Now
                  </Button>
                  <Button
                    onClick={useStreakFreeze}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Use Freeze
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface DailyGoalTrackerProps {
  completedToday: number;
  dailyGoal: number;
}

export function DailyGoalTracker({ completedToday, dailyGoal }: DailyGoalTrackerProps) {
  const progress = Math.min((completedToday / dailyGoal) * 100, 100);
  const isComplete = completedToday >= dailyGoal;

  return (
    <Card className={`${isComplete ? 'bg-gradient-to-r from-green-600 to-emerald-700' : 'bg-slate-800'} border-slate-700`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className={`h-5 w-5 ${isComplete ? 'text-white' : 'text-blue-400'}`} />
            <span className={`font-semibold ${isComplete ? 'text-white' : 'text-white'}`}>
              Daily Goal
            </span>
          </div>
          <Badge variant={isComplete ? "default" : "outline"} 
                className={isComplete ? 'bg-white/20 text-white' : 'border-slate-600'}>
            {completedToday}/{dailyGoal}
          </Badge>
        </div>

        <Progress 
          value={progress} 
          className={`h-2 mb-2 ${isComplete ? 'bg-white/20' : 'bg-slate-700'}`}
        />

        <div className="flex justify-between items-center text-sm">
          <span className={isComplete ? 'text-white/80' : 'text-slate-400'}>
            {isComplete ? '🎉 Goal achieved!' : `${dailyGoal - completedToday} more to go`}
          </span>
          <span className={`font-medium ${isComplete ? 'text-white' : 'text-blue-400'}`}>
            {Math.round(progress)}%
          </span>
        </div>

        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-xs text-white/80 text-center"
          >
            +50 XP bonus earned! 🌟
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

interface WeeklyProgressProps {
  weeklyData: Array<{ day: string; completed: boolean; lessons: number }>;
}

export function WeeklyProgress({ weeklyData }: WeeklyProgressProps) {
  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Calendar className="h-5 w-5 text-purple-400" />
          This Week's Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {weeklyData.map((day, index) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-xs text-slate-400 mb-2">
                {day.day.slice(0, 3)}
              </div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mx-auto ${
                  day.completed
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
                    : 'bg-slate-700 text-slate-400'
                }`}
              >
                {day.completed ? '✓' : day.lessons || '-'}
              </motion.div>
              {day.completed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="text-xs text-green-400 mt-1"
                >
                  🔥
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <div className="text-sm text-slate-400 mb-2">
            Perfect Week Bonus: 500 XP
          </div>
          <Progress 
            value={(weeklyData.filter(d => d.completed).length / 7) * 100} 
            className="h-2"
          />
        </div>
      </CardContent>
    </Card>
  );
}

// Main component that manages all streak mechanics
export function StreakMechanicsManager() {
  const [showStreakFreeze, setShowStreakFreeze] = useState(false);
  const [hoursUntilReset, setHoursUntilReset] = useState(12);
  
  const userStats = useUserStats();

  // Simulate time-based mechanics
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const hoursLeft = 24 - now.getHours();
      setHoursUntilReset(hoursLeft);

      // Show streak warning if user hasn't studied today and streak is at risk
      if (hoursLeft <= 6 && userStats.current_streak > 0) {
        // In a real app, check if user studied today
        const studiedToday = false; // This would come from your database
        
        if (!studiedToday && Math.random() > 0.95) { // 5% chance per interval
          toast.warning('🔥 Your streak is at risk! Study now to maintain it.', {
            duration: 10000,
            action: {
              label: 'Use Streak Freeze',
              onClick: () => setShowStreakFreeze(true),
            },
          });
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(timer);
  }, [userStats.current_streak]);

  // Sample weekly data (in real app, this would come from your database)
  const weeklyData = [
    { day: 'Monday', completed: true, lessons: 3 },
    { day: 'Tuesday', completed: true, lessons: 2 },
    { day: 'Wednesday', completed: false, lessons: 0 },
    { day: 'Thursday', completed: true, lessons: 4 },
    { day: 'Friday', completed: false, lessons: 1 },
    { day: 'Saturday', completed: false, lessons: 0 },
    { day: 'Sunday', completed: false, lessons: 0 },
  ];

  return (
    <>
      <StreakWarning hoursLeft={hoursUntilReset} />
      <StreakFreezeModal 
        isOpen={showStreakFreeze} 
        onClose={() => setShowStreakFreeze(false)} 
      />
      
      {/* These components would be integrated into your dashboard */}
      <div className="hidden">
        <DailyGoalTracker completedToday={2} dailyGoal={3} />
        <WeeklyProgress weeklyData={weeklyData} />
      </div>
    </>
  );
}