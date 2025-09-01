'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Phase, Topic } from '@/lib/types';

interface SidebarProps {
  phases: Phase[];
  selectedTopic: Topic | null;
  onTopicSelect: (topic: Topic) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  getTotalProgress: () => { completed: number; total: number; percentage: number };
  getPhaseProgress: (phase: Phase) => { completed: number; total: number; percentage: number };
}

export default function Sidebar({
  phases,
  selectedTopic,
  onTopicSelect,
  collapsed,
  onToggleCollapse,
  searchTerm,
  onSearchChange,
  getTotalProgress,
  getPhaseProgress
}: SidebarProps) {
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set(['phase1']));

  const togglePhase = (phaseId: string) => {
    const newExpanded = new Set(expandedPhases);
    if (newExpanded.has(phaseId)) {
      newExpanded.delete(phaseId);
    } else {
      newExpanded.add(phaseId);
    }
    setExpandedPhases(newExpanded);
  };

  const totalProgress = getTotalProgress();

  const filteredPhases = phases.map(phase => ({
    ...phase,
    topics: phase.topics.filter(topic =>
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.filename.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(phase => searchTerm === '' || phase.topics.length > 0);

  if (collapsed) {
    return (
      <div className="w-12 bg-dark-200 border-r border-dark-300 flex flex-col">
        <div className="p-3 border-b border-dark-300">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-dark-200 border-r border-dark-300 flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-dark-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <h1 className="text-lg font-semibold">FAANG Interview Prep</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Progress</span>
            <span className="text-gray-300">{totalProgress.completed}/{totalProgress.total} chapters</span>
          </div>
          <Progress value={totalProgress.percentage} className="w-full" />
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search topics..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-10 bg-dark-300 border-dark-400 text-gray-300 placeholder-gray-500 focus:border-green-500 focus:ring-green-500"
          />
          <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {filteredPhases.map((phase) => {
          const phaseProgress = getPhaseProgress(phase);
          const isExpanded = expandedPhases.has(phase.id);

          return (
            <div key={phase.id} className="border-b border-dark-300">
              <Button
                variant="ghost"
                onClick={() => togglePhase(phase.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-dark-300 transition-colors group h-auto"
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-white" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white" />
                  )}
                  <span className="font-medium group-hover:text-white text-left">{phase.title}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {phaseProgress.completed}/{phaseProgress.total}
                </span>
              </Button>

              {isExpanded && (
                <div className="pb-2">
                  {phase.topics.map((topic) => (
                    <Button
                      key={topic.id}
                      variant="ghost"
                      onClick={() => onTopicSelect(topic)}
                      className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-dark-300 transition-colors group h-auto justify-start ${
                        selectedTopic?.id === topic.id ? 'bg-dark-300 border-r-2 border-green-500' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Completion indicator */}
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          topic.completed ? 'bg-green-500' : 'bg-gray-600'
                        }`}></div>
                        
                        <span className={`text-sm truncate ${
                          selectedTopic?.id === topic.id ? 'text-green-400' : 'text-gray-300 group-hover:text-white'
                        }`}>
                          {topic.title}
                        </span>
                      </div>

                      {/* Icons */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {topic.starred && (
                          <div className="w-3 h-3">
                            <svg className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                        )}
                        
                        {topic.completed && (
                          <div className="w-3 h-3">
                            <svg className="w-3 h-3 text-green-500 fill-current" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}