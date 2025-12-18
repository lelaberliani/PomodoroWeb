import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import SoundAlarm from '../../../public/sounds/alarm.mp3';

interface PomodoroTimerProps {
  onFocusComplete: (minutes: number) => void;
  activeTask: string | null;
}

export function PomodoroTimer({ onFocusComplete, activeTask }: PomodoroTimerProps) {
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [totalSessions, setTotalSessions] = useState(4);
  const [currentSession, setCurrentSession] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(true);
  const [timeLeft, setTimeLeft] = useState(focusDuration * 60);
  const [showSettings, setShowSettings] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  const intervalRef = useRef<number | null>(null);
  const alarmRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    alarmRef.current = new Audio(SoundAlarm);
    alarmRef.current.volume = 1.0;
  }, []);

  const playAlarm = () => {
    if (userInteracted) {  // Perbaikan: Hanya mainkan alarm jika pengguna sudah berinteraksi (setelah klik Start)
      alarmRef.current?.play().catch((e) => {
        console.log("Audio blocked or error:", e);
      });
    }
  };

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          handleSessionComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const handleSessionComplete = () => {
    playAlarm();  // Alarm akan dimainkan di sini saat sesi selesai, asalkan userInteracted true
    setIsRunning(false);

    if (isFocusMode) {
      // Fokus selesai
      onFocusComplete(focusDuration);

      if (currentSession < totalSessions) {
        setIsFocusMode(false);
        setTimeLeft(breakDuration * 60);

        // AUTO START BREAK
        setTimeout(() => setIsRunning(true), 500);
      } else {
        // Semua sesi selesai
        setCurrentSession(1);
        setIsFocusMode(true);
        setTimeLeft(focusDuration * 60);
      }
    } else {
      // Break selesai
      setCurrentSession((prev) => prev + 1);
      setIsFocusMode(true);
      setTimeLeft(focusDuration * 60);

      // AUTO START FOCUS
      setTimeout(() => setIsRunning(true), 500);
    }
  };

  const handleStart = () => {
    setUserInteracted(true);  // Set flag interaksi saat Start diklik
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsFocusMode(true);
    setCurrentSession(1);
    setTimeLeft(focusDuration * 60);

    alarmRef.current?.pause();
    if (alarmRef.current) alarmRef.current.currentTime = 0;
  };

  const applySettings = () => {
    setTimeLeft(focusDuration * 60);
    setIsFocusMode(true);
    setCurrentSession(1);
    setIsRunning(false);
    setShowSettings(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = isFocusMode
    ? ((focusDuration * 60 - timeLeft) / (focusDuration * 60)) * 100
    : ((breakDuration * 60 - timeLeft) / (breakDuration * 60)) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-blue-500/10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl text-white">Pomodoro Timer</h2>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
          >
            <Settings className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mb-8 p-6 bg-blue-500/5 border border-blue-500/20 rounded-xl space-y-4">
            <h3 className="text-white mb-4">Timer Settings</h3>

            <div>
              <label className="text-gray-400 text-sm block mb-2">Focus Duration (minutes)</label>
              <input
                type="number"
                value={focusDuration}
                onChange={(e) => setFocusDuration(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                min="1"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm block mb-2">Break Duration (minutes)</label>
              <input
                type="number"
                value={breakDuration}
                onChange={(e) => setBreakDuration(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                min="1"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm block mb-2">Total Sessions</label>
              <input
                type="number"
                value={totalSessions}
                onChange={(e) => setTotalSessions(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                min="1"
              />
            </div>

            <button
              onClick={applySettings}
              className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all"
            >
              Apply Settings
            </button>
          </div>
        )}

        {/* Active Task */}
        {activeTask && (
          <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
            <p className="text-purple-400 text-sm mb-1">Active Task</p>
            <p className="text-white">{activeTask}</p>
          </div>
        )}

        {/* Timer Display */}
        <div className="relative mb-8">
          <div className="w-64 h-64 mx-auto relative">
            {/* Progress Ring */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="12"
              />
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="12"
                strokeDasharray={`${2 * Math.PI * 90}`}
                strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-300"
                style={{ filter: 'drop-shadow(0 0 10px rgba(79, 156, 249, 0.5))' }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4f9cf9" />
                  <stop offset="100%" stopColor="#9f7aea" />
                </linearGradient>
              </defs>
            </svg>

            {/* Time Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-5xl text-white mb-2">{formatTime(timeLeft)}</p>
              <p className="text-gray-400 text-sm">
                {isFocusMode ? 'Focus Time' : 'Break Time'}
              </p>
            </div>
          </div>
        </div>

        {/* Session Indicators */}
        <div className="flex justify-center gap-3 mb-8">
          {Array.from({ length: totalSessions }).map((_, index) => (
            <div
              key={index}
              className={`w-12 h-2 rounded-full transition-all ${index + 1 < currentSession
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30'
                : index + 1 === currentSession
                  ? 'bg-gradient-to-r from-blue-400 to-purple-500 shadow-lg shadow-blue-500/50'
                  : 'bg-white/10'
                }`}
            />
          ))}
        </div>

        {/* Session Counter */}
        <p className="text-center text-gray-400 mb-8">
          Session {currentSession} of {totalSessions}
        </p>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-2xl hover:shadow-blue-500/40 transition-all flex items-center gap-3"
            >
              <Play className="w-5 h-5" />
              Start
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:shadow-2xl hover:shadow-purple-500/40 transition-all flex items-center gap-3"
            >
              <Pause className="w-5 h-5" />
              Pause
            </button>
          )}

          <button
            onClick={handleReset}
            className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all flex items-center gap-3"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}