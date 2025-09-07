'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Flame, Zap, Crown, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAppStore, useUserStats, useGameState, ACHIEVEMENTS } from '@/lib/store';
import { toast } from 'sonner';

interface XPBarProps {
  currentXP: number;
  level: number;
}

export function XPBar({ currentXP, level }: XPBarProps) {
  const xpForCurrentLevel = (level - 1) * 1000;
  const xpForNextLevel = level * 1000;
  const progressInCurrentLevel = currentXP - xpForCurrentLevel;
  const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;
  const progressPercentage = (progressInCurrentLevel / xpNeededForLevel) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="text-slate-400">Level {level}</span>
        <span className="text-slate-400">
          {progressInCurrentLevel}/{xpNeededForLevel} XP
        </span>
      </div>
      <div className="relative">
        <Progress value={progressPercentage} className="h-3 bg-slate-800" />
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

interface AchievementToastProps {
  achievement: typeof ACHIEVEMENTS[0];
}

export function AchievementToast({ achievement }: AchievementToastProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg text-white"
    >
      <div className="text-2xl">{achievement.icon}</div>
      <div>
        <h4 className="font-bold">{achievement.title}</h4>
        <p className="text-sm opacity-90">{achievement.description}</p>
      </div>
    </motion.div>
  );
}

interface XPGainAnimationProps {
  amount: number;
  reason: string;
  onComplete: () => void;
}

export function XPGainAnimation({ amount, reason, onComplete }: XPGainAnimationProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.5, y: -50 }}
        transition={{ type: "spring", damping: 15 }}
        className="fixed bottom-20 right-4 z-50"
      >
        <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white border-0">
          <CardContent className="p-4 flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              <Zap className="h-6 w-6" />
            </motion.div>
            <div>
              <div className="font-bold text-lg">+{amount} XP</div>
              <div className="text-sm opacity-90">{reason}</div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
}

export function StreakDisplay({ currentStreak, longestStreak }: StreakDisplayProps) {
  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'from-purple-500 to-pink-600';
    if (streak >= 14) return 'from-orange-500 to-red-600';
    if (streak >= 7) return 'from-yellow-500 to-orange-600';
    return 'from-blue-500 to-cyan-600';
  };

  const getStreakTitle = (streak: number) => {
    if (streak >= 30) return 'Legendary Streak!';
    if (streak >= 14) return 'Fire Streak!';
    if (streak >= 7) return 'Hot Streak!';
    return 'Building Momentum';
  };

  return (
    <Card className={`bg-gradient-to-r ${getStreakColor(currentStreak)} text-white`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flame className="h-5 w-5" />
              <span className="text-sm font-medium opacity-90">{getStreakTitle(currentStreak)}</span>
            </div>
            <div className="text-3xl font-bold">{currentStreak}</div>
            <div className="text-sm opacity-80">day{currentStreak !== 1 ? 's' : ''} in a row</div>
          </div>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-4xl"
          >
            🔥
          </motion.div>
        </div>
        
        {longestStreak > currentStreak && (
          <div className="mt-3 pt-3 border-t border-white/20">
            <div className="text-xs opacity-80">
              Personal best: {longestStreak} days
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface AchievementGridProps {
  unlockedAchievements: string[];
}

export function AchievementGrid({ unlockedAchievements }: AchievementGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {ACHIEVEMENTS.map((achievement) => {
        const isUnlocked = unlockedAchievements.includes(achievement.id);
        
        return (
          <motion.div
            key={achievement.id}
            whileHover={{ scale: 1.05 }}
            className={`relative ${!isUnlocked ? 'opacity-50' : ''}`}
          >
            <Card className={`${
              isUnlocked 
                ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)} text-white` 
                : 'bg-slate-800 border-slate-700'
            }`}>
              <CardContent className="p-4 text-center">
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <h4 className={`font-semibold text-sm mb-1 ${
                  isUnlocked ? 'text-white' : 'text-slate-300'
                }`}>
                  {achievement.title}
                </h4>
                <p className={`text-xs ${
                  isUnlocked ? 'text-white/80' : 'text-slate-500'
                }`}>
                  {achievement.description}
                </p>
                
                <Badge 
                  variant="outline" 
                  className={`mt-2 text-xs ${
                    isUnlocked 
                      ? 'border-white/30 text-white' 
                      : 'border-slate-600 text-slate-400'
                  }`}
                >
                  {achievement.rarity}
                </Badge>
                
                {isUnlocked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="absolute -top-2 -right-2"
                  >
                    <div className="bg-yellow-500 rounded-full p-1">
                      <Crown className="h-4 w-4 text-white" />
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

function getRarityColor(rarity: string) {
  switch (rarity) {
    case 'legendary': return 'from-purple-600 to-pink-600';
    case 'epic': return 'from-indigo-600 to-blue-600';
    case 'rare': return 'from-green-600 to-teal-600';
    default: return 'from-gray-600 to-slate-600';
  }
}

export function GamificationManager() {
  const userStats = useUserStats();
  const gameState = useGameState();
  const { earnXP, unlockAchievement } = useAppStore();

  // Check for new achievements
  useEffect(() => {
    const checkAchievements = () => {
      ACHIEVEMENTS.forEach((achievement) => {
        const isAlreadyUnlocked = userStats.achievements.includes(achievement.id);
        if (isAlreadyUnlocked) return;

        let shouldUnlock = false;

        switch (achievement.id) {
          case 'first_lesson':
            shouldUnlock = userStats.total_lessons_completed >= 1;
            break;
          case 'week_streak':
            shouldUnlock = userStats.current_streak >= 7;
            break;
          case 'coding_master':
            shouldUnlock = userStats.total_lessons_completed >= 100;
            break;
          case 'faang_ready':
            shouldUnlock = userStats.total_lessons_completed >= 200; // Assuming 200 total lessons
            break;
        }

        if (shouldUnlock) {
          unlockAchievement(achievement);
          toast.custom((t) => <AchievementToast achievement={achievement} />);
        }
      });
    };

    checkAchievements();
  }, [userStats.total_lessons_completed, userStats.current_streak, unlockAchievement]);

  return null; // This component only manages logic
}