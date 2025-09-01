'use client'

import ContentView from '@/components/ContentView'
import Sidebar from '@/components/Sidebar'
import { fetchAllTopics, groupTopicsIntoPhases } from '@/lib/content'
import { Phase, Topic } from '@/lib/types'
import { useEffect, useState } from 'react'

export default function Home() {
	const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')
	const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set())
	const [starredTopics, setStarredTopics] = useState<Set<string>>(new Set())
	const [phases, setPhases] = useState<Phase[]>([])
	const [loading, setLoading] = useState(true)

	// Load topics dynamically
	useEffect(() => {
		const loadTopics = async () => {
			try {
				setLoading(true)
				const topics = await fetchAllTopics()
				const groupedPhases = groupTopicsIntoPhases(topics)
				setPhases(groupedPhases)

				// Set default first topic
				if (groupedPhases[0]?.topics[0]) {
					setSelectedTopic(groupedPhases[0].topics[0])
				}
			} catch (error) {
				console.error('Error loading topics:', error)
			} finally {
				setLoading(false)
			}
		}

		loadTopics()
	}, [])

	// Load progress from localStorage
	useEffect(() => {
		const savedCompleted = localStorage.getItem('completedTopics')
		const savedStarred = localStorage.getItem('starredTopics')

		if (savedCompleted) {
			setCompletedTopics(new Set(JSON.parse(savedCompleted)))
		}

		if (savedStarred) {
			setStarredTopics(new Set(JSON.parse(savedStarred)))
		}
	}, [])

	// Save progress to localStorage
	useEffect(() => {
		localStorage.setItem(
			'completedTopics',
			JSON.stringify([...completedTopics]),
		)
	}, [completedTopics])

	useEffect(() => {
		localStorage.setItem('starredTopics', JSON.stringify([...starredTopics]))
	}, [starredTopics])

	const toggleComplete = (topicId: string) => {
		const newCompleted = new Set(completedTopics)
		if (newCompleted.has(topicId)) {
			newCompleted.delete(topicId)
		} else {
			newCompleted.add(topicId)
		}
		setCompletedTopics(newCompleted)
	}

	const toggleStar = (topicId: string) => {
		const newStarred = new Set(starredTopics)
		if (newStarred.has(topicId)) {
			newStarred.delete(topicId)
		} else {
			newStarred.add(topicId)
		}
		setStarredTopics(newStarred)
	}

	const getTotalProgress = () => {
		const total = phases.reduce((acc, phase) => acc + phase.topics.length, 0)
		const completed = completedTopics.size
		return {
			completed,
			total,
			percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
		}
	}

	const getPhaseProgress = (phase: Phase) => {
		const total = phase.topics.length
		const completed = phase.topics.filter(topic =>
			completedTopics.has(topic.id),
		).length
		return {
			completed,
			total,
			percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
		}
	}

	// Update topic completion status for rendering
	const phasesWithProgress = phases.map(phase => ({
		...phase,
		topics: phase.topics.map(topic => ({
			...topic,
			completed: completedTopics.has(topic.id),
			starred: starredTopics.has(topic.id),
		})),
	}))

	if (loading) {
		return (
			<div className="flex h-screen bg-dark-100 items-center justify-center">
				<div className="text-center">
					<div className="text-xl text-white mb-2">
						Loading FAANG Interview Prep
					</div>
					<div className="text-gray-400">Discovering content...</div>
				</div>
			</div>
		)
	}

	return (
		<div className="flex h-screen bg-dark-100">
			<Sidebar
				phases={phasesWithProgress}
				selectedTopic={selectedTopic}
				onTopicSelect={setSelectedTopic}
				collapsed={sidebarCollapsed}
				onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
				searchTerm={searchTerm}
				onSearchChange={setSearchTerm}
				getTotalProgress={getTotalProgress}
				getPhaseProgress={getPhaseProgress}
			/>

			<main className={`flex-1 transition-all duration-300`}>
				{selectedTopic && (
					<ContentView
						topic={selectedTopic}
						isCompleted={completedTopics.has(selectedTopic.id)}
						isStarred={starredTopics.has(selectedTopic.id)}
						onToggleComplete={() => toggleComplete(selectedTopic.id)}
						onToggleStar={() => toggleStar(selectedTopic.id)}
						phases={phasesWithProgress}
						onTopicSelect={setSelectedTopic}
					/>
				)}
			</main>
		</div>
	)
}
