# Task Manager (React + TypeScript + Tailwind + Zustand)

A simple, modern **web-based task manager** built with React, TypeScript, TailwindCSS, and Zustand. It allows you to add, edit, complete, filter, and sort tasks — with persistent storage in the browser via `localStorage`.

🚀 Features

- ✅ Add, edit, delete tasks
- ✅ Mark tasks as complete/incomplete
- ✅ Optional notes, due dates, and priority levels
- ✅ Filter by **All / Active / Completed**
- ✅ Search and sort tasks (Newest, Oldest, Due soon)
- ✅ Persistent storage with Zustand + localStorage
- ✅ Responsive Tailwind UI

🛠️ Tech Stack

- **React 18+** (UI library)
- **TypeScript** (type safety)
- **TailwindCSS** (styling)
- **Zustand** (state management)
- **Vite** (fast dev server & bundler)


## 📂 Project Structure

src/
├── components/
│   ├── TaskForm.tsx       # Form for creating tasks
│   ├── TaskItem.tsx       # Individual task row
│   ├── TaskList.tsx       # List of tasks
│   └── Toolbar.tsx        # Filters, search, and controls
├── store/
│   └── taskStore.ts       # Zustand store for tasks
├── types/
│   └── task.ts            # Type definitions
├── utils/
│   └── helpers.ts         # Utility functions
├── TaskManagerApp.tsx     # Main task manager UI
├── App.tsx                # App wrapper
└── main.tsx               # Entry point



Getting Started

1️ Clone the repo
bash
git clone https://github.com/your-username/task-manager.git
cd task-manager


2️ Install dependencies
bash
npm install

3️ Run the dev server
bash
npm run dev

Open your browser at 

🔧 Available Scripts

`npm run dev` – Start dev server
- `npm run build` – Build for production
- `npm run preview` – Preview production build

📜 License
MIT License © 2025 — Built using React, TypeScript, Tailwind, and Zustand.