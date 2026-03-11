'use client';

import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import SocialPostsWidget from './SocialPostsWidget';
import ActivityFeedWidget from './ActivityFeedWidget';
import NurtureStatsWidget from './NurtureStatsWidget';
import QuickStatsWidget from './QuickStatsWidget';

interface BufferUpdate {
  id: string;
  text: string;
  text_formatted: string;
  due_at: number;
  due_time: string;
  day: string;
  sent_at?: number;
  status: string;
  profile_service: string;
  statistics?: { reach?: number; clicks?: number; retweets?: number; favorites?: number };
}

interface DashboardData {
  nurture: {
    activeEnrollments: number;
    totalEnrollments: number;
    emailsSent7d: number;
    openRate: number;
    clickRate: number;
  } | null;
  activity: Array<{ type: string; ts: string; data: Record<string, unknown> }>;
  stats: {
    botVisits7d: number;
    contentTotal: number;
    contentPublished: number;
    contentInProgress: number;
    demoRequests30d: number;
    ppcLeads30d: number;
  } | null;
  buffer: Array<{
    profile: {
      id: string;
      service: string;
      service_username: string;
      formatted_username: string;
      avatar: string;
    };
    pending: BufferUpdate[];
    sent: BufferUpdate[];
    pendingTotal: number;
    sentTotal: number;
  }> | null;
  bufferError: string | null;
}

export default function DashboardShell() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await fetch('/api/dashboard');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-surface border border-border rounded-xl p-4 animate-pulse">
              <div className="h-4 bg-surface-elevated rounded w-20 mb-3" />
              <div className="h-8 bg-surface-elevated rounded w-12 mb-1" />
              <div className="h-3 bg-surface-elevated rounded w-24" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface border border-border rounded-xl p-6 animate-pulse">
              <div className="h-5 bg-surface-elevated rounded w-32 mb-4" />
              <div className="space-y-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-12 bg-surface-elevated rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <QuickStatsWidget data={data?.stats ?? null} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SocialPostsWidget
          data={data?.buffer ?? null}
          error={data?.bufferError}
        />
        <NurtureStatsWidget data={data?.nurture ?? null} />
      </div>

      <ActivityFeedWidget items={data?.activity ?? []} />
    </div>
  );
}
