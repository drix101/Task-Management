import React, { useMemo } from "react";
import useTaskStore from "../store/taskStore";
import TaskItem from "./TaskItem";
import { Task } from "../types/task";


const TaskList: React.FC = () => {
const tasks = useTaskStore((s) => s.tasks);
const filter = useTaskStore((s) => s.filter);
const query = useTaskStore((s) => s.query);
const sortBy = useTaskStore((s) => s.sortBy);
const toggle = useTaskStore((s) => s.toggleComplete);
const remove = useTaskStore((s) => s.removeTask);
const update = useTaskStore((s) => s.updateTask);


const filtered = useMemo(() => {
let out: Task[] = [...tasks];
if (filter === "active") out = out.filter((t) => !t.completed);
if (filter === "completed") out = out.filter((t) => t.completed);
if (query && query.trim()) {
const q = query.toLowerCase();
out = out.filter((t) => (t.title || "").toLowerCase().includes(q) || (t.notes || "").toLowerCase().includes(q));
}


if (sortBy === "createdDesc") out.sort((a, b) => b.createdAt - a.createdAt);
if (sortBy === "createdAsc") out.sort((a, b) => a.createdAt - b.createdAt);
if (sortBy === "dueSoon") out.sort((a, b) => (a.due || Infinity) - (b.due || Infinity));


return out;
}, [tasks, filter, query, sortBy]);


if (!tasks.length) {
return <div className="p-6 text-center text-gray-900">No tasks yet — add your first task above.</div>;
}


return (
<div className="bg-white rounded-lg shadow-sm overflow-hidden">
{filtered.map((t) => (
<TaskItem key={t.id} task={t} onToggle={toggle} onDelete={remove} onUpdate={update} />
))}
</div>
);
};


export default TaskList;