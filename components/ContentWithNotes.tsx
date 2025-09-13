'use client';

import { useState, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import TextSelectionHandler from './TextSelectionHandler';
import NoteModal from './NoteModal';
import NoteIndicator from './NoteIndicator';

interface Note {
  id: number;
  selected_text: string;
  note_content: string;
  position_data?: any;
  created_at: string;
  updated_at: string;
}

interface ContentWithNotesProps {
  content: string;
  lessonId: string;
}

export default function ContentWithNotes({ content, lessonId }: ContentWithNotesProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [currentNote, setCurrentNote] = useState<Note | null>(null);

  useEffect(() => {
    fetchNotes();
  }, [lessonId]);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`/api/notes?lessonId=${encodeURIComponent(lessonId)}`);
      const data = await response.json();
      if (data.notes) {
        setNotes(data.notes);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleTakeNote = (text: string, position: DOMRect) => {
    setSelectedText(text);
    setCurrentNote(null);
    setIsModalOpen(true);
  };

  const handleNoteClick = (note: Note) => {
    setSelectedText(note.selected_text);
    setCurrentNote(note);
    setIsModalOpen(true);
  };

  const handleSaveNote = async (noteContent: string) => {
    try {
      if (currentNote) {
        // Update existing note
        const response = await fetch('/api/notes', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            noteId: currentNote.id,
            noteContent: noteContent
          })
        });

        if (response.ok) {
          fetchNotes(); // Refresh notes
        }
      } else {
        // Create new note
        const response = await fetch('/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lessonId: lessonId,
            selectedText: selectedText,
            noteContent: noteContent,
            positionData: null // We'll use text matching instead of position data
          })
        });

        if (response.ok) {
          fetchNotes(); // Refresh notes
        }
      }
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    try {
      const response = await fetch(`/api/notes?noteId=${noteId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchNotes(); // Refresh notes
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  // Enhanced content with note indicators
  const contentWithNotes = useMemo(() => {
    if (!notes.length) return content;

    let enhancedContent = content;

    // Sort notes by selected text length (longest first) to avoid conflicts
    const sortedNotes = [...notes].sort((a, b) => b.selected_text.length - a.selected_text.length);

    sortedNotes.forEach((note) => {
      const searchText = note.selected_text;
      // Find the first occurrence of the selected text
      const index = enhancedContent.indexOf(searchText);

      if (index !== -1) {
        // Replace with the text plus a note indicator marker
        const beforeText = enhancedContent.substring(0, index);
        const afterText = enhancedContent.substring(index + searchText.length);

        enhancedContent = beforeText + searchText + `{{NOTE_${note.id}}}` + afterText;
      }
    });

    return enhancedContent;
  }, [content, notes]);

  const components = {
    ...{
      h1: ({children}: any) => <h1 className="text-4xl font-bold mb-8 text-white">{children}</h1>,
      h2: ({children}: any) => <h2 className="text-2xl font-semibold mb-6 mt-8 text-white border-b border-gray-700 pb-3">{children}</h2>,
      h3: ({children}: any) => <h3 className="text-xl font-semibold mb-4 mt-6 text-white">{children}</h3>,
      h4: ({children}: any) => <h4 className="text-lg font-semibold mb-3 mt-5 text-white">{children}</h4>,
      p: ({children}: any) => {
        // Process paragraph content for note indicators
        if (typeof children === 'string') {
          const parts = children.split(/(\{\{NOTE_\d+\}\})/);
          return (
            <p className="mb-6 text-gray-300 leading-relaxed text-lg">
              {parts.map((part: string, index: number) => {
                const noteMatch = part.match(/\{\{NOTE_(\d+)\}\}/);
                if (noteMatch) {
                  const noteId = parseInt(noteMatch[1]);
                  const note = notes.find(n => n.id === noteId);
                  if (note) {
                    return (
                      <NoteIndicator
                        key={`note-${noteId}-${index}`}
                        note={note}
                        onClick={() => handleNoteClick(note)}
                      />
                    );
                  }
                }
                return part;
              })}
            </p>
          );
        }
        return <p className="mb-6 text-gray-300 leading-relaxed text-lg">{children}</p>;
      },
      ul: ({children}: any) => <ul className="mb-6 ml-6 space-y-3">{children}</ul>,
      ol: ({children}: any) => <ol className="mb-6 ml-6 space-y-3">{children}</ol>,
      li: ({children}: any) => <li className="text-gray-300 text-lg">{children}</li>,
      code: ({inline, children, className, ...props}: any) => {
        if (inline) {
          return (
            <code className="bg-gray-800 px-3 py-1 rounded-md text-green-400 text-lg font-mono font-medium border border-gray-600">
              {children}
            </code>
          );
        }
        return (
          <code className={className} {...props}>
            {children}
          </code>
        );
      },
      pre: ({children}: any) => (
        <pre className="bg-gray-900 p-6 rounded-lg overflow-x-auto mb-6 border border-gray-600 shadow-lg">
          {children}
        </pre>
      ),
      blockquote: ({children}: any) => <blockquote className="border-l-4 border-blue-500 pl-6 italic text-gray-400 mb-6 bg-gray-800/30 py-4 rounded-r-lg">{children}</blockquote>,
      table: ({children}: any) => <table className="w-full border-collapse mb-6 border border-gray-700 rounded-lg overflow-hidden">{children}</table>,
      th: ({children}: any) => <th className="border border-gray-700 px-4 py-3 text-left bg-gray-800 font-semibold text-white">{children}</th>,
      td: ({children}: any) => <td className="border border-gray-700 px-4 py-3 text-gray-300">{children}</td>,
      a: ({children, href}: any) => <a href={href} className="text-blue-400 hover:text-blue-300 underline font-medium">{children}</a>,
      strong: ({children}: any) => <strong className="font-semibold text-white">{children}</strong>,
    }
  };

  return (
    <>
      <TextSelectionHandler onTakeNote={handleTakeNote}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          className="prose prose-invert prose-lg max-w-none"
          components={components}
        >
          {contentWithNotes}
        </ReactMarkdown>
      </TextSelectionHandler>

      <NoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedText={selectedText}
        lessonId={lessonId}
        existingNote={currentNote}
        onSave={handleSaveNote}
        onDelete={currentNote ? handleDeleteNote : undefined}
      />
    </>
  );
}