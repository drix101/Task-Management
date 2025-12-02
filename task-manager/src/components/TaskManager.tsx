import React, { useState, useEffect } from 'react';
import { Task, TaskFilter, TaskSortBy, SortOrder } from '../types/task';
import { createTask, filterTasks, sortTasks } from '../utils/taskUtils';
import TaskList from './TaskList';
import AddTaskForm from './AddTaskForm';
import TaskFilters from './TaskFilters';

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>({ status: 'all' });
  const [sortBy, setSortBy] = useState<TaskSortBy>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showAddForm, setShowAddForm] = useState(false);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) { 
      const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      }));
      setTasks(parsedTasks);
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (
    title: string,
    description?: string,
    priority: 'low' | 'medium' | 'high' = 'medium',
    dueDate?: Date,
    category?: string
  ) => {
    const newTask = createTask(title, description, priority, dueDate, category);
    setTasks(prev => [newTask, ...prev]);
    setShowAddForm(false);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const toggleTaskComplete = (id: string) => {
    updateTask(id, { completed: !tasks.find(t => t.id === id)?.completed });
  };

  const clearCompleted = () => {
    setTasks(prev => prev.filter(task => !task.completed));
  };

  // Get filtered and sorted tasks
  const filteredTasks = filterTasks(tasks, filter);
  const sortedTasks = sortTasks(filteredTasks, sortBy, sortOrder);

  // Statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Task Manager</h1>
          <p className="text-gray-600">Stay organized and productive</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{totalTasks}</div>
            <div className="text-gray-600">Total Tasks</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-green-600">{completedTasks}</div>
            <div className="text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-orange-600">{pendingTasks}</div>
            <div className="text-gray-600">Pending</div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {showAddForm ? 'Cancel' : 'Add New Task'}
            </button>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {completedTasks > 0 && (
                <button
                  onClick={clearCompleted}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Clear Completed
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Add Task Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow mb-6 p-6">
            <AddTaskForm onAddTask={addTask} onCancel={() => setShowAddForm(false)} />
          </div>
        )}

        {/* Filters and Sorting */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <TaskFilters
            filter={filter}
            onFilterChange={setFilter}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            tasks={tasks}
          />
        </div>

        {/* Task List */}
        <div className="bg-white rounded-lg shadow">
          <TaskList
            tasks={sortedTasks}
            onToggleComplete={toggleTaskComplete}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
          />
        </div>

        {/* Empty State */}
        {sortedTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {tasks.length === 0 ? 'No tasks yet' : 'No tasks match your filters'}
            </h3>
            <p className="text-gray-600">
              {tasks.length === 0 
                ? 'Create your first task to get started!' 
                : 'Try adjusting your filters to see more tasks.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManager;