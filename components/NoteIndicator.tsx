'use client';

import { useState } from 'react';
import { StickyNote, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Note {
  id: number;
  selected_text: string;
  note_content: string;
  created_at: string;
  updated_at: string;
}

interface NoteIndicatorProps {
  note: Note;
  onClick: () => void;
}

export default function NoteIndicator({ note, onClick }: NoteIndicatorProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="inline-flex items-center justify-center w-6 h-6 p-0 ml-1
                       bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/40
                       rounded-full transition-all duration-200 group"
          >
            {isHovered ? (
              <Eye className="w-3 h-3 text-yellow-600" />
            ) : (
              <StickyNote className="w-3 h-3 text-yellow-600" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="bg-slate-800 border-slate-700 text-slate-200 max-w-sm">
          <div className="space-y-2">
            <div>
              <p className="text-xs text-slate-400 mb-1">Selected text:</p>
              <p className="text-sm italic">"{truncateText(note.selected_text, 60)}"</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Note:</p>
              <p className="text-sm">{truncateText(note.note_content, 100)}</p>
            </div>
            <p className="text-xs text-slate-500 pt-1 border-t border-slate-600">
              {formatDate(note.updated_at)}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}