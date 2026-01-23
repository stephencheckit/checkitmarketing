'use client';

import { useState, useEffect } from 'react';
import { Trophy, TrendingUp, User } from 'lucide-react';

interface Contributor {
  id: number;
  name: string;
  department: string;
  acceptedCount: number;
}

interface UserStats {
  acceptedCount: number;
  totalCount: number;
  pendingCount: number;
  rank: number | null;
}

interface LeaderboardData {
  thisMonth: Contributor[];
  userStats: UserStats;
}

export default function LeaderboardWidget({ currentUserId }: { currentUserId: number }) {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/contributions/stats');
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-surface border border-border rounded-xl p-6 card-glow">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-accent" />
          <h2 className="font-semibold">Top Contributors</h2>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-8 h-8 bg-surface-elevated rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-surface-elevated rounded w-24 mb-1" />
                <div className="h-3 bg-surface-elevated rounded w-16" />
              </div>
              <div className="h-4 bg-surface-elevated rounded w-6" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.thisMonth.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-xl p-6 card-glow">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-accent" />
          <h2 className="font-semibold">Top Contributors</h2>
        </div>
        <p className="text-sm text-muted text-center py-4">
          No contributions this month yet. Be the first!
        </p>
      </div>
    );
  }

  const getRankBadge = (index: number) => {
    if (index === 0) return <span className="text-lg">🥇</span>;
    if (index === 1) return <span className="text-lg">🥈</span>;
    if (index === 2) return <span className="text-lg">🥉</span>;
    return <span className="w-6 h-6 bg-surface-elevated rounded-full flex items-center justify-center text-xs text-muted font-medium">{index + 1}</span>;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-6 card-glow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-accent" />
          <h2 className="font-semibold">Top Contributors</h2>
        </div>
        <span className="text-xs text-muted">This Month</span>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-3">
        {data.thisMonth.map((contributor, index) => {
          const isCurrentUser = contributor.id === currentUserId;
          return (
            <div 
              key={contributor.id}
              className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                isCurrentUser ? 'bg-accent/10 border border-accent/30' : 'hover:bg-surface-elevated'
              }`}
            >
              <div className="shrink-0 w-8 flex justify-center">
                {getRankBadge(index)}
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-accent/30 to-accent/10 rounded-full flex items-center justify-center text-xs font-medium text-accent">
                {getInitials(contributor.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${isCurrentUser ? 'text-accent' : 'text-foreground'}`}>
                  {contributor.name}
                  {isCurrentUser && <span className="text-xs text-accent ml-1">(you)</span>}
                </p>
                <p className="text-xs text-muted truncate">{contributor.department}</p>
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-accent">
                <TrendingUp className="w-3 h-3" />
                {contributor.acceptedCount}
              </div>
            </div>
          );
        })}
      </div>

      {/* Current User Stats (if not in top 5) */}
      {data.userStats.acceptedCount > 0 && !data.thisMonth.find(c => c.id === currentUserId) && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-3 p-2 bg-surface-elevated rounded-lg">
            <div className="shrink-0 w-8 flex justify-center">
              <User className="w-4 h-4 text-muted" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted">Your rank</p>
            </div>
            <div className="text-sm font-medium">
              #{data.userStats.rank || '—'} • {data.userStats.acceptedCount} accepted
            </div>
          </div>
        </div>
      )}

      {/* Stats Summary */}
      <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-lg font-bold text-gradient">{data.userStats.acceptedCount}</p>
          <p className="text-xs text-muted">Accepted</p>
        </div>
        <div>
          <p className="text-lg font-bold text-foreground">{data.userStats.pendingCount}</p>
          <p className="text-xs text-muted">Pending</p>
        </div>
        <div>
          <p className="text-lg font-bold text-foreground">{data.userStats.totalCount}</p>
          <p className="text-xs text-muted">Total</p>
        </div>
      </div>
    </div>
  );
}
