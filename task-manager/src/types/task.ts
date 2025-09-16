export type Priority = "low" | "medium" | "high";


export interface Task {
id: string;
title: string;
notes?: string;
completed: boolean;
priority: Priority;
createdAt: number;
due: number | null;
}


export type TaskFilter = "all" | "active" | "completed";
export type TaskSort = "createdDesc" | "createdAsc" | "dueSoon";