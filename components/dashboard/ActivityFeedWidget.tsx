'use client';

import {
  Mail, MousePointer, Eye, UserPlus, AlertTriangle,
  FileText, Bot, Megaphone, Send, ArrowUpRight
} from 'lucide-react';

interface ActivityItem {
  type: string;
  ts: string;
  data: Record<string, unknown>;
}

const activityConfig: Record<string, { icon: typeof Mail; color: string; label: string }> = {
  nurture_clicked: { icon: MousePointer, color: 'text-accent', label: 'Nurture click' },
  nurture_opened: { icon: Eye, color: 'text-blue-400', label: 'Email opened' },
  nurture_delivered: { icon: Mail, color: 'text-emerald-400', label: 'Email delivered' },
  nurture_enrolled: { icon: UserPlus, color: 'text-violet-400', label: 'Enrolled' },
  nurture_sent: { icon: Send, color: 'text-sky-400', label: 'Email sent' },
  nurture_bounced: { icon: AlertTriangle, color: 'text-red-400', label: 'Bounced' },
  nurture_complained: { icon: AlertTriangle, color: 'text-red-400', label: 'Complaint' },
  demo_request: { icon: Megaphone, color: 'text-amber-400', label: 'Demo request' },
  content_update: { icon: FileText, color: 'text-teal-400', label: 'Content' },
  bot_visit: { icon: Bot, color: 'text-gray-400', label: 'Bot visit' },
  ppc_lead: { icon: ArrowUpRight, color: 'text-green-400', label: 'PPC lead' },
};

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function describeActivity(item: ActivityItem): string {
  const d = item.data;
  switch (item.type) {
    case 'nurture_clicked':
      return `${d.contact || 'Someone'}${d.company ? ` (${d.company})` : ''} clicked a link${d.subject ? ` in "${d.subject}"` : ''}`;
    case 'nurture_opened':
      return `${d.contact || 'Someone'}${d.company ? ` (${d.company})` : ''} opened "${d.subject || 'an email'}"`;
    case 'nurture_delivered':
      return `Email delivered to ${d.contact || 'a contact'}${d.company ? ` at ${d.company}` : ''}`;
    case 'nurture_enrolled':
      return `${d.contact || 'New contact'}${d.company ? ` from ${d.company}` : ''} enrolled in nurture`;
    case 'nurture_sent':
      return `"${d.subject || 'Email'}" sent to ${d.contact || 'a contact'}${d.company ? ` at ${d.company}` : ''}`;
    case 'nurture_bounced':
      return `Email to ${d.contact || 'a contact'} bounced`;
    case 'nurture_complained':
      return `${d.contact || 'A contact'} marked email as spam`;
    case 'demo_request':
      return `${d.name || 'Someone'}${d.company ? ` from ${d.company}` : ''} requested a demo`;
    case 'content_update':
      return `"${d.title || 'Content'}" ${d.status === 'published' ? 'published' : `updated (${d.status})`}`;
    case 'bot_visit':
      return `${d.bot || 'Bot'} crawled ${d.path || 'a page'}${d.location ? ` from ${d.location}` : ''}`;
    case 'ppc_lead':
      return `New PPC lead from ${d.source || 'unknown'}${d.category ? ` (${d.category})` : ''}`;
    default:
      return 'Activity recorded';
  }
}

export default function ActivityFeedWidget({ items }: { items: ActivityItem[] }) {
  if (!items || items.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-xl p-6 card-glow">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-5 h-5 text-accent" />
          <h2 className="font-semibold">Recent Activity</h2>
        </div>
        <p className="text-sm text-muted text-center py-6">No recent activity.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-6 card-glow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-accent" />
          <h2 className="font-semibold">Recent Activity</h2>
        </div>
        <span className="text-xs text-muted">Last 7 days</span>
      </div>

      <div className="space-y-1 max-h-[420px] overflow-y-auto pr-1">
        {items.map((item, i) => {
          const config = activityConfig[item.type] || { icon: Eye, color: 'text-muted', label: item.type };
          const Icon = config.icon;

          return (
            <div
              key={`${item.type}-${item.ts}-${i}`}
              className="flex items-start gap-3 py-2 px-2 rounded-lg hover:bg-background/50 transition-colors"
            >
              <div className={`mt-0.5 shrink-0 ${config.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground/90 leading-snug">{describeActivity(item)}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted">{timeAgo(item.ts)}</span>
                  <span className="text-xs text-muted/60">{config.label}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
