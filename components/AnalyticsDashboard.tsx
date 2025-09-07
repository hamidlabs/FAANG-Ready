'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Clock, Target, Brain, Code, Calendar, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserStats } from '@/lib/store';

interface ChartDataPoint {
  date: string;
  lessons: number;
  xp: number;
  time: number;
}

interface SkillProgress {
  name: string;
  current: number;
  target: number;
  color: string;
  icon: string;
}

export default function AnalyticsDashboard() {
  const userStats = useUserStats();
  
  // Sample data - in a real app, this would come from your database
  const weeklyData: ChartDataPoint[] = [
    { date: '2024-01-01', lessons: 3, xp: 150, time: 2.5 },
    { date: '2024-01-02', lessons: 2, xp: 100, time: 1.8 },
    { date: '2024-01-03', lessons: 4, xp: 200, time: 3.2 },
    { date: '2024-01-04', lessons: 1, xp: 50, time: 1.0 },
    { date: '2024-01-05', lessons: 5, xp: 250, time: 4.1 },
    { date: '2024-01-06', lessons: 3, xp: 150, time: 2.3 },
    { date: '2024-01-07', lessons: 2, xp: 100, time: 1.6 },
  ];

  const skillsProgress: SkillProgress[] = [
    { name: 'Algorithms', current: 75, target: 100, color: 'bg-blue-500', icon: '🧠' },
    { name: 'Data Structures', current: 65, target: 100, color: 'bg-green-500', icon: '🏗️' },
    { name: 'System Design', current: 45, target: 100, color: 'bg-purple-500', icon: '🏛️' },
    { name: 'Coding Practice', current: 80, target: 100, color: 'bg-orange-500', icon: '💻' },
    { name: 'Behavioral', current: 30, target: 100, color: 'bg-pink-500', icon: '🗣️' },
  ];

  const upcomingGoals = [
    { title: 'Complete Arrays & Strings', deadline: '2 days', progress: 85, priority: 'high' },
    { title: 'Master Binary Trees', deadline: '5 days', progress: 60, priority: 'medium' },
    { title: 'System Design Practice', deadline: '1 week', progress: 40, priority: 'medium' },
    { title: 'Mock Interview Session', deadline: '3 days', progress: 0, priority: 'high' },
  ];

  const insights = [
    {
      title: 'Peak Performance',
      description: 'You learn best between 2-4 PM',
      icon: '⏰',
      type: 'time'
    },
    {
      title: 'Strong Areas',
      description: 'Arrays and Hash Tables are your strength',
      icon: '💪',
      type: 'strength'
    },
    {
      title: 'Growth Opportunity', 
      description: 'Focus more on Dynamic Programming',
      icon: '📈',
      type: 'improvement'
    },
    {
      title: 'Consistency',
      description: 'Your 7-day streak shows great discipline!',
      icon: '🔥',
      type: 'achievement'
    }
  ];

  const maxLessons = Math.max(...weeklyData.map(d => d.lessons));
  const maxXP = Math.max(...weeklyData.map(d => d.xp));

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm">Total Progress</p>
                  <p className="text-2xl font-bold">
                    {Math.round((userStats.total_lessons_completed / 200) * 100)}%
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-200 text-sm">Study Velocity</p>
                  <p className="text-2xl font-bold">
                    {(userStats.total_lessons_completed / Math.max(userStats.total_hours_studied, 1)).toFixed(1)}
                    <span className="text-sm"> lessons/hr</span>
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-purple-600 to-purple-700 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm">Avg Session</p>
                  <p className="text-2xl font-bold">
                    {(userStats.total_hours_studied / Math.max(userStats.total_lessons_completed, 1)).toFixed(1)}
                    <span className="text-sm">h</span>
                  </p>
                </div>
                <Clock className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-r from-orange-600 to-orange-700 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-200 text-sm">Efficiency</p>
                  <p className="text-2xl font-bold">
                    {Math.min(Math.round((userStats.current_streak * 10) + (userStats.xp_points / 100)), 100)}%
                  </p>
                </div>
                <Target className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Tabs defaultValue="progress" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="progress" className="data-[state=active]:bg-slate-700">Progress</TabsTrigger>
          <TabsTrigger value="skills" className="data-[state=active]:bg-slate-700">Skills</TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-slate-700">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="space-y-6">
          {/* Weekly Progress Chart */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-400" />
                Weekly Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyData.map((day, index) => (
                  <motion.div
                    key={day.date}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-16 text-sm text-slate-400">
                      {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">{day.lessons} lessons</span>
                        <span className="text-blue-400">{day.xp} XP</span>
                      </div>
                      <div className="flex gap-1">
                        <Progress 
                          value={(day.lessons / maxLessons) * 100} 
                          className="flex-1 h-2 bg-slate-700" 
                        />
                        <Progress 
                          value={(day.xp / maxXP) * 100} 
                          className="flex-1 h-2 bg-slate-700" 
                        />
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 w-12 text-right">
                      {day.time}h
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Goals */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5 text-green-400" />
                Upcoming Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingGoals.map((goal, index) => (
                  <motion.div
                    key={goal.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-white font-medium">{goal.title}</h4>
                        <Badge 
                          variant={goal.priority === 'high' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {goal.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <Progress value={goal.progress} className="flex-1 h-2" />
                        <span className="text-xs text-slate-400">{goal.deadline}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-400" />
                Skill Mastery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {skillsProgress.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{skill.icon}</span>
                        <span className="text-white font-medium">{skill.name}</span>
                      </div>
                      <span className="text-slate-400 text-sm">
                        {skill.current}/{skill.target}%
                      </span>
                    </div>
                    <Progress 
                      value={(skill.current / skill.target) * 100} 
                      className="h-3"
                    />
                    <div className="text-xs text-slate-500">
                      {skill.target - skill.current}% to mastery
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {insights.map((insight, index) => (
              <motion.div
                key={insight.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{insight.icon}</div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">
                          {insight.title}
                        </h4>
                        <p className="text-slate-400 text-sm">
                          {insight.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}