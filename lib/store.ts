import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
interface UserStats {
  current_streak: number;
  longest_streak: number;
  total_lessons_completed: number;
  total_hours_studied: number;
  xp_points: number;
  level: number;
  achievements: string[];
  daily_goal_completed: boolean;
  last_study_date: string | null;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked_at?: string;
  progress?: number;
  max_progress?: number;
}

interface GameState {
  showCelebration: boolean;
  lastEarnedXP: number;
  recentAchievements: Achievement[];
  streakFreeze: number;
  comboMultiplier: number;
}

interface AIState {
  chatOpen: boolean;
  chatHistory: Array<{role: 'user' | 'assistant', content: string, timestamp: number}>;
  isTyping: boolean;
  lastHint: string | null;
  aiPersonality: 'mentor' | 'coach' | 'friend';
}

// Store Interface
interface AppStore {
  // User Stats
  userStats: UserStats;
  setUserStats: (stats: Partial<UserStats>) => void;
  
  // Gamification
  gameState: GameState;
  earnXP: (amount: number, reason: string) => void;
  triggerCelebration: (type: 'xp' | 'achievement' | 'streak') => void;
  unlockAchievement: (achievement: Achievement) => void;
  
  // AI Assistant
  aiState: AIState;
  setChatOpen: (open: boolean) => void;
  addChatMessage: (role: 'user' | 'assistant', content: string) => void;
  setAITyping: (typing: boolean) => void;
  
  // Learning State
  currentLesson: number | null;
  setCurrentLesson: (id: number | null) => void;
  codePlaygroundOpen: boolean;
  setCodePlaygroundOpen: (open: boolean) => void;
  
  // Settings & Preferences
  settings: {
    notifications: boolean;
    darkMode: boolean;
    difficultyPreference: 'adaptive' | 'easy' | 'medium' | 'hard';
    dailyGoal: number;
    studyReminders: boolean;
  };
  updateSettings: (settings: Partial<AppStore['settings']>) => void;
  
  // Actions
  resetStore: () => void;
}

// Initial States
const initialUserStats: UserStats = {
  current_streak: 0,
  longest_streak: 0,
  total_lessons_completed: 0,
  total_hours_studied: 0,
  xp_points: 0,
  level: 1,
  achievements: [],
  daily_goal_completed: false,
  last_study_date: null,
};

const initialGameState: GameState = {
  showCelebration: false,
  lastEarnedXP: 0,
  recentAchievements: [],
  streakFreeze: 0,
  comboMultiplier: 1,
};

const initialAIState: AIState = {
  chatOpen: false,
  chatHistory: [],
  isTyping: false,
  lastHint: null,
  aiPersonality: 'mentor',
};

const initialSettings = {
  notifications: true,
  darkMode: true,
  difficultyPreference: 'adaptive' as const,
  dailyGoal: 3,
  studyReminders: true,
};

// XP Rewards
const XP_REWARDS = {
  LESSON_COMPLETE: 50,
  DAILY_GOAL: 100,
  STREAK_DAY: 25,
  PERFECT_WEEK: 500,
  PROBLEM_SOLVE: 30,
  CODE_REVIEW: 20,
  HELP_OTHERS: 40,
} as const;

// Achievement Definitions
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_lesson',
    title: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🎯',
    rarity: 'common',
  },
  {
    id: 'week_streak',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    rarity: 'rare',
  },
  {
    id: 'coding_master',
    title: 'Coding Master',
    description: 'Complete 100 coding problems',
    icon: '👑',
    rarity: 'epic',
    max_progress: 100,
  },
  {
    id: 'faang_ready',
    title: 'FAANG Ready',
    description: 'Complete all phases',
    icon: '🚀',
    rarity: 'legendary',
  },
];

// Create Store
export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial States
      userStats: initialUserStats,
      gameState: initialGameState,
      aiState: initialAIState,
      currentLesson: null,
      codePlaygroundOpen: false,
      settings: initialSettings,

      // User Stats Actions
      setUserStats: (stats) =>
        set((state) => ({
          userStats: { ...state.userStats, ...stats },
        })),

      // Gamification Actions
      earnXP: (amount, reason) =>
        set((state) => {
          const newXP = state.userStats.xp_points + amount;
          const newLevel = Math.floor(newXP / 1000) + 1;
          const leveledUp = newLevel > state.userStats.level;
          
          return {
            userStats: {
              ...state.userStats,
              xp_points: newXP,
              level: newLevel,
            },
            gameState: {
              ...state.gameState,
              lastEarnedXP: amount,
              showCelebration: true,
            },
          };
        }),

      triggerCelebration: (type) =>
        set((state) => ({
          gameState: {
            ...state.gameState,
            showCelebration: true,
          },
        })),

      unlockAchievement: (achievement) =>
        set((state) => {
          const alreadyUnlocked = state.userStats.achievements.includes(achievement.id);
          if (alreadyUnlocked) return state;
          
          return {
            userStats: {
              ...state.userStats,
              achievements: [...state.userStats.achievements, achievement.id],
            },
            gameState: {
              ...state.gameState,
              recentAchievements: [...state.gameState.recentAchievements, {
                ...achievement,
                unlocked_at: new Date().toISOString(),
              }],
              showCelebration: true,
            },
          };
        }),

      // AI Actions
      setChatOpen: (open) =>
        set((state) => ({
          aiState: { ...state.aiState, chatOpen: open },
        })),

      addChatMessage: (role, content) =>
        set((state) => ({
          aiState: {
            ...state.aiState,
            chatHistory: [
              ...state.aiState.chatHistory,
              { role, content, timestamp: Date.now() },
            ],
          },
        })),

      setAITyping: (typing) =>
        set((state) => ({
          aiState: { ...state.aiState, isTyping: typing },
        })),

      // Learning Actions
      setCurrentLesson: (id) =>
        set({ currentLesson: id }),

      setCodePlaygroundOpen: (open) =>
        set({ codePlaygroundOpen: open }),

      // Settings
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      // Reset
      resetStore: () =>
        set({
          userStats: initialUserStats,
          gameState: initialGameState,
          aiState: initialAIState,
          currentLesson: null,
          codePlaygroundOpen: false,
          settings: initialSettings,
        }),
    }),
    {
      name: 'faang-prep-store',
      partialize: (state) => ({
        userStats: state.userStats,
        settings: state.settings,
        aiState: {
          ...state.aiState,
          isTyping: false, // Don't persist typing state
        },
      }),
    }
  )
);

// Selectors
export const useUserStats = () => useAppStore((state) => state.userStats);
export const useGameState = () => useAppStore((state) => state.gameState);
export const useAIState = () => useAppStore((state) => state.aiState);
export const useSettings = () => useAppStore((state) => state.settings);