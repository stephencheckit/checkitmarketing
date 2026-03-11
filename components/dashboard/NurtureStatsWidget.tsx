'use client';

import { Mail, Users, TrendingUp, MousePointer, Eye } from 'lucide-react';
import Link from 'next/link';

interface NurtureData {
  activeEnrollments: number;
  totalEnrollments: number;
  emailsSent7d: number;
  openRate: number;
  clickRate: number;
}

export default function NurtureStatsWidget({ data }: { data: NurtureData | null }) {
  if (!data) {
    return (
      <div className="bg-surface border border-border rounded-xl p-6 card-glow">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="w-5 h-5 text-accent" />
          <h2 className="font-semibold">Nurture Emails</h2>
        </div>
        <p className="text-sm text-muted text-center py-4">Unable to load nurture data.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-6 card-glow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-accent" />
          <h2 className="font-semibold">Nurture Emails</h2>
        </div>
        <Link href="/nurture" className="text-xs text-accent hover:text-accent-hover transition-colors">
          View all
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-background/50 rounded-lg p-3 border border-border/50">
          <div className="flex items-center gap-1.5 mb-1">
            <Users className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-xs text-muted">Active</span>
          </div>
          <p className="text-xl font-bold text-gradient">{data.activeEnrollments}</p>
          <p className="text-xs text-muted">{data.totalEnrollments} total enrolled</p>
        </div>

        <div className="bg-background/50 rounded-lg p-3 border border-border/50">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-xs text-muted">Sent (7d)</span>
          </div>
          <p className="text-xl font-bold text-foreground">{data.emailsSent7d}</p>
          <p className="text-xs text-muted">emails this week</p>
        </div>

        <div className="bg-background/50 rounded-lg p-3 border border-border/50">
          <div className="flex items-center gap-1.5 mb-1">
            <Eye className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs text-muted">Open Rate</span>
          </div>
          <p className="text-xl font-bold text-foreground">{data.openRate}%</p>
          <p className="text-xs text-muted">last 30 days</p>
        </div>

        <div className="bg-background/50 rounded-lg p-3 border border-border/50">
          <div className="flex items-center gap-1.5 mb-1">
            <MousePointer className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs text-muted">Click Rate</span>
          </div>
          <p className="text-xl font-bold text-foreground">{data.clickRate}%</p>
          <p className="text-xs text-muted">last 30 days</p>
        </div>
      </div>
    </div>
  );
}
