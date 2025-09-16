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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

      // Auto-close after 10 seconds
      setTimeout(() => {
        notification.close();
      }, 10000);
    }
  }, []);

  // Check for due tasks - memoized to prevent infinite re-renders
  const checkDueTasks = useCallback(() => {
    if (!enabled || Notification.permission !== 'granted') return;

    const now = Date.now();
    const notifyTime = notifyBefore * 60 * 1000; // Convert minutes to milliseconds

    tasks.forEach(task => {
      if (!task.due || task.completed) return;

      const dueTime = task.due - notifyTime;
      const isTimeToNotify = now >= dueTime;
      const hasNotBeenNotified = !notifiedTasks.current.has(task.id);

      if (isTimeToNotify && hasNotBeenNotified) {
        showNotification(task);
        notifiedTasks.current.add(task.id);
      }
    });

    // Clean up notifications for completed or deleted tasks
    const currentTaskIds = new Set(tasks.map(t => t.id));
    notifiedTasks.current.forEach(taskId => {
      if (!currentTaskIds.has(taskId)) {
        notifiedTasks.current.delete(taskId);
      }
    });

    // Remove notifications for completed tasks
    tasks.forEach(task => {
      if (task.completed && notifiedTasks.current.has(task.id)) {
        notifiedTasks.current.delete(task.id);
      }
    });
  }, [tasks, notifyBefore, enabled, showNotification]);

  // Initialize notifications only when enabled
  useEffect(() => {
    if (!enabled || Notification.permission !== 'granted') {
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Start checking for due tasks
    intervalRef.current = setInterval(checkDueTasks, checkInterval);
    
    // Check immediately
    checkDueTasks();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, checkInterval, checkDueTasks]);

  return {
    requestNotificationPermission,
    hasNotificationPermission: () => 
      'Notification' in window && Notification.permission === 'granted'
  };
};