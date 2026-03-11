'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Bot,
  RefreshCw,
  Calendar,
  Eye,
  Activity,
  FileText,
  Clock,
  Globe,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

interface BotSummary {
  total: number;
  firstVisit: string | null;
  byBot: Array<{ bot_name: string; visits: string }>;
  byDay: Array<{ date: string; bot_name: string; visits: string }>;
  byPage: Array<{ path: string; visits: string; unique_bots: string; bots: string[] }>;
  recent: Array<{
    bot_name: string;
    path: string;
    ip_address: string;
    country: string;
    city: string;
    referer: string;
    visited_at: string;
  }>;
  byHour: Array<{ hour: number; visits: string }>;
}

const BOT_COLORS: Record<string, string> = {
  'ChatGPT-User': '#10a37f',
  'GPTBot': '#10a37f',
  'Googlebot': '#4285F4',
  'Google-Extended': '#EA4335',
  'PerplexityBot': '#20808D',
  'ClaudeBot': '#D4A574',
  'Claude-Web': '#D4A574',
  'Bingbot': '#00809D',
  'Amazonbot': '#FF9900',
  'Applebot': '#A2AAAD',
  'anthropic-ai': '#D4A574',
  'cohere-ai': '#6C63FF',
  'Meta-ExternalAgent': '#0668E1',
  'Bytespider': '#000000',
  'CCBot': '#888888',
  'YouBot': '#5436DA',
};

