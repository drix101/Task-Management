import React, { useState, useEffect } from "react";
import type { Task } from "../types/task";

type Props = {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, patch: Partial<Task>) => void;
};

const TaskItem: React.FC<Props> = ({ task, onToggle, onDelete, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [notes, setNotes] = useState(task.notes || "");
  const [priority, setPriority] = useState(task.priority);
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");

  useEffect(() => {
    setTitle(task.title);
    setNotes(task.notes || "");
    setPriority(task.priority);
    
    if (task.due) {
      const date = new Date(task.due);
      setDueDate(date.toISOString().split('T')[0]);
      setDueTime(date.toTimeString().slice(0, 5));
    } else {
      setDueDate("");
      setDueTime("");
    }
  }, [task]);

  const save = () => {
    let dueTimestamp = null;
    if (dueDate) {
      if (dueTime) {
        dueTimestamp = new Date(`${dueDate}T${dueTime}`).getTime();
      } else {
        dueTimestamp = new Date(`${dueDate}T23:59:59`).getTime();
      }
    }

    onUpdate(task.id, {
      title,
      notes,
      priority,
      due: dueTimestamp,
    });
    setEditing(false);
  };

  const formatDateTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const dateStr = date.toLocaleDateString();
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${dateStr} ${timeStr}`;
  };

  return (
    <div className="p-3 sm:p-4 border-b last:border-b-0 bg-white">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500 flex-shrink-0"
        />
        
        <div className="flex-1 min-w-0">
          {/* Title and priority row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
            {editing ? (
              <input 
                className="flex-1 p-2 border rounded-md text-gray-100 text-base focus:outline-none focus:ring-2 focus:ring-blue-500" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Task title"
              />
            ) : (
              <h3 className={`font-medium text-base sm:text-lg break-words ${task.completed ? "line-through text-gray-400" : "text-gray-900"}`}>
                {task.title}
              </h3>
            )}

            <div className="flex items-center gap-2 flex-shrink-0">
              <span 
                className="text-xs sm:text-sm px-2 py-1 rounded-full text-white font-medium" 
                style={{ 
                  backgroundColor: priority === "high" ? "#ef4444" : priority === "medium" ? "#f59e0b" : "#6b7280" 
                }}
              >
                {priority}
              </span>
            </div>
          </div>

          {/* Due date and time */}
          {task.due && (
            <div className="text-xs sm:text-sm text-gray-700 mb-2">
              📅 {formatDateTime(task.due)}
            </div>
          )}
          
          {/* Notes section */}
          <div className="mb-3">
            {editing ? (
              <textarea 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)} 
                className="w-full p-2 border rounded-md text-gray-100 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" 
                placeholder="Add notes..."
                rows={2}
              />
            ) : (
              task.notes && (
                <p className="text-sm text-gray-600 break-words">{task.notes}</p>
              )
            )}
          </div>

          {/* Editing form - mobile optimized */}
          {editing && (
            <div className="space-y-3 mb-3 p-3 bg-gray-50 rounded-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Due Date:</label>
                  <input 
                    type="date" 
                    value={dueDate} 
                    onChange={(e) => setDueDate(e.target.value)} 
                    className="w-full p-2 border rounded-md text-gray-100 text-base focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Due Time:</label>
                  <input 
                    type="time" 
                    value={dueTime} 
                    onChange={(e) => setDueTime(e.target.value)} 
                    className="w-full p-2 border rounded-md text-gray-100 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Priority:</label>
                <select 
                  value={priority} 
                  onChange={(e) => setPriority(e.target.value as Task["priority"])} 
                  className="w-full p-2 border rounded-md text-gray-100 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
            </div>
          )}

          {/* Action buttons - mobile optimized */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button 
              onClick={() => (editing ? save() : setEditing(true))} 
              className="flex-1 sm:flex-none px-3 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
            >
              {editing ? "💾 Save" : "✏️ Edit"}
            </button>
            {editing && (
              <button 
                onClick={() => setEditing(false)} 
                className="flex-1 sm:flex-none px-3 py-2 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm font-medium"
              >
                ❌ Cancel
              </button>
            )}
            <button 
              onClick={() => onDelete(task.id)} 
              className="flex-1 sm:flex-none px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm font-medium"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;