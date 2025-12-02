import type { Task, TaskFilter, TaskSort, Priority } from '../types/task';

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const createTask = (
  title: string,
  notes?: string,
  priority: Priority = 'medium',
  due?: number | null
): Task => {
  return {
    id: generateId(),
    title,
    notes: notes?.trim() || '',
    completed: false,
    priority,
    createdAt: Date.now(),
    due: due ?? null,
  };
};

// Filters by union TaskFilter: "all" | "active" | "completed"
export const filterTasks = (tasks: Task[], filter: TaskFilter): Task[] => {
  switch (filter) {
    case 'active':
      return tasks.filter(t => !t.completed);
    case 'completed':
      return tasks.filter(t => t.completed);
    case 'all':
    default:
      return tasks;
  }
};

// Sorts using TaskSort: "createdDesc" | "createdAsc" | "dueSoon"
export const sortTasks = (tasks: Task[], sortBy: TaskSort): Task[] => {
  const out = [...tasks];
  switch (sortBy) {
    case 'createdDesc':
      out.sort((a, b) => b.createdAt - a.createdAt);
      break;
    case 'createdAsc':
      out.sort((a, b) => a.createdAt - b.createdAt);
      break;
    case 'dueSoon':
      out.sort((a, b) => (a.due ?? Number.POSITIVE_INFINITY) - (b.due ?? Number.POSITIVE_INFINITY));
      break;
  }
  return out;
};

export const getPriorityColor = (priority: Priority): string => {
  switch (priority) {
    case 'high':
      return 'text-red-600 bg-red-100';
    case 'medium':
      return 'text-yellow-600 bg-yellow-100';
    case 'low':
      return 'text-green-600 bg-green-100';
  }
};

// Accepts a Date or a timestamp (number)
export const formatDate = (date: Date | number): string => {
  const d = typeof date === 'number' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};