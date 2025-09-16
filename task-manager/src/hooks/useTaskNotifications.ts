import { useEffect, useRef, useCallback } from 'react';
import useTaskStore from '../store/taskStore';

interface NotificationOptions {
  checkInterval?: number; // in milliseconds, default 60000 (1 minute)
  notifyBefore?: number; // notify X minutes before due time, default 0
  enabled?: boolean; // whether notifications are enabled
}

export const useTaskNotifications = (options: NotificationOptions = {}) => {
  const { tasks } = useTaskStore();
  const { checkInterval = 60000, notifyBefore = 0, enabled = false } = options;
  const notifiedTasks = useRef<Set<string>>(new Set());
  const intervalRef = useRef<number | null>(null);

  // Request notification permission (only call from user interaction)
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      }
      return Notification.permission === 'granted';
    }
    return false;
  }, []);

  // Show notification for a task
  const showNotification = useCallback((task: any) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const now = new Date();
      const dueDate = new Date(task.due);
      const isOverdue = now > dueDate;
      
      const title = isOverdue ? '⚠️ Task Overdue!' : '⏰ Task Due Now!';
      const body = `${task.title}${task.notes ? `\n${task.notes}` : ''}`;
      
      const notification = new Notification(title, {
        body,
        icon: '/vite.svg',
        badge: '/vite.svg',
        tag: `task-${task.id}`,
        requireInteraction: true
      });

      // Handle notification clicks
      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);
    }
  }, []);

  // Check for due tasks
  const checkDueTasks = useCallback(() => {
    if (!enabled) return;

    const now = Date.now();
    const notifyBeforeMs = notifyBefore * 60 * 1000; // Convert minutes to milliseconds

    tasks.forEach(task => {
      if (task.completed || !task.due) return;
      
      const timeUntilDue = task.due - now;
      const shouldNotify = timeUntilDue <= notifyBeforeMs && timeUntilDue >= -60000; // Within notify window and not more than 1 minute overdue
      
      if (shouldNotify && !notifiedTasks.current.has(task.id)) {
        showNotification(task);
        notifiedTasks.current.add(task.id);
      }
      
      // Remove from notified set if task is no longer due soon (user might have changed due date)
      if (timeUntilDue > notifyBeforeMs + 60000) {
        notifiedTasks.current.delete(task.id);
      }
    });
  }, [tasks, enabled, notifyBefore, showNotification]);

  // Set up interval for checking due tasks
  useEffect(() => {
    if (enabled) {
      // Check immediately
      checkDueTasks();
      
      // Set up interval
      intervalRef.current = window.setInterval(checkDueTasks, checkInterval);
    } else {
      // Clear interval if disabled
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, checkInterval, checkDueTasks]);

  // Clear notified tasks when tasks change (e.g., task completed or deleted)
  useEffect(() => {
    const currentTaskIds = new Set(tasks.map(t => t.id));
    const notifiedTaskIds = Array.from(notifiedTasks.current);
    
    notifiedTaskIds.forEach(taskId => {
      if (!currentTaskIds.has(taskId)) {
        notifiedTasks.current.delete(taskId);
      }
    });
  }, [tasks]);

  return {
    requestNotificationPermission,
    checkDueTasks,
    isEnabled: enabled,
    hasPermission: 'Notification' in window && Notification.permission === 'granted'
  };
};