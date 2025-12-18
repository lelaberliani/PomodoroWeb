import { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { PomodoroTimer } from './components/PomodoroTimer';
import { TaskManager } from './components/TaskManager';
import { Statistics } from './components/Statistics';
import { Leaderboard } from './components/Leaderboard';
import Footer from './components/footer';
import ScrollToTop from './scrolToTop';

interface Task {
  id: string;
  title: string;
  description: string;
  focusMinutes: number;
  completed: boolean;
}

interface FocusSession {
  date: string;
  minutes: number;
}

interface LeaderboardEntry {
  username: string;
  focusMinutes: number;
  focusPoints: number;
  rank: number;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUsername = localStorage.getItem('pomodoro_username');
    const savedTasks = localStorage.getItem('pomodoro_tasks');
    const savedSessions = localStorage.getItem('pomodoro_sessions');
    const savedActiveTask = localStorage.getItem('pomodoro_active_task');

    if (savedUsername) {
      setUsername(savedUsername);
      setIsLoggedIn(true);
    }
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    if (savedSessions) {
      setFocusSessions(JSON.parse(savedSessions));
    }
    if (savedActiveTask) {
      setActiveTaskId(savedActiveTask);
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem('pomodoro_username', username);
      localStorage.setItem('pomodoro_tasks', JSON.stringify(tasks));
      localStorage.setItem('pomodoro_sessions', JSON.stringify(focusSessions));
      if (activeTaskId) {
        localStorage.setItem('pomodoro_active_task', activeTaskId);
      } else {
        localStorage.removeItem('pomodoro_active_task');
      }
    }
  }, [isLoggedIn, username, tasks, focusSessions, activeTaskId]);

  const handleLogin = (user: string) => {
    setUsername(user);
    setIsLoggedIn(true);
    setActiveTab('home');
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout? Your data will be preserved.')) {
      setIsLoggedIn(false);
      setActiveTab('home');
    }
  };

  const handleAddTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
    };
    setTasks([...tasks, newTask]);
  };

  const handleEditTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, ...updates } : task)));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
    if (activeTaskId === id) {
      setActiveTaskId(null);
    }
  };

  const handleFocusComplete = (minutes: number) => {
    const today = new Date().toISOString().split('T')[0];

    // Add focus session
    const newSession: FocusSession = {
      date: today,
      minutes,
    };
    setFocusSessions([...focusSessions, newSession]);

    // Update active task focus time
    if (activeTaskId) {
      handleEditTask(activeTaskId, {
        focusMinutes: (tasks.find((t) => t.id === activeTaskId)?.focusMinutes || 0) + minutes,
      });
    }
  };

  // Calculate weekly statistics
  const getWeeklyData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weekData = days.map((day) => ({ day, minutes: 0 }));

    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() + 1); // Start from Monday

    focusSessions.forEach((session) => {
      const sessionDate = new Date(session.date);
      const daysDiff = Math.floor((sessionDate.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff >= 0 && daysDiff < 7) {
        weekData[daysDiff].minutes += session.minutes;
      }
    });

    return weekData;
  };

  const weeklyData = getWeeklyData();
  const totalWeeklyMinutes = weeklyData.reduce((sum, day) => sum + day.minutes, 0);
  const focusPoints = totalWeeklyMinutes; // 1 point per minute
  const completedTasks = tasks.filter((t) => t.completed).length;

  // Generate dummy leaderboard data
  const getLeaderboardData = (): LeaderboardEntry[] => {
    const dummyUsers = [
      { username: 'Sarah Chen', focusMinutes: 1200 },
      { username: 'Mike Johnson', focusMinutes: 980 },
      { username: 'Emma Davis', focusMinutes: 850 },
      { username: 'Alex Kim', focusMinutes: 720 },
      { username: 'Lisa Wang', focusMinutes: 650 },
      { username: username, focusMinutes: totalWeeklyMinutes },
    ];

    const sorted = dummyUsers
      .sort((a, b) => b.focusMinutes - a.focusMinutes)
      .map((user, index) => ({
        ...user,
        focusPoints: user.focusMinutes,
        rank: index + 1,
      }));

    return sorted;
  };

  const activeTask = tasks.find((t) => t.id === activeTaskId);

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f111a] via-[#1a1d2e] to-[#0f111a]">

      {/* 🔥 INI YANG KAMU LUPA */}
      <ScrollToTop activeTab={activeTab} />

      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        username={username}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'home' && (
          <Dashboard
            username={username}
            weeklyFocusTime={totalWeeklyMinutes}
            focusPoints={focusPoints}
          />
        )}

        {activeTab === 'timer' && (
          <PomodoroTimer
            onFocusComplete={handleFocusComplete}
            activeTask={activeTask?.title || null}
          />
        )}

        {activeTab === 'tasks' && (
          <TaskManager
            tasks={tasks}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            activeTaskId={activeTaskId}
            onSetActiveTask={setActiveTaskId}
          />
        )}

        {activeTab === 'statistics' && (
          <Statistics
            weeklyData={weeklyData}
            totalWeeklyMinutes={totalWeeklyMinutes}
            completedTasks={completedTasks}
          />
        )}

        {activeTab === 'leaderboard' && (
          <Leaderboard
            currentUser={username}
            leaderboardData={getLeaderboardData()}
          />
        )}
      </main>

      <Footer
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
}