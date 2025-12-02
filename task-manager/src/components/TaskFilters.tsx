import React from 'react';
import { Task, TaskFilter, TaskSortBy, SortOrder } from '../types/task';

interface TaskFiltersProps {
  filter: TaskFilter; 
  onFilterChange: (filter: TaskFilter) => void;
  sortBy: TaskSortBy;
  onSortByChange: (sortBy: TaskSortBy) => void;
  sortOrder: SortOrder;
  onSortOrderChange: (order: SortOrder) => void;
  tasks: Task[];
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  filter,
  onFilterChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  tasks,
}) => {
  // Get unique categories from tasks
  const categories = Array.from(new Set(tasks.map(task => task.category).filter(Boolean)));

  const handleStatusChange = (status: 'all' | 'completed' | 'pending') => {
    onFilterChange({ ...filter, status });
  };

  const handlePriorityChange = (priority: 'low' | 'medium' | 'high' | '') => {
    onFilterChange({ 
      ...filter, 
      priority: priority || undefined 
    });
  };

  const handleCategoryChange = (category: string) => {
    onFilterChange({ 
      ...filter, 
      category: category || undefined 
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Filters & Sorting</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <div className="flex space-x-2">
            {(['all', 'pending', 'completed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter.status === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Priority Filter */}
        <div>
          <label htmlFor="priority-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <select
            id="priority-filter"
            value={filter.priority || ''}
            onChange={(e) => handlePriorityChange(e.target.value as 'low' | 'medium' | 'high' | '')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            id="category-filter"
            value={filter.category || ''}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <div className="flex space-x-2">
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as TaskSortBy)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="createdAt">Created Date</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="title">Title</option>
            </select>
            <button
              onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              {sortOrder === 'asc' ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {(filter.status !== 'all' || filter.priority || filter.category) && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-200">
          <span className="text-sm text-gray-600">Active filters:</span>
          
          {filter.status !== 'all' && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              Status: {filter.status}
            </span>
          )}
          
          {filter.priority && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
              Priority: {filter.priority}
            </span>
          )}
          
          {filter.category && (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
              Category: {filter.category}
            </span>
          )}
          
          <button
            onClick={() => onFilterChange({ status: 'all' })}
            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs transition-colors"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskFilters;