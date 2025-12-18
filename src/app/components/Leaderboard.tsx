import { Trophy, Medal, Award, Crown } from 'lucide-react';

interface LeaderboardEntry {
  username: string;
  focusMinutes: number;
  focusPoints: number;
  rank: number;
}

interface LeaderboardProps {
  currentUser: string;
  leaderboardData: LeaderboardEntry[];
}

export function Leaderboard({ currentUser, leaderboardData }: LeaderboardProps) {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-400" />;
      default:
        return <Trophy className="w-5 h-5 text-gray-500" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/40';
      case 2:
        return 'from-gray-400/20 to-gray-500/20 border-gray-400/40';
      case 3:
        return 'from-orange-500/20 to-orange-600/20 border-orange-500/40';
      default:
        return 'from-white/5 to-white/5 border-white/10';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <Trophy className="w-8 h-8 text-purple-400" />
          <h2 className="text-2xl text-white">Weekly Leaderboard</h2>
        </div>
        <p className="text-gray-400">Rankings based on total focus time</p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {leaderboardData.slice(0, 3).map((entry, index) => {
          const podiumOrder = [1, 0, 2]; // Second, First, Third
          const actualEntry = leaderboardData[podiumOrder[index]];
          if (!actualEntry) return null;
          
          return (
            <div
              key={actualEntry.rank}
              className={`${index === 1 ? 'order-1' : index === 0 ? 'order-2' : 'order-3'} ${
                index === 1 ? 'mt-0' : 'mt-8'
              }`}
            >
              <div
                className={`bg-gradient-to-br ${getRankColor(
                  actualEntry.rank
                )} backdrop-blur-xl border rounded-xl p-6 text-center transition-all hover:shadow-2xl ${
                  actualEntry.username === currentUser ? 'shadow-lg shadow-purple-500/30' : ''
                }`}
              >
                <div className="mb-3">{getRankIcon(actualEntry.rank)}</div>
                <div className={`text-4xl mb-2 ${index === 1 ? 'text-6xl' : ''}`}>
                  #{actualEntry.rank}
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-3">
                  <span className="text-white">
                    {actualEntry.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3 className="text-white mb-2">{actualEntry.username}</h3>
                <p className="text-blue-400 mb-1">{formatTime(actualEntry.focusMinutes)}</p>
                <p className="text-gray-400 text-sm">{actualEntry.focusPoints} points</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-4 text-left text-gray-400 text-sm">Rank</th>
                <th className="px-6 py-4 text-left text-gray-400 text-sm">User</th>
                <th className="px-6 py-4 text-right text-gray-400 text-sm">Focus Time</th>
                <th className="px-6 py-4 text-right text-gray-400 text-sm">Points</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((entry, index) => (
                <tr
                  key={entry.rank}
                  className={`border-b border-white/5 transition-all hover:bg-white/5 ${
                    entry.username === currentUser
                      ? 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-l-4 border-l-purple-500'
                      : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {getRankIcon(entry.rank)}
                      <span className="text-white">#{entry.rank}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white text-sm">
                          {entry.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-white">{entry.username}</p>
                        {entry.username === currentUser && (
                          <span className="text-purple-400 text-xs">You</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-blue-400">{formatTime(entry.focusMinutes)}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-white">{entry.focusPoints}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Points Calculation Info */}
      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
        <p className="text-gray-400 text-sm text-center">
          <span className="text-blue-400">Points are calculated</span> proportionally to focus time: 1 point per minute
        </p>
      </div>
    </div>
  );
}
