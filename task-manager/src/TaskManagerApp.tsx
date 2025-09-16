import React, { useState } from "react";
import TaskForm from "./components/TaskForm";
import Toolbar from "./components/Toolbar";
import TaskList from "./components/TaskList";
import NotificationSettings, { type NotificationSettings as NotificationSettingsType } from "./components/NotificationSettings";
import { useTaskNotifications } from "./hooks/useTaskNotifications";

const TaskManagerApp: React.FC = () => {
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettingsType>({
    enabled: false,
    notifyBefore: 0,
    checkInterval: 1
  });

  // Initialize notifications with current settings
  useTaskNotifications({
    checkInterval: notificationSettings.checkInterval * 60 * 1000, // Convert minutes to milliseconds
    notifyBefore: notificationSettings.notifyBefore,
    enabled: notificationSettings.enabled
  });

  const handleNotificationSettingsChange = (settings: NotificationSettingsType) => {
    setNotificationSettings(settings);
  };

  return (
    <div className="min-h-screen bg-gray-200 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        <header className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Task Manager</h1>
          <p className="text-md sm:text-base text-gray-600">Stay organized and productive</p>
        </header>

        <main className="space-y-4 sm:space-y-6">
          <TaskForm />
          <NotificationSettings onSettingsChange={handleNotificationSettingsChange} />
          <Toolbar />
          <TaskList />
        </main>

        <footer className="mt-6 text-center text-xs sm:text-sm text-gray-500">
          Built with React & Typescript &mdash; Task Manager &copy; {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}

export default TaskManagerApp;
