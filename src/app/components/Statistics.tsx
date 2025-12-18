import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Clock, Target } from 'lucide-react';

interface StatisticsProps {
  weeklyData: { day: string; minutes: number }[];
  totalWeeklyMinutes: number;
  completedTasks: number;
}

export function Statistics({ weeklyData, totalWeeklyMinutes, completedTasks }: StatisticsProps) {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const averageDaily = Math.round(totalWeeklyMinutes / 7);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1d2e] border border-white/20 rounded-lg p-3 shadow-xl">
          <p className="text-white mb-1">{payload[0].payload.day}</p>
          <p className="text-blue-400">{formatTime(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h2 className="text-2xl text-white mb-6">Statistics</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Focus Time</p>
              <p className="text-2xl text-white">{formatTime(totalWeeklyMinutes)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Daily Average</p>
              <p className="text-2xl text-white">{formatTime(averageDaily)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center">
              <Target className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Completed Tasks</p>
              <p className="text-2xl text-white">{completedTasks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-xl">
        <h3 className="text-white mb-6">Weekly Focus Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyData}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f9cf9" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#9f7aea" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="day"
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af' }}
            />
            <YAxis
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af' }}
              tickFormatter={(value) => `${value}m`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="minutes"
              fill="url(#barGradient)"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Additional Insights */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-xl">
        <h3 className="text-white mb-4">Insights</h3>
        <div className="space-y-3">
          {weeklyData.reduce((max, day) => (day.minutes > max.minutes ? day : max), weeklyData[0]).minutes > 0 && (
            <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <p className="text-gray-300 text-sm">
                Your most productive day was{' '}
                <span className="text-blue-400">
                  {weeklyData.reduce((max, day) => (day.minutes > max.minutes ? day : max), weeklyData[0]).day}
                </span>{' '}
                with{' '}
                <span className="text-blue-400">
                  {formatTime(weeklyData.reduce((max, day) => (day.minutes > max.minutes ? day : max), weeklyData[0]).minutes)}
                </span>
              </p>
            </div>
          )}
          {totalWeeklyMinutes >= 840 && (
            <div className="flex items-center gap-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-purple-400"></div>
              <p className="text-gray-300 text-sm">
                Great job! You've achieved over{' '}
                <span className="text-purple-400">14 hours</span> of focus time this week
              </p>
            </div>
          )}
          {averageDaily < 30 && totalWeeklyMinutes > 0 && (
            <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
              <p className="text-gray-300 text-sm">
                Try to increase your daily focus time to reach your goals
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
