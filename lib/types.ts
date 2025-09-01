export interface Topic {
  id: string;
  title: string;
  filename: string;
  phase: string;
  order_index: number;
  completed: boolean;
  starred: boolean;
}

export interface Phase {
  id: string;
  title: string;
  description: string;
  order_index: number;
  topics: Topic[];
}

export interface Progress {
  completedTopics: number;
  totalTopics: number;
  percentage: number;
}