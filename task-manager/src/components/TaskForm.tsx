import React, { useState } from "react";
import { Task } from "../types/task";
import { makeId } from "../utils/helpers";
import useTaskStore from "../store/taskStore";

const TaskForm: React.FC = () => {
  const { addTask } = useTaskStore();
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    let dueTimestamp = null;
    if (dueDate) {
      if (dueTime) {
        // Combine date and time
        dueTimestamp = new Date(`${dueDate}T${dueTime}`).getTime();
      } else {
        // Just date, set to end of day
        dueTimestamp = new Date(`${dueDate}T23:59:59`).getTime();
      }
    }
    
    const task: Task = {
      id: makeId(),
      title: title.trim(),
      notes: notes.trim(),
      completed: false,
      priority,
      createdAt: Date.now(),
      due: dueTimestamp,
    };
    
    addTask(task);
    setTitle("");
    setNotes("");
    setPriority("medium");
    setDueDate("");
    setDueTime("");
  };

  return (
    <form onSubmit={submit} className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      {/* Main input row - responsive layout */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
        <input
          className="flex-1 p-3 sm:p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 text-base"
          placeholder="Add a new task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select 
          value={priority} 
          onChange={(e) => setPriority(e.target.value as Task["priority"])} 
          className="p-3 sm:p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 text-base sm:w-auto"
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
      </div>

      {/* Secondary inputs - responsive grid */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-100 sm:hidden">Due Date</label>
          <input 
            type="date" 
            value={dueDate} 
            onChange={(e) => setDueDate(e.target.value)} 
            className="w-full p-3 sm:p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 text-base" 
            placeholder="Due date"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-100 sm:hidden">Due Time</label>
          <input 
            type="time" 
            value={dueTime} 
            onChange={(e) => setDueTime(e.target.value)} 
            className="w-full p-3 sm:p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 text-base" 
            placeholder="Due time"
          />
        </div>
        <div className="space-y-1 sm:col-span-2 lg:col-span-1">
          <label className="block text-xs font-medium text-gray-100 sm:hidden">Notes</label>
          <input 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
            placeholder="Optional notes" 
            className="w-full p-3 sm:p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 text-base" 
          />
        </div>
      </div>

      {/* Submit button - full width on mobile */}
      <div className="mt-4">
        <button 
          type="submit"
          className="w-full sm:w-auto px-6 sm:px-12 py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
        >
          Add Task
        </button>
      </div>
    </form>
  );
};

export default TaskForm;