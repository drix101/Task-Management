import { Task, TaskFilter, TaskSortBy, SortOrder } from '../types/task';

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const createTask = (
  title: string,
  description?: string,
  priority: 'low' | 'medium' | 'high' = 'medium',
  dueDate?: Date,
  category?: string
): Task => {
  const now = new Date();
  return {
    id: generateId(),
    title,
    description,
    completed: false,
    priority, 
    dueDate,
    createdAt: now,
    updatedAt: now,
    category,
  };
};

export const filterTasks = (tasks: Task[], filter: TaskFilter): Task[] => {
  return tasks.filter(task => {
    if (filter.status === 'completed' && !task.completed) return false;
    if (filter.status === 'pending' && task.completed) return false;
    if (filter.priority && task.priority !== filter.priority) return false;
    if (filter.category && task.category !== filter.category) return false;
    return true;
  });
};

export const sortTasks = (tasks: Task[], sortBy: TaskSortBy, order: SortOrder): Task[] => {
  return [...tasks].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'createdAt':
        comparison = a.createdAt.getTime() - b.createdAt.getTime();
        break;
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) comparison = 0;
        else if (!a.dueDate) comparison = 1;
        else if (!b.dueDate) comparison = -1;
        else comparison = a.dueDate.getTime() - b.dueDate.getTime();
        break;
      case 'priority':
        const priorityOrder = { low: 1, medium: 2, high: 3 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
    }
    
    return order === 'asc' ? comparison : -comparison;
  });
};

export const getPriorityColor = (priority: 'low' | 'medium' | 'high'): string => {
  switch (priority) {
    case 'high':
      return 'text-red-600 bg-red-100';
    case 'medium':
      return 'text-yellow-600 bg-yellow-100';
    case 'low':
      return 'text-green-600 bg-green-100';
  }
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};