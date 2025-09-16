import React from "react";
import useTaskStore from "../store/taskStore";

const Toolbar: React.FC = () => {
  const setFilter = useTaskStore((s) => s.setFilter);
  const setQuery = useTaskStore((s) => s.setQuery);
  const setSortBy = useTaskStore((s) => s.setSortBy);
  const clearCompleted = useTaskStore((s) => s.clearCompleted);
  const tasks = useTaskStore((s) => s.tasks);
  const filter = useTaskStore((s) => s.filter);

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
      {/* Search and Sort Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input 
          placeholder="Search tasks..." 
          onChange={(e) => setQuery(e.target.value)} 
          className="flex-1 p-3 sm:p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 text-base" 
        />
        <select 
          onChange={(e) => setSortBy(e.target.value as any)} 
          className="p-3 sm:p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 text-base sm:w-auto"
        >
          <option value="createdDesc">📅 Newest First</option>
          <option value="createdAsc">📅 Oldest First</option>
          <option value="dueSoon">⏰ Due Soon</option>
        </select>
      </div>

      {/* Filter and Actions Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Filter buttons */}
        <div className="flex bg-gray-100 p-1 rounded-lg overflow-hidden">
          <button 
            onClick={() => setFilter("all")} 
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === "all" ? "bg-white text-blue-600 shadow-sm" : "text-gray-100 hover:text-gray-900"
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter("active")} 
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === "active" ? "bg-white text-blue-600 shadow-sm" : "text-gray-100 hover:text-gray-900"
            }`}
          >
            Active
          </button>
          <button 
            onClick={() => setFilter("completed")} 
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === "completed" ? "bg-white text-blue-600 shadow-sm" : "text-gray-100 hover:text-gray-900"
            }`}
          >
            Done
          </button>
        </div>

        {/* Clear completed button */}
        {completedCount > 0 && (
          <button 
            onClick={clearCompleted} 
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium bg-red-50 text-red-600 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
          >
            🗑️ Clear Completed ({completedCount})
          </button>
        )}
      </div>
    </div>
  );
};

export default Toolbar;