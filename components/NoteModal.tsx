'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Save, X, Trash2 } from 'lucide-react';

interface Note {
  id: number;
  selected_text: string;
  note_content: string;
  created_at: string;
  updated_at: string;
}

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedText: string;
  lessonId: string;
  existingNote?: Note | null;
  onSave: (noteContent: string) => Promise<void>;
  onDelete?: (noteId: number) => Promise<void>;
}

export default function NoteModal({
  isOpen,
  onClose,
  selectedText,
  lessonId,
  existingNote,
  onSave,
  onDelete
}: NoteModalProps) {
  const [noteContent, setNoteContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNoteContent(existingNote?.note_content || '');
    }
  }, [isOpen, existingNote]);

  const handleSave = async () => {
    if (!noteContent.trim()) return;

    setIsSaving(true);
    try {
      await onSave(noteContent.trim());
      setNoteContent('');
      onClose();
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!existingNote || !onDelete) return;

    setIsDeleting(true);
    try {
      await onDelete(existingNote.id);
      onClose();
    } catch (error) {
      console.error('Error deleting note:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setNoteContent('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] lg:max-w-[800px] bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white">
            {existingNote ? 'Edit Note' : 'Take a Note'}
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            {existingNote ? 'Update your note for the selected text.' : 'Add a note for the selected text.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Selected Text Display */}
          <div className="bg-slate-700/50 p-4 rounded-md border border-slate-600">
            <p className="text-sm text-slate-400 mb-3">Selected text:</p>
            <p className="text-slate-300 italic text-base leading-relaxed max-h-32 overflow-y-auto">
              "{selectedText}"
            </p>
          </div>

          {/* Note Content */}
          <div>
            <label htmlFor="note-content" className="text-sm font-medium text-slate-300 block mb-2">
              Your note:
            </label>
            <Textarea
              id="note-content"
              placeholder="Write your note here..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="min-h-[160px] bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 text-base leading-relaxed"
              autoFocus
            />
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div>
            {existingNote && onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? (
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" />
                )}
                Delete
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleClose}
              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!noteContent.trim() || isSaving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSaving ? (
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {existingNote ? 'Update' : 'Save'} Note
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}