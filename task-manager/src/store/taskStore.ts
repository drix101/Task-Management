import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Task, TaskFilter, TaskSort } from "../types/task";

interface TaskState {
  tasks: Task[];
  filter: TaskFilter;
  query: string;
  sortBy: TaskSort;
  addTask: (task: Task) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  removeTask: (id: string) => void;
  setFilter: (f: TaskFilter) => void;
  setQuery: (q: string) => void;
  setSortBy: (s: TaskSort) => void;
  clearCompleted: () => void;
  toggleComplete: (id: string) => void;
}

const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      filter: "all",
      query: "",
      sortBy: "createdDesc",
      addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
      updateTask: (id, patch) =>
        set((state) => ({ tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) })),
      removeTask: (id) => set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
      setFilter: (f) => set({ filter: f }),
      setQuery: (q) => set({ query: q }),
      setSortBy: (s) => set({ sortBy: s }),
      clearCompleted: () => set((s) => ({ tasks: s.tasks.filter((t) => !t.completed) })),
      toggleComplete: (id) =>
        set((state) => ({ tasks: state.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)) })),
    }),
    { name: "task-manager-storage" }
  )
);

export default useTaskStore;