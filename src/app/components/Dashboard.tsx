import { User, Clock, Trophy ,TrendingUp,Timer,ListChecks} from 'lucide-react';

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

      {/* Timer Preview */}
      <div className="mt-20 max-w-md mx-auto">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#4DC3FF] to-[#A470FF] rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity" />
          <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8">
            {/* Circular Timer Preview */}
            <div className="relative mx-auto w-48 h-48">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray="552.92"
                  strokeDashoffset="138.23"
                  strokeLinecap="round"
                  className="drop-shadow-[0_0_12px_rgba(77,195,255,0.6)]"
                />
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#4DC3FF" />
                    <stop offset="100%" stopColor="#A470FF" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl text-white">25:00</span>
                <span className="text-sm text-white/50 mt-2">
                  Focus Time
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl text-white mb-4">
              Everything You Need to Stay Productive
            </h2>
            <p className="text-white/60">
              Powerful features in a beautiful, minimal interface
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1: Timer */}
            <div  className="group block">
              <div className="relative h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-[#4DC3FF] to-[#A470FF] rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity" />
                <div className="relative h-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
                  <div className="mb-6">
                    <div className="inline-flex p-3 bg-gradient-to-br from-[#4DC3FF]/20 to-[#A470FF]/20 rounded-2xl border border-[#4DC3FF]/30">
                      <Timer className="w-8 h-8 text-[#4DC3FF]" />
                    </div>
                  </div>
                  <h3 className="text-xl text-white mb-3">Pomodoro Timer</h3>
                  <p className="text-white/60 leading-relaxed">
                    Focus in 25-minute intervals with automatic breaks.
                    Customize durations to fit your workflow.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2: Tasks */}
            <div className="group block">
              <div className="relative h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-[#4DC3FF] to-[#A470FF] rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity" />
                <div className="relative h-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
                  <div className="mb-6">
                    <div className="inline-flex p-3 bg-gradient-to-br from-[#4DC3FF]/20 to-[#A470FF]/20 rounded-2xl border border-[#A470FF]/30">
                      <ListChecks className="w-8 h-8 text-[#A470FF]" />
                    </div>
                  </div>
                  <h3 className="text-xl text-white mb-3">Task Management</h3>
                  <p className="text-white/60 leading-relaxed">
                    Organize your work with smart task lists. Track progress and
                    prioritize what matters most.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3: Statistics */}
            <div className="group block">
              <div className="relative h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-[#4DC3FF] to-[#A470FF] rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity" />
                <div className="relative h-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
                  <div className="mb-6">
                    <div className="inline-flex p-3 bg-gradient-to-br from-[#4DC3FF]/20 to-[#A470FF]/20 rounded-2xl border border-[#4DC3FF]/30">
                      <TrendingUp className="w-8 h-8 text-[#4DC3FF]" />
                    </div>
                  </div>
                  <h3 className="text-xl text-white mb-3">
                    Analytics & Insights
                  </h3>
                  <p className="text-white/60 leading-relaxed">
                    Visualize your productivity patterns. Track focus time,
                    completed tasks, and streaks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      
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
