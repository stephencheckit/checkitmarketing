'use client';

import { Calendar, Send, Clock, ExternalLink, Linkedin, Twitter, Facebook } from 'lucide-react';

interface BufferPost {
  id: string;
  text: string;
  status: string;
  createdAt: string;
  dueAt: string | null;
  sentAt: string | null;
  channelId: string;
}

interface BufferChannel {
  id: string;
  name: string;
  service: string;
}

interface BufferData {
  channels: BufferChannel[];
  channelMap: Record<string, BufferChannel>;
  pending: BufferPost[];
  sent: BufferPost[];
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

function formatDate(iso: string | null) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function timeAgo(iso: string | null) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
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

export default function SocialPostsWidget({ data, error }: { data: BufferData | null; error?: string | null }) {
  if (error || !data) {
    return (
      <div className="bg-surface border border-border rounded-xl p-6 card-glow">
        <div className="flex items-center gap-2 mb-4">
          <Send className="w-5 h-5 text-accent" />
          <h2 className="font-semibold">Social Media</h2>
        </div>
        <p className="text-sm text-muted text-center py-4">
          {error ? 'Unable to connect to Buffer. Check your API token.' : 'No Buffer data available.'}
        </p>
      </div>
    );
  }

  const { channels, channelMap, pending, sent } = data;

  return (
    <div className="bg-surface border border-border rounded-xl p-6 card-glow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Send className="w-5 h-5 text-accent" />
          <h2 className="font-semibold">Social Media</h2>
        </div>
        <div className="flex items-center gap-2">
          {channels.map((ch) => (
            <div key={ch.id} className="flex items-center gap-1" title={ch.name}>
              <ServiceIcon service={ch.service} className={`w-4 h-4 ${serviceColors[ch.service] || 'text-muted'}`} />
            </div>
          ))}
        </div>
      </div>

      {pending.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Clock className="w-3.5 h-3.5 text-warning" />
            <span className="text-xs font-medium text-warning uppercase tracking-wide">Upcoming</span>
            <span className="text-xs text-muted">({pending.length})</span>
          </div>
          <div className="space-y-2">
            {pending.slice(0, 4).map((post) => {
              const channel = channelMap[post.channelId];
              const service = channel?.service || 'unknown';
              return (
                <div key={post.id} className="flex items-start gap-3 p-2.5 rounded-lg bg-background/50 border border-border/50">
                  <ServiceIcon service={service} className={`w-4 h-4 mt-0.5 shrink-0 ${serviceColors[service] || 'text-muted'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground leading-snug">{truncate(post.text)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted">{formatDate(post.dueAt)}</span>
                      {channel && <span className="text-xs text-muted">· {channel.name}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {sent.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Calendar className="w-3.5 h-3.5 text-success" />
            <span className="text-xs font-medium text-success uppercase tracking-wide">Recently Sent</span>
          </div>
          <div className="space-y-2">
            {sent.slice(0, 4).map((post) => {
              const channel = channelMap[post.channelId];
              const service = channel?.service || 'unknown';
              return (
                <div key={post.id} className="flex items-start gap-3 p-2.5 rounded-lg bg-background/50 border border-border/50">
                  <ServiceIcon service={service} className={`w-4 h-4 mt-0.5 shrink-0 ${serviceColors[service] || 'text-muted'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground/80 leading-snug">{truncate(post.text)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted">{timeAgo(post.sentAt || post.dueAt)}</span>
                      {channel && <span className="text-xs text-muted">· {channel.name}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {pending.length === 0 && sent.length === 0 && (
        <p className="text-sm text-muted text-center py-4">No recent or upcoming posts.</p>
      )}
    </div>
  );
}
