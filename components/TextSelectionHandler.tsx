'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { StickyNote } from 'lucide-react';

interface TextSelectionHandlerProps {
  children: ReactNode;
  onTakeNote: (selectedText: string, position: DOMRect) => void;
}

export default function TextSelectionHandler({ children, onTakeNote }: TextSelectionHandlerProps) {
  const [showBubble, setShowBubble] = useState(false);
  const [bubblePosition, setBubblePosition] = useState({ top: 0, left: 0 });
  const [selectedText, setSelectedText] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        setShowBubble(false);
        return;
      }

      const range = selection.getRangeAt(0);
      const text = selection.toString().trim();

      if (text.length === 0) {
        setShowBubble(false);
        return;
      }

      // Check if selection is within our container
      if (containerRef.current && !containerRef.current.contains(range.commonAncestorContainer)) {
        setShowBubble(false);
        return;
      }

      const rect = range.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) {
        setShowBubble(false);
        return;
      }

      setSelectedText(text);

      // Position bubble above the selection
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (containerRect) {
        setBubblePosition({
          top: rect.top - containerRect.top - 50,
          left: rect.left - containerRect.left + (rect.width / 2) - 50
        });
      }

      setShowBubble(true);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (bubbleRef.current && !bubbleRef.current.contains(event.target as Node)) {
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
        }
        setShowBubble(false);
      }
    };

    // Add event listeners
    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('keyup', handleSelection);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('keyup', handleSelection);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTakeNote = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      onTakeNote(selectedText, rect);
    }
    setShowBubble(false);

    // Clear selection
    if (selection) {
      selection.removeAllRanges();
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {children}

      {showBubble && (
        <div
          ref={bubbleRef}
          className="absolute z-50 animate-in fade-in-0 zoom-in-95 duration-200"
          style={{
            top: `${bubblePosition.top}px`,
            left: `${bubblePosition.left}px`,
          }}
        >
          <Button
            onClick={handleTakeNote}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg border-0"
          >
            <StickyNote className="w-4 h-4 mr-2" />
            Take Note
          </Button>
        </div>
      )}
    </div>
  );
}