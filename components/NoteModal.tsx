'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Edit3, Eye, Save, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import { cn } from '../lib/utils'

interface Note {
	id: number
	selected_text: string
	note_content: string
	created_at: string
	updated_at: string
}

interface NoteModalProps {
	isOpen: boolean
	onClose: () => void
	selectedText: string
	lessonId: string
	existingNote?: Note | null
	onSave: (noteContent: string) => Promise<void>
	onDelete?: (noteId: number) => Promise<void>
}

export default function NoteModal({
	isOpen,
	onClose,
	selectedText,
	lessonId,
	existingNote,
	onSave,
	onDelete,
}: NoteModalProps) {
	const [noteContent, setNoteContent] = useState('')
	const [isSaving, setIsSaving] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)
	const [activeTab, setActiveTab] = useState('write')
	const [readingMode, setReadingMode] = useState(false)

	useEffect(() => {
		if (isOpen) {
			setNoteContent(existingNote?.note_content || '')
			// Set tab based on whether it's a new note or editing existing
			setActiveTab(existingNote ? 'preview' : 'write')
		}
	}, [isOpen, existingNote])

	const handleSave = async () => {
		if (!noteContent.trim()) return

		setIsSaving(true)
		try {
			await onSave(noteContent.trim())
			setNoteContent('')
			onClose()
		} catch (error) {
			console.error('Error saving note:', error)
		} finally {
			setIsSaving(false)
		}
	}

	const handleDelete = async () => {
		if (!existingNote || !onDelete) return

		setIsDeleting(true)
		try {
			await onDelete(existingNote.id)
			onClose()
		} catch (error) {
			console.error('Error deleting note:', error)
		} finally {
			setIsDeleting(false)
		}
	}

	const handleClose = () => {
		setNoteContent('')
		setActiveTab('write')
		onClose()
	}

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-[700px] lg:max-w-[800px] max-h-[90vh] bg-slate-800 border-slate-700">
				<DialogHeader className="pb-3">
					<DialogTitle className="text-lg text-white">
						{existingNote ? 'Edit Note' : 'Take Note'}
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-4">
					{/* Note Content with MDX Editor */}
					<div>
						{existingNote ? (
							// For existing notes: show tabs with preview as default
							<Tabs
								value={activeTab}
								onValueChange={setActiveTab}
								className="w-full"
							>
								{!readingMode && (
									<div className="space-y-2">
										<div className="bg-slate-700/50 p-3 rounded-md border border-slate-600">
											<p className="text-xs text-slate-400 mb-2">Note on:</p>
											<p className="text-slate-300 italic text-sm leading-relaxed max-h-24 overflow-y-auto">
												"{selectedText}"
											</p>
										</div>
										<TabsList className="grid w-full grid-cols-2 bg-slate-700/50">
											<TabsTrigger
												value="preview"
												className="data-[state=active]:bg-slate-600 data-[state=active]:text-white text-slate-300"
											>
												<Eye className="w-4 h-4 mr-2" />
												Preview
											</TabsTrigger>
											<TabsTrigger
												value="write"
												className="data-[state=active]:bg-slate-600 data-[state=active]:text-white text-slate-300"
											>
												<Edit3 className="w-4 h-4 mr-2" />
												Edit
											</TabsTrigger>
										</TabsList>
									</div>
								)}

								<TabsContent value="write" className="mt-3">
									<Textarea
										id="note-content"
										placeholder="Write your note using Markdown/MDX...

Examples:
# Heading
**Bold text**
*Italic text*
- List item
```javascript
code block
```
> Blockquote"
										value={noteContent}
										onChange={e => setNoteContent(e.target.value)}
										className="min-h-[280px] bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 text-sm font-mono leading-relaxed resize-none"
										autoFocus
									/>
								</TabsContent>

								<div className="relative">
									<TabsContent value="preview" className="mt-3">
										<div
											className={cn(
												'h-[280px] bg-slate-700/50 border border-slate-600 rounded-md p-4 overflow-y-auto',
												readingMode ? 'h-[70vh]' : '',
											)}
										>
											{noteContent.trim() ? (
												<div
													className="prose prose-invert prose-lg max-w-none
                                    prose-headings:text-white prose-headings:font-bold
                                    prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-5
                                    prose-strong:text-white prose-strong:font-semibold
                                    prose-code:bg-slate-800 prose-code:text-green-400 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-md prose-code:font-medium
                                    prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-600 prose-pre:overflow-x-auto prose-pre:text-md
                                    prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-slate-800/30 prose-blockquote:pl-3 prose-blockquote:py-2
                                    prose-ul:text-slate-300 prose-ol:text-slate-300 prose-ul:mb-5 prose-ol:mb-5
                                    prose-li:text-slate-300 prose-li:my-1
                                    prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline"
												>
													<ReactMarkdown
														remarkPlugins={[remarkGfm]}
														rehypePlugins={[rehypeHighlight]}
														components={{
															code: ({
																inline,
																children,
																className,
																...props
															}: any) => {
																if (inline) {
																	return (
																		<code className="bg-slate-800 text-green-400 px-2 py-1 rounded text-xs font-medium font-mono">
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
																<pre className="bg-slate-900 p-3 rounded overflow-x-auto border border-slate-600">
																	{children}
																</pre>
															),
														}}
													>
														{noteContent}
													</ReactMarkdown>
												</div>
											) : (
												<p className="text-slate-400 italic text-center py-8">
													Nothing to preview. Start writing in the Write tab to
													see your formatted note here.
												</p>
											)}
										</div>
									</TabsContent>
									{activeTab === 'preview' && (
										<Button
											variant={readingMode ? 'default' : 'outline'}
											size="icon"
											className="absolute bottom-2 right-2"
											onClick={() => setReadingMode(!readingMode)}
										>
											<Eye />
										</Button>
									)}
								</div>
							</Tabs>
						) : (
							// For new notes: show only write interface
							<Textarea
								id="note-content-new"
								placeholder="Write your note using Markdown/MDX...

Examples:
# Heading
**Bold text**
*Italic text*
- List item
```javascript
code block
```
> Blockquote"
								value={noteContent}
								onChange={e => setNoteContent(e.target.value)}
								className="min-h-[280px] bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 text-sm font-mono leading-relaxed resize-none"
								autoFocus
							/>
						)}
					</div>
				</div>

				<DialogFooter className="flex items-center justify-between gap-y-2">
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

					{activeTab === 'write' && (
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
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
