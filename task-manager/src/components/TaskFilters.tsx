import React from 'react';
import type { TaskFilter, TaskSort } from '../types/task';

interface TaskFiltersProps {
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  sortBy: TaskSort;
  onSortByChange: (sortBy: TaskSort) => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  filter,
  onFilterChange,
  sortBy,
  onSortByChange,
}) => {
  const handleStatusChange = (status: TaskFilter) => {
    onFilterChange(status);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Filters & Sorting</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <div className="flex space-x-2">
            {(['all', 'active', 'completed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as TaskSort)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="createdDesc">Created (Newest first)</option>
            <option value="createdAsc">Created (Oldest first)</option>
            <option value="dueSoon">Due Soon</option>
          </select>
        </div>
      </div>

      {(filter !== 'all') && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-200">
          <span className="text-sm text-gray-600">Active filters:</span>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            Status: {filter}
          </span>
          <button
            onClick={() => onFilterChange('all')}
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