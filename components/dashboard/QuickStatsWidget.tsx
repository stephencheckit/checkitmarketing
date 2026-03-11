'use client';

import { Bot, FileText, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface QuickStats {
  botVisits7d: number;
  contentTotal: number;
  contentPublished: number;
  contentInProgress: number;
  ppcLeads30d: number;
}

const statCards = [
  {
    key: 'bots' as const,
    icon: Bot,
    label: 'Bot Visits',
    sublabel: 'last 7 days',
    color: 'text-gray-400',
    href: '/bot-activity',
    getValue: (s: QuickStats) => s.botVisits7d,
  },
  {
    key: 'content' as const,
    icon: FileText,
    label: 'Content',
    sublabel: (s: QuickStats) => `${s.contentPublished} published, ${s.contentInProgress} in progress`,
    color: 'text-teal-400',
    href: '/content',
    getValue: (s: QuickStats) => s.contentTotal,
  },
  {
    key: 'ppc' as const,
    icon: ArrowUpRight,
    label: 'PPC Leads',
    sublabel: 'last 30 days',
    color: 'text-green-400',
    href: '/ppc-performance',
    getValue: (s: QuickStats) => s.ppcLeads30d,
  },
];

export default function QuickStatsWidget({ data }: { data: QuickStats | null }) {
  if (!data) return null;

  return (
    <div className="grid grid-cols-3 gap-3">
      {statCards.map((card) => {
        const Icon = card.icon;
        const sublabel = typeof card.sublabel === 'function' ? card.sublabel(data) : card.sublabel;
        return (
          <Link
            key={card.key}
            href={card.href}
            className="bg-surface border border-border rounded-xl p-4 card-glow hover:border-border-accent transition-all group"
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-4 h-4 ${card.color}`} />
              <span className="text-xs text-muted">{card.label}</span>
            </div>
            <p className="text-2xl font-bold text-foreground group-hover:text-accent transition-colors">
              {card.getValue(data)}
            </p>
            <p className="text-xs text-muted mt-0.5">{sublabel}</p>
          </Link>
        );
      })}
    </div>
  );
}
