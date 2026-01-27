'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare, Clock, ChevronRight, RefreshCw } from 'lucide-react';

interface PendingContribution {
  id: number;
  target_type: string;
  contribution_type: string;
  content: string;
  user_name: string | null;
  created_at: string;
}

export default function AdminInboxWidget() {
  const [pending, setPending] = useState<PendingContribution[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    try {
      const response = await fetch('/api/contributions?view=pending');
      const data = await response.json();
      if (response.ok) {
        setPending(data.contributions?.slice(0, 5) || []);
      }
    } catch (error) {
      console.error('Failed to fetch pending contributions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return 'just now';
  };

  if (loading) {
    return (
      <div className="bg-surface border border-border rounded-xl p-6 card-glow">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-accent" />
          <h3 className="font-semibold">Review Inbox</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-5 h-5 animate-spin text-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-6 card-glow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-accent" />
          <h3 className="font-semibold">Review Inbox</h3>
          {pending.length > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {pending.length}
            </span>
          )}
        </div>
        <Link 
          href="/admin/contributions"
          className="text-sm text-accent hover:text-accent-hover transition-colors flex items-center gap-1"
        >
          View all
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {pending.length === 0 ? (
        <div className="text-center py-6 text-muted">
          <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">All caught up!</p>
          <p className="text-xs mt-1">No pending contributions to review.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {pending.map((contribution) => (
            <Link
              key={contribution.id}
              href="/admin/contributions"
              className="block p-3 bg-surface-elevated/50 hover:bg-surface-elevated rounded-lg transition-colors group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground truncate group-hover:text-accent transition-colors">
                    {contribution.content.substring(0, 60)}
                    {contribution.content.length > 60 ? '...' : ''}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted">
                    <span className="capitalize">{contribution.target_type}</span>
                    <span>•</span>
                    <span>{contribution.user_name || 'Anonymous'}</span>
                  </div>
                </div>
                <span className="text-xs text-muted whitespace-nowrap">
                  {formatTimeAgo(contribution.created_at)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