function getBotColor(botName: string): string {
  return BOT_COLORS[botName] || '#6b7280';
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function BotActivityPage() {
  const [data, setData] = useState<BotSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [daysBack, setDaysBack] = useState(30);
  const [activeTab, setActiveTab] = useState<'overview' | 'pages' | 'log'>('overview');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/bot-activity?days=${daysBack}`);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error('Failed to load bot activity:', error);
    } finally {
      setLoading(false);
    }
  }, [daysBack]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const chatgptVisits = data?.byBot.find(
    b => b.bot_name === 'ChatGPT-User' || b.bot_name === 'GPTBot'
  );

  const dailyTotals = data?.byDay.reduce<Record<string, Record<string, number>>>((acc, row) => {
    const date = row.date.split('T')[0];
    if (!acc[date]) acc[date] = {};
    acc[date][row.bot_name] = parseInt(row.visits);
    return acc;
  }, {}) || {};

  const dailyDates = Object.keys(dailyTotals).sort();
  const maxDailyTotal = Math.max(
    ...dailyDates.map(d => Object.values(dailyTotals[d]).reduce((s, v) => s + v, 0)),
    1
  );

  const allBotNames = [...new Set(data?.byDay.map(r => r.bot_name) || [])];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Bot className="w-6 h-6 text-accent" />
            Bot Activity
          </h1>
          <p className="text-sm text-muted mt-1">
            AI crawler and bot visits to your site
            {data?.firstVisit && (
              <span className="text-muted/60"> &middot; tracking since {new Date(data.firstVisit).toLocaleDateString()}</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={daysBack}
            onChange={(e) => setDaysBack(parseInt(e.target.value))}
            className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground"
          >
            <option value={7}>Last 7 days</option>
            <option value={14}>Last 14 days</option>
            <option value={30}>Last 30 days</option>
            <option value={60}>Last 60 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors"
          >
            <RefreshCw className={`w-4 h-4 text-muted ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading && !data ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-6 h-6 text-accent animate-spin" />
        </div>
      ) : data ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-surface border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 text-muted text-xs uppercase tracking-wide mb-2">
                <Eye className="w-3.5 h-3.5" />
                Total Bot Visits
              </div>
              <div className="text-3xl font-bold text-foreground">{data.total.toLocaleString()}</div>
              <div className="text-xs text-muted mt-1">last {daysBack} days</div>
            </div>

            <div className="bg-surface border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 text-muted text-xs uppercase tracking-wide mb-2">
                <Bot className="w-3.5 h-3.5" />
                Unique Bots
              </div>
              <div className="text-3xl font-bold text-foreground">{data.byBot.length}</div>
              <div className="text-xs text-muted mt-1">distinct crawlers</div>
            </div>

            <div className="bg-surface border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wide mb-2" style={{ color: '#10a37f' }}>
                <Activity className="w-3.5 h-3.5" />
                ChatGPT
              </div>
              <div className="text-3xl font-bold text-foreground">
                {chatgptVisits ? parseInt(chatgptVisits.visits).toLocaleString() : '0'}
              </div>
              <div className="text-xs text-muted mt-1">ChatGPT-User + GPTBot</div>
            </div>

            <div className="bg-surface border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 text-muted text-xs uppercase tracking-wide mb-2">
                <FileText className="w-3.5 h-3.5" />
                Pages Crawled
              </div>
              <div className="text-3xl font-bold text-foreground">{data.byPage.length}</div>
              <div className="text-xs text-muted mt-1">unique paths</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-border mb-6">
            {(['overview', 'pages', 'log'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-accent text-accent'
                    : 'border-transparent text-muted hover:text-foreground'
                }`}
              >
                {tab === 'overview' ? 'Overview' : tab === 'pages' ? 'Pages' : 'Visit Log'}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Daily Activity Chart */}
              <div className="bg-surface border border-border rounded-xl p-6">
                <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  Daily Activity
                </h2>
                {dailyDates.length > 0 ? (
                  <div className="space-y-1">
                    {dailyDates.map((date) => {
                      const dayBots = dailyTotals[date];
                      const dayTotal = Object.values(dayBots).reduce((s, v) => s + v, 0);
                      return (
                        <div key={date} className="flex items-center gap-3 group">
                          <span className="text-xs text-muted w-16 shrink-0 font-mono">
                            {formatDate(date)}
                          </span>
                          <div className="flex-1 flex h-5 rounded overflow-hidden bg-surface-hover">
                            {allBotNames.map((bot) => {
                              const count = dayBots[bot] || 0;
                              if (count === 0) return null;
                              const pct = (count / maxDailyTotal) * 100;
                              return (
                                <div
                                  key={bot}
                                  className="h-full transition-all"
                                  style={{
                                    width: `${pct}%`,
                                    backgroundColor: getBotColor(bot),
                                    opacity: 0.85,
                                  }}
                                  title={`${bot}: ${count}`}
                                />
                              );
                            })}
                          </div>
                          <span className="text-xs text-muted w-8 text-right font-mono">
                            {dayTotal}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-muted text-sm py-8 text-center">No bot activity recorded yet. Data will appear once crawlers visit your site.</p>
                )}
                {/* Legend */}
                {allBotNames.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border">
                    {allBotNames.map((bot) => (
                      <div key={bot} className="flex items-center gap-1.5">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: getBotColor(bot) }}
                        />
                        <span className="text-xs text-muted">{bot}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bot Breakdown + Hourly Heatmap */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Bot Breakdown */}
                <div className="bg-surface border border-border rounded-xl p-6">
                  <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Bot className="w-4 h-4 text-accent" />
                    Visits by Bot
                  </h2>
                  <div className="space-y-3">
                    {data.byBot.map((bot) => {
                      const visits = parseInt(bot.visits);
                      const pct = data.total > 0 ? (visits / data.total) * 100 : 0;
                      return (
                        <div key={bot.bot_name}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-foreground font-medium">{bot.bot_name}</span>
                            <span className="text-xs text-muted">{visits.toLocaleString()} ({pct.toFixed(0)}%)</span>
                          </div>
                          <div className="w-full h-2 bg-surface-hover rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${pct}%`,
                                backgroundColor: getBotColor(bot.bot_name),
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                    {data.byBot.length === 0 && (
                      <p className="text-muted text-sm text-center py-4">No bot visits yet</p>
                    )}
                  </div>
                </div>

                {/* Hourly Distribution */}
                <div className="bg-surface border border-border rounded-xl p-6">
                  <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-accent" />
                    Hourly Distribution (UTC)
                  </h2>
                  {data.byHour.length > 0 ? (
                    <div className="flex items-end gap-[3px] h-32">
                      {Array.from({ length: 24 }, (_, h) => {
                        const match = data.byHour.find(r => r.hour === h);
                        const visits = match ? parseInt(match.visits) : 0;
                        const maxHour = Math.max(...data.byHour.map(r => parseInt(r.visits)), 1);
                        const pct = (visits / maxHour) * 100;
                        return (
                          <div
                            key={h}
                            className="flex-1 rounded-t transition-all hover:opacity-80"
                            style={{
                              height: `${Math.max(pct, 2)}%`,
                              backgroundColor: visits > 0 ? 'var(--color-accent)' : 'var(--color-surface-hover)',
                              opacity: visits > 0 ? 0.7 + (pct / 100) * 0.3 : 0.3,
                            }}
                            title={`${h}:00 UTC — ${visits} visits`}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-muted text-sm text-center py-8">No data yet</p>
                  )}
                  <div className="flex justify-between mt-2">
                    <span className="text-[10px] text-muted">0:00</span>
                    <span className="text-[10px] text-muted">6:00</span>
                    <span className="text-[10px] text-muted">12:00</span>
                    <span className="text-[10px] text-muted">18:00</span>
                    <span className="text-[10px] text-muted">23:00</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pages' && (
            <div className="bg-surface border border-border rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-medium text-muted uppercase tracking-wide px-5 py-3">Path</th>
                    <th className="text-right text-xs font-medium text-muted uppercase tracking-wide px-5 py-3">Visits</th>
                    <th className="text-right text-xs font-medium text-muted uppercase tracking-wide px-5 py-3">Bots</th>
                    <th className="text-left text-xs font-medium text-muted uppercase tracking-wide px-5 py-3">Crawlers</th>
                  </tr>
                </thead>
                <tbody>
                  {data.byPage.map((page, i) => (
                    <tr key={page.path} className={`border-b border-border/50 ${i % 2 === 0 ? 'bg-surface' : 'bg-surface-hover/30'}`}>
                      <td className="px-5 py-3">
                        <span className="text-sm text-foreground font-mono">{page.path}</span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span className="text-sm font-medium text-foreground">{parseInt(page.visits).toLocaleString()}</span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span className="text-sm text-muted">{page.unique_bots}</span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex flex-wrap gap-1">
                          {page.bots.map((bot) => (
                            <span
                              key={bot}
                              className="text-[10px] px-1.5 py-0.5 rounded-full text-white/90"
                              style={{ backgroundColor: getBotColor(bot) }}
                            >
                              {bot}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {data.byPage.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-muted text-sm">
                        No pages crawled yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'log' && (
            <div className="bg-surface border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs font-medium text-muted uppercase tracking-wide px-5 py-3">When</th>
                      <th className="text-left text-xs font-medium text-muted uppercase tracking-wide px-5 py-3">Bot</th>
                      <th className="text-left text-xs font-medium text-muted uppercase tracking-wide px-5 py-3">Path</th>
                      <th className="text-left text-xs font-medium text-muted uppercase tracking-wide px-5 py-3">Location</th>
                      <th className="text-left text-xs font-medium text-muted uppercase tracking-wide px-5 py-3">Referer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recent.map((visit, i) => (
                      <tr key={i} className={`border-b border-border/50 ${i % 2 === 0 ? 'bg-surface' : 'bg-surface-hover/30'}`}>
                        <td className="px-5 py-3 whitespace-nowrap">
                          <span className="text-xs text-muted" title={new Date(visit.visited_at).toLocaleString()}>
                            {timeAgo(visit.visited_at)}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className="text-xs px-2 py-0.5 rounded-full text-white/90 font-medium"
                            style={{ backgroundColor: getBotColor(visit.bot_name) }}
                          >
                            {visit.bot_name}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <span className="text-sm font-mono text-foreground">{visit.path}</span>
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap">
                          {visit.city || visit.country ? (
                            <span className="text-xs text-muted flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              {[visit.city, visit.country].filter(Boolean).join(', ')}
                            </span>
                          ) : (
                            <span className="text-xs text-muted/50">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3 max-w-[200px]">
                          {visit.referer ? (
                            <a
                              href={visit.referer}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-accent hover:underline truncate flex items-center gap-1"
                            >
                              {new URL(visit.referer).hostname}
                              <ArrowUpRight className="w-3 h-3 shrink-0" />
                            </a>
                          ) : (
                            <span className="text-xs text-muted/50">direct</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {data.recent.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-5 py-8 text-center text-muted text-sm">
                          No visits recorded yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 text-muted">Failed to load data</div>
      )}
    </div>
  );
}
