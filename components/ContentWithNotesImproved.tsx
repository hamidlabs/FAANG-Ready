'use client'

import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import TextSelectionHandler from './TextSelectionHandler'
import NoteModal from './NoteModal'

interface Note {
	id: number
	selected_text: string
	note_content: string
	position_data?: any
	created_at: string
	updated_at: string
}

interface ContentWithNotesProps {
	content: string
	lessonId: string
}

export default function ContentWithNotesImproved({
	content,
	lessonId,
}: ContentWithNotesProps) {
	const [notes, setNotes] = useState<Note[]>([])
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [selectedText, setSelectedText] = useState('')
	const [currentNote, setCurrentNote] = useState<Note | null>(null)
	const contentRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		fetchNotes()
	}, [lessonId])

	useEffect(() => {
		if (notes.length > 0 && contentRef.current) {
			// Add a small delay to ensure DOM is ready
			const timeoutId = setTimeout(() => {
				highlightNotedText()
			}, 100)

			return () => clearTimeout(timeoutId)
		}
	}, [notes, content])

	// Re-highlight when modal closes
	useEffect(() => {
		if (!isModalOpen && notes.length > 0 && contentRef.current) {
			const timeoutId = setTimeout(() => {
				highlightNotedText()
			}, 100)

			return () => clearTimeout(timeoutId)
		}
	}, [isModalOpen, notes])

	const fetchNotes = async () => {
		try {
			const response = await fetch(
				`/api/notes?lessonId=${encodeURIComponent(lessonId)}`,
			)
			const data = await response.json()
			if (data.notes) {
				setNotes(data.notes)
			}
		} catch (error) {
			console.error('Error fetching notes:', error)
		}
	}

	const highlightNotedText = () => {
		if (!contentRef.current) return

		// Clear existing highlights first
		const existingHighlights = contentRef.current.querySelectorAll(
			'[data-note-highlight]',
		)
		existingHighlights.forEach(highlight => {
			const parent = highlight.parentNode
			if (parent) {
				parent.replaceChild(
					document.createTextNode(highlight.textContent || ''),
					highlight,
				)
				parent.normalize()
			}
		})

		// Get fresh text nodes after clearing highlights
		const walker = document.createTreeWalker(
			contentRef.current,
			NodeFilter.SHOW_TEXT,
			null,
		)

		const textNodes: Text[] = []
		let node
		while ((node = walker.nextNode())) {
			textNodes.push(node as Text)
		}

		// Sort notes by text length (longest first) to avoid conflicts
		const sortedNotes = [...notes].sort(
			(a, b) => b.selected_text.length - a.selected_text.length,
		)

		sortedNotes.forEach(note => {
			const searchText = note.selected_text.trim()

			for (const textNode of textNodes) {
				const text = textNode.textContent || ''
				const index = text.indexOf(searchText)

				if (index !== -1) {
					// Create highlighted span
					const span = document.createElement('span')
					span.setAttribute('data-note-highlight', note.id.toString())
					span.className =
						'relative bg-yellow-100/20 border-b-2 border-yellow-400/50 cursor-pointer hover:bg-yellow-100/30 transition-colors'
					span.title = `Note: ${note.note_content.substring(0, 100)}${
						note.note_content.length > 100 ? '...' : ''
					}`

					// Split the text node
					const beforeText = text.substring(0, index)
					const highlightedText = text.substring(
						index,
						index + searchText.length,
					)
					const afterText = text.substring(index + searchText.length)

					// Create new text nodes
					const beforeNode = document.createTextNode(beforeText)
					const afterNode = document.createTextNode(afterText)

					// Set the span content
					span.textContent = highlightedText

					// Create note indicator
					const indicator = document.createElement('button')
					indicator.className =
						'absolute -top-2 -right-2 w-4 h-4 bg-yellow-500 text-white text-xs rounded-full flex items-center justify-center hover:bg-yellow-600 transition-colors z-10'
					indicator.innerHTML = '📝'
					indicator.title = 'View note'
					indicator.onclick = e => {
						e.stopPropagation()
						handleNoteClick(note)
					}

					span.appendChild(indicator)

					// Replace the original text node
					const parent = textNode.parentNode
					if (parent) {
						if (beforeText) parent.insertBefore(beforeNode, textNode)
						parent.insertBefore(span, textNode)
						if (afterText) parent.insertBefore(afterNode, textNode)
						parent.removeChild(textNode)
					}

					// Add click handler to the span
					span.onclick = () => handleNoteClick(note)

					break // Only highlight first occurrence
				}
			}
		})
	}

	const handleTakeNote = (text: string, position: DOMRect) => {
		setSelectedText(text)
		setCurrentNote(null)
		setIsModalOpen(true)
	}

	const handleNoteClick = (note: Note) => {
		setSelectedText(note.selected_text)
		setCurrentNote(note)
		setIsModalOpen(true)
	}

	const handleSaveNote = async (noteContent: string) => {
		try {
			if (currentNote) {
				// Update existing note
				const response = await fetch('/api/notes', {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						noteId: currentNote.id,
						noteContent: noteContent,
					}),
				})

				if (response.ok) {
					await fetchNotes() // Refresh notes
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
						positionData: null,
					}),
				})

				if (response.ok) {
					await fetchNotes() // Refresh notes
				}
			}
		} catch (error) {
			console.error('Error saving note:', error)
		}
	}

	const handleDeleteNote = async (noteId: number) => {
		try {
			const response = await fetch(`/api/notes?noteId=${noteId}`, {
				method: 'DELETE',
			})

			if (response.ok) {
				await fetchNotes() // Refresh notes
			}
		} catch (error) {
			console.error('Error deleting note:', error)
		}
	}

	const components = {
		h1: ({ children }: any) => (
			<h1 className="text-4xl font-bold mb-8 text-white">{children}</h1>
		),
		h2: ({ children }: any) => (
			<h2 className="text-2xl font-semibold mb-6 mt-8 text-white border-b border-gray-700 pb-3">
				{children}
			</h2>
		),
		h3: ({ children }: any) => (
			<h3 className="text-xl font-semibold mb-4 mt-6 text-white">{children}</h3>
		),
		h4: ({ children }: any) => (
			<h4 className="text-lg font-semibold mb-3 mt-5 text-white">{children}</h4>
		),
		p: ({ children }: any) => (
			<p className="mb-6 text-gray-300 leading-relaxed text-lg">{children}</p>
		),
		ul: ({ children }: any) => (
			<ul className="mb-6 ml-6 space-y-3">{children}</ul>
		),
		ol: ({ children }: any) => (
			<ol className="mb-6 ml-6 space-y-3">{children}</ol>
		),
		li: ({ children }: any) => (
			<li className="text-gray-300 text-lg">{children}</li>
		),
		code: ({ inline, children, className, ...props }: any) => {
			if (inline) {
				return (
					<code className="bg-gray-800 px-3 py-1 rounded-md text-green-400 text-lg font-mono font-medium border border-gray-600">
						{children}
					</code>
				)
			}
			return (
				<code className={className} {...props}>
					{children}
				</code>
			)
		},
		pre: ({ children }: any) => (
			<pre className="bg-gray-900 p-6 rounded-lg overflow-x-auto mb-6 border border-gray-600 shadow-lg">
				{children}
			</pre>
		),
		blockquote: ({ children }: any) => (
			<blockquote className="border-l-4 border-blue-500 pl-6 italic text-gray-400 mb-6 bg-gray-800/30 py-4 rounded-r-lg">
				{children}
			</blockquote>
		),
		table: ({ children }: any) => (
			<table className="w-full border-collapse mb-6 border border-gray-700 rounded-lg overflow-hidden">
				{children}
			</table>
		),
		th: ({ children }: any) => (
			<th className="border border-gray-700 px-4 py-3 text-left bg-gray-800 font-semibold text-white">
				{children}
			</th>
		),
		td: ({ children }: any) => (
			<td className="border border-gray-700 px-4 py-3 text-gray-300">
				{children}
			</td>
		),
		a: ({ children, href }: any) => (
			<a
				href={href}
				className="text-blue-400 hover:text-blue-300 underline font-medium"
			>
				{children}
			</a>
		),
		strong: ({ children }: any) => (
			<strong className="font-semibold text-white">{children}</strong>
		),
	}

	return (
		<>
			<TextSelectionHandler onTakeNote={handleTakeNote}>
				<div ref={contentRef}>
					<ReactMarkdown
						remarkPlugins={[remarkGfm]}
						rehypePlugins={[rehypeHighlight]}
						className="prose prose-invert prose-lg max-w-none"
						components={components}
					>
						{content}
					</ReactMarkdown>
				</div>
			</TextSelectionHandler>

			<NoteModal
				isOpen={isModalOpen}
				onClose={() => {
					setIsModalOpen(false)
					setCurrentNote(null)
					setSelectedText('')
				}}
				selectedText={selectedText}
				lessonId={lessonId}
				existingNote={currentNote}
				onSave={handleSaveNote}
				onDelete={currentNote ? handleDeleteNote : undefined}
			/>
		</>
	)
}
