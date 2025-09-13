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
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
        <TooltipContent className="bg-slate-800 border-slate-700 text-slate-200 max-w-md">
          <div className="space-y-3">
            <div>
              <p className="text-xs text-slate-400 mb-2">Selected text:</p>
              <p className="text-sm italic leading-relaxed">"{truncateText(note.selected_text, 80)}"</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-2">Note:</p>
              <div className="text-sm leading-relaxed prose prose-invert prose-xs max-w-none prose-p:mb-2 prose-headings:text-white prose-code:text-green-400 prose-code:bg-slate-700 prose-code:px-1 prose-code:rounded prose-strong:text-white">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {truncateText(note.note_content, 150)}
                </ReactMarkdown>
              </div>
            </div>
            <p className="text-xs text-slate-500 pt-2 border-t border-slate-600">
              {formatDate(note.updated_at)}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}