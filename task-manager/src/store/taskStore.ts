import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Task, TaskFilter, TaskSort } from "../types/task";

interface TaskStore {
  tasks: Task[];
  filter: TaskFilter;
  query: string;
  sortBy: TaskSort;
  addTask: (task: Task) => void;
  removeTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  setFilter: (filter: TaskFilter) => void;
  setQuery: (query: string) => void;
  setSortBy: (sortBy: TaskSort) => void;
  clearCompleted: () => void;
}

const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],
      filter: "all",
      query: "",
      sortBy: "createdDesc",
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      removeTask: (id) => set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
      toggleComplete: (id) => set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      })),
      updateTask: (id, patch) => set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t))
      })),
      setFilter: (filter) => set({ filter }),
      setQuery: (query) => set({ query }),
      setSortBy: (sortBy) => set({ sortBy }),
      clearCompleted: () => set((state) => ({ tasks: state.tasks.filter((t) => !t.completed) })),
    }),
    { name: "task-store" }
  )
);

export default useTaskStore;