'use client';

import { Calendar, Send, Clock, ExternalLink, Linkedin, Twitter, Facebook } from 'lucide-react';

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
  statistics?: {
    reach?: number;
    clicks?: number;
    retweets?: number;
    favorites?: number;
  };
}

interface ProfileData {
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
}

const ServiceIcon = ({ service, className }: { service: string; className?: string }) => {
  switch (service) {
    case 'linkedin': return <Linkedin className={className} />;
    case 'twitter': return <Twitter className={className} />;
    case 'facebook': return <Facebook className={className} />;
    default: return <Send className={className} />;
  }
};

const serviceColors: Record<string, string> = {
  linkedin: 'text-blue-400',
  twitter: 'text-sky-400',
  facebook: 'text-indigo-400',
};

function formatTimestamp(unix: number) {
  const d = new Date(unix * 1000);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function timeAgo(unix: number) {
  const diff = Date.now() - unix * 1000;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function truncate(text: string, max = 120) {
  if (text.length <= max) return text;
  return text.slice(0, max).trim() + '...';
}

export default function SocialPostsWidget({ data, error }: { data: ProfileData[] | null; error?: string | null }) {
  if (error) {
    return (
      <div className="bg-surface border border-border rounded-xl p-6 card-glow">
        <div className="flex items-center gap-2 mb-4">
          <Send className="w-5 h-5 text-accent" />
          <h2 className="font-semibold">Social Media</h2>
        </div>
        <p className="text-sm text-muted">{error}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-xl p-6 card-glow">
        <div className="flex items-center gap-2 mb-4">
          <Send className="w-5 h-5 text-accent" />
          <h2 className="font-semibold">Social Media</h2>
        </div>
        <p className="text-sm text-muted text-center py-4">No Buffer profiles connected.</p>
      </div>
    );
  }

  const allPending = data.flatMap((d) =>
    d.pending.map((u) => ({ ...u, service: d.profile.service, username: d.profile.formatted_username }))
  ).sort((a, b) => a.due_at - b.due_at);

  const allSent = data.flatMap((d) =>
    d.sent.map((u) => ({ ...u, service: d.profile.service, username: d.profile.formatted_username }))
  ).sort((a, b) => (b.sent_at || b.due_at) - (a.sent_at || a.due_at));

  return (
    <div className="bg-surface border border-border rounded-xl p-6 card-glow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Send className="w-5 h-5 text-accent" />
          <h2 className="font-semibold">Social Media</h2>
        </div>
        <div className="flex items-center gap-2">
          {data.map((d) => (
            <div key={d.profile.id} className="flex items-center gap-1" title={d.profile.formatted_username}>
              <ServiceIcon service={d.profile.service} className={`w-4 h-4 ${serviceColors[d.profile.service] || 'text-muted'}`} />
            </div>
          ))}
        </div>
      </div>

      {allPending.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Clock className="w-3.5 h-3.5 text-warning" />
            <span className="text-xs font-medium text-warning uppercase tracking-wide">Upcoming</span>
            <span className="text-xs text-muted">({allPending.length})</span>
          </div>
          <div className="space-y-2">
            {allPending.slice(0, 4).map((post) => (
              <div key={post.id} className="flex items-start gap-3 p-2.5 rounded-lg bg-background/50 border border-border/50">
                <ServiceIcon service={post.service} className={`w-4 h-4 mt-0.5 shrink-0 ${serviceColors[post.service] || 'text-muted'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground leading-snug">{truncate(post.text)}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted">{formatTimestamp(post.due_at)}</span>
                    <span className="text-xs text-muted">· {post.username}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {allSent.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Calendar className="w-3.5 h-3.5 text-success" />
            <span className="text-xs font-medium text-success uppercase tracking-wide">Recently Sent</span>
          </div>
          <div className="space-y-2">
            {allSent.slice(0, 4).map((post) => (
              <div key={post.id} className="flex items-start gap-3 p-2.5 rounded-lg bg-background/50 border border-border/50">
                <ServiceIcon service={post.service} className={`w-4 h-4 mt-0.5 shrink-0 ${serviceColors[post.service] || 'text-muted'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground/80 leading-snug">{truncate(post.text)}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted">{timeAgo(post.sent_at || post.due_at)}</span>
                    {post.statistics?.clicks != null && post.statistics.clicks > 0 && (
                      <span className="text-xs text-accent flex items-center gap-0.5">
                        <ExternalLink className="w-3 h-3" />
                        {post.statistics.clicks} clicks
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {allPending.length === 0 && allSent.length === 0 && (
        <p className="text-sm text-muted text-center py-4">No recent or upcoming posts.</p>
      )}
    </div>
  );
}
