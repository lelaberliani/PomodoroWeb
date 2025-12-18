import { User, Clock, Trophy } from 'lucide-react';

interface DashboardProps {
  username: string;
  weeklyFocusTime: number;
  focusPoints: number;
}

export function Dashboard({ username, weeklyFocusTime, focusPoints }: DashboardProps) {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 blur-3xl"></div>
        <div className="relative">
          <div className="inline-block px-6 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full mb-6">
            <span className="text-blue-400 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              Boost Your Productivity
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl text-white mb-4">
            Focus. Work. Achieve.
          </h1>
          <h2 className="text-4xl md:text-5xl bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-6">
            Master Your Time
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            A futuristic Pomodoro app designed to help you focus, manage tasks, and track your productivity with elegance.
          </p>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-blue-500/10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-500/30">
                <User className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green-500 border-4 border-[#1a1d2e] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl text-white mb-2">{username}</h3>
              <p className="text-gray-400 mb-4">Productivity Champion</p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-400 text-sm">Weekly Focus Time</span>
                  </div>
                  <p className="text-2xl text-white">{formatTime(weeklyFocusTime)}</p>
                </div>
                
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Trophy className="w-5 h-5 text-purple-400" />
                    <span className="text-gray-400 text-sm">Focus Points</span>
                  </div>
                  <p className="text-2xl text-white">{focusPoints}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
