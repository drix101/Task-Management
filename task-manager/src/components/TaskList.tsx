import React from 'react';
import type { Task } from '../types/task';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleComplete,
  onUpdateTask, 
  onDeleteTask,
}) => {
  if (tasks.length === 0) {
    return ( 
      <div className="p-8 text-center text-gray-500">
        <div className="text-4xl mb-4">📋</div>
        <p>No tasks to display</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onUpdateTask={onUpdateTask}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </div>
  );
};

export default TaskList;