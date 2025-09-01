import { Phase, Topic } from './types'

export const phases: Phase[] = [
	{
		id: 'phase1',
		title: 'English Communication Foundation',
		description: 'Master technical communication and interview skills',
		order_index: 1,
		topics: [
			{
				id: '01-technical-english',
				title: 'Technical English Sentence Builder',
				filename: '01-technical-english-sentence-builder.md',
				phase: 'phase1',
				order_index: 1,
				completed: false,
				starred: false,
			},
			{
				id: '02-interview-conversations',
				title: 'Interview Conversation Scripts',
				filename: '02-interview-conversation-scripts.md',
				phase: 'phase1',
				order_index: 2,
				completed: false,
				starred: false,
			},
			{
				id: '03-code-explanation',
				title: 'Code Explanation Framework',
				filename: '03-code-explanation-framework.md',
				phase: 'phase1',
				order_index: 3,
				completed: false,
				starred: false,
			},
			{
				id: '04-behavioral-answers',
				title: 'Behavioral Answer Templates',
				filename: '04-behavioral-answer-templates.md',
				phase: 'phase1',
				order_index: 4,
				completed: false,
				starred: false,
			},
			{
				id: '07-debugging-testing',
				title: 'Debugging and Testing Framework',
				filename: '07-debugging-and-testing-framework.md',
				phase: 'phase1',
				order_index: 5,
				completed: false,
				starred: false,
			},
		],
	},
	{
		id: 'phase2',
		title: 'Problem-Solving Mental Framework',
		description: 'Build systematic approach to algorithmic thinking',
		order_index: 2,
		topics: [
			{
				id: '05-problem-solving',
				title: 'Universal Problem-Solving Method',
				filename: '05-universal-problem-solving-method.md',
				phase: 'phase2',
				order_index: 1,
				completed: false,
				starred: false,
			},
			{
				id: '06-pattern-recognition',
				title: 'Pattern Recognition Visual Guide',
				filename: '06-pattern-recognition-visual-guide.md',
				phase: 'phase2',
				order_index: 2,
				completed: false,
				starred: false,
			},
		],
	},
	{
		id: 'phase3',
		title: 'Core Data Structures',
		description: 'Master fundamental data structures',
		order_index: 3,
		topics: [
			{
				id: '09-arrays-strings',
				title: 'Arrays and Strings Complete Guide',
				filename: '09-arrays-and-strings-complete-guide.md',
				phase: 'phase3',
				order_index: 1,
				completed: false,
				starred: false,
			},
			{
				id: '10-linked-lists',
				title: 'Linked Lists from Zero',
				filename: '10-linked-lists-from-zero.md',
				phase: 'phase3',
				order_index: 2,
				completed: false,
				starred: false,
			},
			{
				id: '11-stacks-queues',
				title: 'Stacks and Queues Practical',
				filename: '11-stacks-and-queues-practical.md',
				phase: 'phase3',
				order_index: 3,
				completed: false,
				starred: false,
			},
			{
				id: '12-trees-graphs',
				title: 'Trees and Graphs Fundamentals',
				filename: '12-trees-and-graphs-fundamentals.md',
				phase: 'phase3',
				order_index: 4,
				completed: false,
				starred: false,
			},
			{
				id: '13-hash-tables',
				title: 'Hash Tables and Sets Mastery',
				filename: '13-hash-tables-and-sets-mastery.md',
				phase: 'phase3',
				order_index: 5,
				completed: false,
				starred: false,
			},
		],
	},
	{
		id: 'phase4',
		title: 'Essential Algorithms',
		description: 'Core sorting and searching algorithms',
		order_index: 4,
		topics: [
			{
				id: '14-sorting-algorithms',
				title: 'Sorting Algorithms Complete',
				filename: '14-sorting-algorithms-complete.md',
				phase: 'phase4',
				order_index: 1,
				completed: false,
				starred: false,
			},
			{
				id: '15-searching-algorithms',
				title: 'Searching Algorithms Master',
				filename: '15-searching-algorithms-master.md',
				phase: 'phase4',
				order_index: 2,
				completed: false,
				starred: false,
			},
		],
	},
	{
		id: 'phase5',
		title: 'Pattern-Based Problem Solving',
		description: 'Master the most important coding patterns',
		order_index: 5,
		topics: [
			{
				id: '18-two-pointers',
				title: 'Two Pointers Pattern',
				filename: '18-two-pointers-pattern.md',
				phase: 'phase5',
				order_index: 1,
				completed: false,
				starred: false,
			},
			{
				id: '19-sliding-window',
				title: 'Sliding Window Pattern',
				filename: '19-sliding-window-pattern.md',
				phase: 'phase5',
				order_index: 2,
				completed: false,
				starred: false,
			},
			{
				id: '20-fast-slow-pointers',
				title: 'Fast-Slow Pointers Pattern',
				filename: '20-fast-slow-pointers-pattern.md',
				phase: 'phase5',
				order_index: 3,
				completed: false,
				starred: false,
			},
			{
				id: '21-merge-intervals',
				title: 'Merge Intervals Pattern',
				filename: '21-merge-intervals-pattern.md',
				phase: 'phase5',
				order_index: 4,
				completed: false,
				starred: false,
			},
			{
				id: '22-cyclic-sort',
				title: 'Cyclic Sort Pattern',
				filename: '22-cyclic-sort-pattern.md',
				phase: 'phase5',
				order_index: 5,
				completed: false,
				starred: false,
			},
		],
	},
	{
		id: 'phase6',
		title: 'Advanced Patterns',
		description: 'Dynamic programming and advanced techniques',
		order_index: 6,
		topics: [
			{
				id: '28-dynamic-programming',
				title: 'Dynamic Programming Patterns',
				filename: '28-dynamic-programming-patterns.md',
				phase: 'phase6',
				order_index: 1,
				completed: false,
				starred: false,
			},
			{
				id: '29-greedy-algorithms',
				title: 'Greedy Algorithms Pattern',
				filename: '29-greedy-algorithms-pattern.md',
				phase: 'phase6',
				order_index: 2,
				completed: false,
				starred: false,
			},
		],
	},
]

// Dynamic content loading functions
export async function fetchTopicContent(
	topicId: string,
	fileName: string = 'main.md',
): Promise<string> {
	try {
		const response = await fetch(`/api/content/${topicId}/${fileName}`)

		if (!response.ok) {
			throw new Error(`Failed to fetch content: ${response.statusText}`)
		}

		const data = await response.json()
		return data.content
	} catch (error) {
		console.error(`Error fetching content for ${topicId}/${fileName}:`, error)
		return `# Content Not Found\n\nUnable to load content for this topic.`
	}
}

export async function fetchTopicFiles(
	topicId: string,
): Promise<Array<{ name: string; title: string }>> {
	try {
		const response = await fetch('/api/content/list-files', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ topicId }),
		})

		if (!response.ok) {
			throw new Error(`Failed to fetch files: ${response.statusText}`)
		}

		const data = await response.json()
		return data.files || []
	} catch (error) {
		console.error(`Error fetching files for ${topicId}:`, error)
		return []
	}
}

export async function fetchAllTopics(): Promise<Topic[]> {
	try {
		const response = await fetch('/api/topics')

		if (!response.ok) {
			throw new Error(`Failed to fetch topics: ${response.statusText}`)
		}

		const data = await response.json()
		return data.topics || []
	} catch (error) {
		console.error('Error fetching topics:', error)
		return []
	}
}

// Group topics into phases
export function groupTopicsIntoPhases(topics: Topic[]): Phase[] {
	const phaseMap = new Map<string, Phase>()

	// Initialize phases
	const phaseInfo = {
		phase1: {
			title: 'English Communication Foundation',
			description: 'Master technical communication and interview skills',
			order_index: 1,
		},
		phase2: {
			title: 'Problem-Solving Mental Framework',
			description: 'Build systematic approach to algorithmic thinking',
			order_index: 2,
		},
		phase3: {
			title: 'Core Data Structures',
			description: 'Master fundamental data structures',
			order_index: 3,
		},
		phase4: {
			title: 'Essential Algorithms',
			description: 'Core sorting and searching algorithms',
			order_index: 4,
		},
		phase5: {
			title: 'Pattern-Based Problem Solving',
			description: 'Master the most important coding patterns',
			order_index: 5,
		},
		phase6: {
			title: 'Advanced Patterns',
			description: 'Dynamic programming and advanced techniques',
			order_index: 6,
		},
	}

	// Group topics by phase
	topics.forEach(topic => {
		const phaseId = topic.phase
		if (!phaseMap.has(phaseId)) {
			const info = phaseInfo[phaseId as keyof typeof phaseInfo] || {
				title: `Phase ${phaseId}`,
				description: '',
				order_index: 999,
			}

			phaseMap.set(phaseId, {
				id: phaseId,
				...info,
				topics: [],
			})
		}

		phaseMap.get(phaseId)!.topics.push(topic)
	})

	// Convert to array and sort
	const phases = Array.from(phaseMap.values())
	phases.sort((a, b) => a.order_index - b.order_index)

	// Sort topics within each phase
	phases.forEach(phase => {
		phase.topics.sort((a, b) => a.order_index - b.order_index)
	})

	return phases
}

// Legacy function for backward compatibility
export function getTopicContentSync(filename: string): string {
	const title = filename
		.replace('.md', '')
		.split('-')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ')

	return `# ${title}

Content is being loaded dynamically from the content directory.

This topic will show the latest content from your markdown files automatically.

## Available Files

Files in this topic directory will be auto-discovered and listed here.

---

*Note: Content is now loaded dynamically from the \`content/${filename.replace(
		'/main.md',
		'',
	)}\` directory.*`
}
