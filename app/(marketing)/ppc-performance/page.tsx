'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Star,
  Linkedin,
  Search,
  RefreshCw,
  Download,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Filter,
  Mail,
  Building2,
  Briefcase,
  Phone,
  Eye,
  EyeOff,
  MousePointerClick,
  FileText,
  Globe,
  ArrowUpRight,
  Circle,
} from 'lucide-react';

interface PpcLead {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  phone: string | null;
  job_title: string | null;
  source: string;
  listing: string | null;
  category_name: string | null;
  page_url: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  status: string;
  notes: string | null;
  created_at: string;
}

interface PpcStats {
  total: number;
  bySource: Array<{ source: string; count: string }>;
  byStatus: Array<{ status: string; count: string }>;
  byDay: Array<{ date: string; source: string; count: string }>;
  byListing: Array<{ source: string; listing: string; category_name: string; count: string }>;
  byWeek: Array<{ week: string; source: string; count: string }>;
  topCompanies: Array<{ company: string; source: string; lead_count: string; first_lead: string; latest_lead: string }>;
}

interface PageStats {
  source: string;
  listing: string;
  category_name: string;
  page_url: string;
  total_leads: string;
  new_leads: string;
  contacted_leads: string;
  qualified_leads: string;
  converted_leads: string;
  first_lead: string;
  last_lead: string;
}

// Static registry of all landing pages (so pages with 0 leads still show)
const ALL_LANDING_PAGES: Array<{
  source: string;
  listing: string;
  category: string;
  path: string;
}> = [
  // Capterra pages
  { source: 'capterra', listing: 'iot', category: 'IoT Software', path: '/capterra/iot' },
  { source: 'capterra', listing: 'iot-analytics', category: 'IoT Analytics Software', path: '/capterra/iot-analytics' },
  { source: 'capterra', listing: 'asset-tracking', category: 'Asset Tracking Software', path: '/capterra/asset-tracking' },
  { source: 'capterra', listing: 'audit', category: 'Audit Software', path: '/capterra/audit' },
  { source: 'capterra', listing: 'business-performance-management', category: 'Business Performance Management', path: '/capterra/business-performance-management' },
  { source: 'capterra', listing: 'calibration-management', category: 'Calibration Management', path: '/capterra/calibration-management' },
  { source: 'capterra', listing: 'compliance', category: 'Compliance Software', path: '/capterra/compliance' },
  { source: 'capterra', listing: 'eam', category: 'Enterprise Asset Management', path: '/capterra/eam' },
  { source: 'capterra', listing: 'ehs-management', category: 'EHS Management', path: '/capterra/ehs-management' },
  { source: 'capterra', listing: 'environmental', category: 'Environmental Software', path: '/capterra/environmental' },
  { source: 'capterra', listing: 'fixed-asset-management', category: 'Fixed Asset Management', path: '/capterra/fixed-asset-management' },
  { source: 'capterra', listing: 'food-service-management', category: 'Food Service Management', path: '/capterra/food-service-management' },
  { source: 'capterra', listing: 'forms-automation', category: 'Forms Automation', path: '/capterra/forms-automation' },
  { source: 'capterra', listing: 'grc', category: 'Governance, Risk & Compliance', path: '/capterra/grc' },
  { source: 'capterra', listing: 'inspection', category: 'Inspection Software', path: '/capterra/inspection' },
  { source: 'capterra', listing: 'nursing-home', category: 'Nursing Home Software', path: '/capterra/nursing-home' },
  { source: 'capterra', listing: 'quality-management', category: 'Quality Management', path: '/capterra/quality-management' },
  { source: 'capterra', listing: 'risk-management', category: 'Risk Management', path: '/capterra/risk-management' },
  { source: 'capterra', listing: 'training', category: 'Training Software', path: '/capterra/training' },
  { source: 'capterra', listing: 'workforce-management', category: 'Workforce Management', path: '/capterra/workforce-management' },
  // Google Ads pages
  { source: 'google', listing: 'temperature-monitoring', category: 'Temperature Monitoring', path: '/google/temperature-monitoring' },
  // LinkedIn pages
  { source: 'linkedin', listing: 'nhs-pharmacy', category: 'NHS Pharmacy', path: '/linkedin/nhs-pharmacy' },
];

const sourceConfig: Record<string, { label: string; color: string; bgColor: string; icon: React.ComponentType<{ className?: string }> }> = {
  capterra: { label: 'Capterra', color: 'text-blue-400', bgColor: 'bg-blue-500/20', icon: Star },
  google: { label: 'Google Ads', color: 'text-green-400', bgColor: 'bg-green-500/20', icon: Search },
  linkedin: { label: 'LinkedIn', color: 'text-sky-400', bgColor: 'bg-sky-500/20', icon: Linkedin },
};

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  new: { label: 'New', color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
  contacted: { label: 'Contacted', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' },
  qualified: { label: 'Qualified', color: 'text-green-400', bgColor: 'bg-green-500/20' },
  disqualified: { label: 'Disqualified', color: 'text-red-400', bgColor: 'bg-red-500/20' },
  converted: { label: 'Converted', color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
};

function getSourceInfo(source: string) {
  return sourceConfig[source] || { label: source, color: 'text-gray-400', bgColor: 'bg-gray-500/20', icon: MousePointerClick };
}

function getStatusInfo(status: string) {
  return statusConfig[status] || { label: status, color: 'text-gray-400', bgColor: 'bg-gray-500/20' };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateShort(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
}

export default function PpcPerformancePage() {
  const [stats, setStats] = useState<PpcStats | null>(null);
  const [leads, setLeads] = useState<PpcLead[]>([]);
  const [pageStats, setPageStats] = useState<PageStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'leads' | 'sources' | 'pages'>('overview');
  const [daysBack, setDaysBack] = useState(90);
  const [sourceFilter, setSourceFilter] = useState<string | null>(null);
  const [expandedLead, setExpandedLead] = useState<number | null>(null);
  const [updatingLead, setUpdatingLead] = useState<number | null>(null);
  const [pagesSortBy, setPagesSortBy] = useState<'leads' | 'recent' | 'name'>('leads');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, leadsRes, pagesRes] = await Promise.all([
        fetch(`/api/ppc-leads?view=stats&days=${daysBack}`),
        fetch(`/api/ppc-leads?view=leads&days=${daysBack}${sourceFilter ? `&source=${sourceFilter}` : ''}`),
        fetch('/api/ppc-leads?view=pages'),
      ]);

      if (!statsRes.ok || !leadsRes.ok) throw new Error('Failed to fetch data');

      const statsData = await statsRes.json();
      const leadsData = await leadsRes.json();
      const pagesData = pagesRes.ok ? await pagesRes.json() : { pages: [] };

      setStats(statsData);
      setLeads(leadsData.leads || []);
      setPageStats(pagesData.pages || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [daysBack, sourceFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateLeadStatus = async (id: number, newStatus: string) => {
    setUpdatingLead(id);
    try {
      const res = await fetch('/api/ppc-leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
        // Refresh stats
        const statsRes = await fetch(`/api/ppc-leads?view=stats&days=${daysBack}`);
        if (statsRes.ok) setStats(await statsRes.json());
      }
    } catch {
      // silent fail
    } finally {
      setUpdatingLead(null);
    }
  };

  const exportCSV = () => {
    if (leads.length === 0) return;
    const headers = ['Date', 'Source', 'Name', 'Email', 'Company', 'Job Title', 'Phone', 'Listing', 'Status', 'UTM Source', 'UTM Medium', 'UTM Campaign'];
    const rows = leads.map(l => [
      formatDate(l.created_at),
      getSourceInfo(l.source).label,
      `${l.first_name} ${l.last_name}`,
      l.email,
      l.company,
      l.job_title || '',
      l.phone || '',
      l.category_name || l.listing || '',
      l.status,
      l.utm_source || '',
      l.utm_medium || '',
      l.utm_campaign || '',
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ppc-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Build weekly trend data for the simple bar chart
  const weeklyTrend = stats?.byWeek?.reduce<Record<string, Record<string, number>>>((acc, row) => {
    const week = formatDateShort(row.week);
    if (!acc[week]) acc[week] = {};
    acc[week][row.source] = parseInt(row.count);
    return acc;
  }, {}) || {};

  const sourceBreakdown = stats?.bySource?.reduce<Record<string, number>>((acc, row) => {
    acc[row.source] = parseInt(row.count);
    return acc;
  }, {}) || {};

  const totalLeads = stats?.total || 0;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <MousePointerClick className="w-7 h-7" style={{ stroke: 'url(#icon-gradient)' }} />
              PPC Landing Pages
            </h1>
            <p className="text-sm text-muted mt-1">
              Track lead performance across Capterra, Google Ads, and LinkedIn landing pages
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              disabled={leads.length === 0}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-surface-elevated text-foreground rounded-lg hover:bg-surface border border-border transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Refresh
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Time Range */}
          <div className="flex items-center gap-1 bg-surface border border-border rounded-lg p-1">
            {[
              { value: 7, label: '7d' },
              { value: 30, label: '30d' },
              { value: 90, label: '90d' },
              { value: 365, label: '1y' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setDaysBack(opt.value)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  daysBack === opt.value ? 'bg-accent text-white' : 'text-muted hover:text-foreground'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Source Filter */}
          <div className="flex items-center gap-1 bg-surface border border-border rounded-lg p-1">
            <button
              onClick={() => setSourceFilter(null)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                !sourceFilter ? 'bg-accent text-white' : 'text-muted hover:text-foreground'
              }`}
            >
              All
            </button>
            {Object.entries(sourceConfig).map(([key, cfg]) => {
              const Icon = cfg.icon;
              return (
                <button
                  key={key}
                  onClick={() => setSourceFilter(key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors ${
                    sourceFilter === key ? 'bg-accent text-white' : 'text-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cfg.label}
                </button>
              );
            })}
          </div>

          {/* View Mode */}
          <div className="flex items-center gap-1 bg-surface border border-border rounded-lg p-1 ml-auto">
            <button
              onClick={() => setViewMode('overview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors ${
                viewMode === 'overview' ? 'bg-accent text-white' : 'text-muted hover:text-foreground'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Overview
            </button>
            <button
              onClick={() => setViewMode('leads')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors ${
                viewMode === 'leads' ? 'bg-accent text-white' : 'text-muted hover:text-foreground'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Leads
            </button>
            <button
              onClick={() => setViewMode('sources')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors ${
                viewMode === 'sources' ? 'bg-accent text-white' : 'text-muted hover:text-foreground'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              By Source
            </button>
            <button
              onClick={() => setViewMode('pages')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors ${
                viewMode === 'pages' ? 'bg-accent text-white' : 'text-muted hover:text-foreground'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Landing Pages
            </button>
          </div>
        </div>

        {/* Loading / Error */}
        {loading && !stats && (
          <div className="bg-surface border border-border rounded-xl p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-accent mb-4" />
            <p className="text-muted">Loading PPC data...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
            <p className="text-sm text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </p>
          </div>
        )}

        {/* Overview */}
        {!loading && stats && viewMode === 'overview' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-surface border border-border rounded-xl p-4">
                <div className="text-2xl font-bold text-foreground">{totalLeads}</div>
                <div className="text-sm text-muted">Total Leads</div>
                <div className="text-xs text-muted mt-1">Last {daysBack} days</div>
              </div>
              {Object.entries(sourceConfig).map(([key, cfg]) => {
                const Icon = cfg.icon;
                const count = sourceBreakdown[key] || 0;
                return (
                  <div key={key} className="bg-surface border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-1">
                      <div className={`w-8 h-8 rounded-lg ${cfg.bgColor} flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 ${cfg.color}`} />
                      </div>
                      {totalLeads > 0 && (
                        <span className="text-xs text-muted">
                          {Math.round((count / totalLeads) * 100)}%
                        </span>
                      )}
                    </div>
                    <div className={`text-2xl font-bold ${cfg.color}`}>{count}</div>
                    <div className="text-sm text-muted">{cfg.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Status Breakdown */}
            {stats.byStatus.length > 0 && (
              <div className="bg-surface border border-border rounded-xl p-4">
                <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-accent" />
                  Lead Status
                </h3>
                <div className="flex flex-wrap gap-3">
                  {stats.byStatus.map(row => {
                    const info = getStatusInfo(row.status);
                    const count = parseInt(row.count);
                    const pct = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
                    return (
                      <div key={row.status} className="flex items-center gap-2 bg-surface-elevated rounded-lg px-4 py-2">
                        <span className={`px-2 py-0.5 text-xs rounded-full ${info.bgColor} ${info.color}`}>
                          {info.label}
                        </span>
                        <span className="text-lg font-semibold text-foreground">{count}</span>
                        <span className="text-xs text-muted">({pct}%)</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Weekly Trend */}
            {Object.keys(weeklyTrend).length > 0 && (
              <div className="bg-surface border border-border rounded-xl p-4">
                <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  Weekly Trend
                </h3>
                <div className="flex items-end gap-2 h-40">
                  {Object.entries(weeklyTrend).map(([week, sources]) => {
                    const total = Object.values(sources).reduce((s, v) => s + v, 0);
                    const maxTotal = Math.max(...Object.values(weeklyTrend).map(s => Object.values(s).reduce((sum, v) => sum + v, 0)));
                    const height = maxTotal > 0 ? (total / maxTotal) * 100 : 0;

                    return (
                      <div key={week} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                        <span className="text-xs text-muted font-medium">{total}</span>
                        <div className="w-full flex flex-col-reverse rounded-t overflow-hidden" style={{ height: `${Math.max(height, 4)}%` }}>
                          {Object.entries(sourceConfig).map(([source, cfg]) => {
                            const count = sources[source] || 0;
                            if (count === 0 || total === 0) return null;
                            const segmentPct = (count / total) * 100;
                            return (
                              <div
                                key={source}
                                className={cfg.bgColor.replace('/20', '')}
                                style={{ height: `${segmentPct}%`, minHeight: count > 0 ? '2px' : '0' }}
                                title={`${cfg.label}: ${count}`}
                              />
                            );
                          })}
                        </div>
                        <span className="text-[10px] text-muted truncate w-full text-center">{week}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-center gap-4 mt-3">
                  {Object.entries(sourceConfig).map(([key, cfg]) => {
                    const Icon = cfg.icon;
                    return (
                      <div key={key} className="flex items-center gap-1.5 text-xs text-muted">
                        <div className={`w-2.5 h-2.5 rounded-sm ${cfg.bgColor.replace('/20', '')}`} />
                        {cfg.label}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Listing Breakdown */}
            {stats.byListing.length > 0 && (
              <div className="bg-surface border border-border rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-border bg-surface-elevated">
                  <h3 className="font-medium text-foreground">Leads by Listing / Category</h3>
                </div>
                <div className="divide-y divide-border">
                  {stats.byListing.map((row, idx) => {
                    const info = getSourceInfo(row.source);
                    const Icon = info.icon;
                    const count = parseInt(row.count);
                    const pct = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
                    return (
                      <div key={idx} className="px-4 py-3 flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${info.bgColor} flex items-center justify-center shrink-0`}>
                          <Icon className={`w-4 h-4 ${info.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-foreground truncate">
                              {row.category_name || row.listing || 'Direct'}
                            </span>
                            <span className="text-sm text-muted ml-2 shrink-0">
                              {count} lead{count !== 1 ? 's' : ''} ({pct}%)
                            </span>
                          </div>
                          <div className="h-1.5 bg-surface-elevated rounded-full overflow-hidden">
                            <div className={`h-full ${info.bgColor.replace('/20', '')} rounded-full`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Top Companies */}
            {stats.topCompanies.length > 0 && (
              <div className="bg-surface border border-border rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-border bg-surface-elevated">
                  <h3 className="font-medium text-foreground">Top Companies</h3>
                </div>
                <div className="divide-y divide-border">
                  {stats.topCompanies.slice(0, 10).map((row, idx) => {
                    const info = getSourceInfo(row.source);
                    return (
                      <div key={idx} className="px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-surface-elevated flex items-center justify-center text-sm font-medium text-muted">
                            {idx + 1}
                          </div>
                          <div>
                            <span className="font-medium text-foreground">{row.company}</span>
                            <div className="flex items-center gap-2 text-xs text-muted mt-0.5">
                              <span className={`${info.color}`}>{info.label}</span>
                              <span>First: {formatDateShort(row.first_lead)}</span>
                            </div>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {row.lead_count} lead{parseInt(row.lead_count) !== 1 ? 's' : ''}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty State */}
            {totalLeads === 0 && (
              <div className="bg-surface border border-border rounded-xl p-12 text-center">
                <MousePointerClick className="w-12 h-12 mx-auto text-muted/30 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No PPC leads yet</h3>
                <p className="text-sm text-muted max-w-md mx-auto">
                  Once visitors fill out forms on your Capterra, Google Ads, or LinkedIn landing pages,
                  leads will appear here with full attribution tracking.
                </p>
                <div className="flex items-center justify-center gap-4 mt-6">
                  {Object.entries(sourceConfig).map(([key, cfg]) => {
                    const Icon = cfg.icon;
                    return (
                      <div key={key} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${cfg.bgColor}`}>
                        <Icon className={`w-4 h-4 ${cfg.color}`} />
                        <span className={`text-sm ${cfg.color}`}>{cfg.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Leads View */}
        {!loading && viewMode === 'leads' && (
          <div className="space-y-4">
            {leads.length === 0 ? (
              <div className="bg-surface border border-border rounded-xl p-8 text-center">
                <Users className="w-12 h-12 mx-auto text-muted/30 mb-4" />
                <p className="text-muted">No leads found for this period</p>
              </div>
            ) : (
              <>
                <div className="text-sm text-muted mb-2">
                  Showing {leads.length} lead{leads.length !== 1 ? 's' : ''}
                </div>
                {leads.map(lead => {
                  const info = getSourceInfo(lead.source);
                  const statusInfo = getStatusInfo(lead.status);
                  const Icon = info.icon;
                  const isExpanded = expandedLead === lead.id;

                  return (
                    <div key={lead.id} className="bg-surface border border-border rounded-xl overflow-hidden">
                      <div
                        className="p-4 cursor-pointer hover:bg-surface-elevated/50 transition-colors"
                        onClick={() => setExpandedLead(isExpanded ? null : lead.id)}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg ${info.bgColor} flex items-center justify-center shrink-0`}>
                            <Icon className={`w-5 h-5 ${info.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground">
                                {lead.first_name} {lead.last_name}
                              </span>
                              <span className={`px-2 py-0.5 text-xs rounded-full ${statusInfo.bgColor} ${statusInfo.color}`}>
                                {statusInfo.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted mt-0.5">
                              <span className="flex items-center gap-1">
                                <Building2 className="w-3 h-3" />
                                {lead.company}
                              </span>
                              {lead.job_title && (
                                <span className="flex items-center gap-1">
                                  <Briefcase className="w-3 h-3" />
                                  {lead.job_title}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-xs text-muted">{timeAgo(lead.created_at)}</div>
                            <div className={`text-xs ${info.color} mt-0.5`}>{info.label}</div>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-muted transition-transform shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="px-4 pb-4 border-t border-border pt-4 space-y-3">
                          {/* Contact Info */}
                          <div className="grid md:grid-cols-3 gap-3">
                            <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-sm text-accent hover:underline">
                              <Mail className="w-4 h-4" />
                              {lead.email}
                            </a>
                            {lead.phone && (
                              <a href={`tel:${lead.phone}`} className="flex items-center gap-2 text-sm text-accent hover:underline">
                                <Phone className="w-4 h-4" />
                                {lead.phone}
                              </a>
                            )}
                            <div className="flex items-center gap-2 text-sm text-muted">
                              <Clock className="w-4 h-4" />
                              {formatDate(lead.created_at)}
                            </div>
                          </div>

                          {/* Attribution */}
                          <div className="bg-surface-elevated rounded-lg p-3">
                            <h4 className="text-xs font-medium text-muted mb-2">Attribution</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                              {lead.category_name && (
                                <div>
                                  <span className="text-muted">Listing:</span>
                                  <span className="text-foreground ml-1">{lead.category_name}</span>
                                </div>
                              )}
                              {lead.utm_source && (
                                <div>
                                  <span className="text-muted">utm_source:</span>
                                  <span className="text-foreground ml-1">{lead.utm_source}</span>
                                </div>
                              )}
                              {lead.utm_medium && (
                                <div>
                                  <span className="text-muted">utm_medium:</span>
                                  <span className="text-foreground ml-1">{lead.utm_medium}</span>
                                </div>
                              )}
                              {lead.utm_campaign && (
                                <div>
                                  <span className="text-muted">utm_campaign:</span>
                                  <span className="text-foreground ml-1">{lead.utm_campaign}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Status Actions */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted mr-1">Set status:</span>
                            {Object.entries(statusConfig).map(([key, cfg]) => (
                              <button
                                key={key}
                                onClick={(e) => { e.stopPropagation(); updateLeadStatus(lead.id, key); }}
                                disabled={updatingLead === lead.id || lead.status === key}
                                className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                                  lead.status === key
                                    ? `${cfg.bgColor} ${cfg.color} font-medium`
                                    : 'bg-surface-elevated text-muted hover:text-foreground'
                                } disabled:opacity-50`}
                              >
                                {updatingLead === lead.id ? '...' : cfg.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}

        {/* Sources View */}
        {!loading && stats && viewMode === 'sources' && (
          <div className="space-y-6">
            {Object.entries(sourceConfig).map(([key, cfg]) => {
              const Icon = cfg.icon;
              const count = sourceBreakdown[key] || 0;
              const listings = stats.byListing.filter(l => l.source === key);
              const companies = stats.topCompanies.filter(c => c.source === key);

              return (
                <div key={key} className="bg-surface border border-border rounded-xl overflow-hidden">
                  <div className={`px-4 py-4 border-b border-border flex items-center gap-3`}>
                    <div className={`w-10 h-10 rounded-lg ${cfg.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${cfg.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{cfg.label}</h3>
                      <p className="text-sm text-muted">{count} total leads in the last {daysBack} days</p>
                    </div>
                    <div className={`text-3xl font-bold ${cfg.color}`}>{count}</div>
                  </div>

                  {count > 0 ? (
                    <div className="p-4 space-y-4">
                      {/* Listings */}
                      {listings.length > 0 && (
                        <div>
                          <h4 className="text-xs font-medium text-muted mb-2">By Listing</h4>
                          <div className="space-y-1">
                            {listings.map((l, i) => (
                              <div key={i} className="flex items-center justify-between text-sm">
                                <span className="text-foreground">{l.category_name || l.listing || 'Direct'}</span>
                                <span className="text-muted">{l.count}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Companies */}
                      {companies.length > 0 && (
                        <div>
                          <h4 className="text-xs font-medium text-muted mb-2">Top Companies</h4>
                          <div className="space-y-1">
                            {companies.slice(0, 5).map((c, i) => (
                              <div key={i} className="flex items-center justify-between text-sm">
                                <span className="text-foreground">{c.company}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-muted">{c.lead_count}</span>
                                  <span className="text-xs text-muted">{formatDateShort(c.latest_lead)}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-sm text-muted">No leads from {cfg.label} yet</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Landing Pages View */}
        {!loading && viewMode === 'pages' && (
          <div className="space-y-4">
            {/* Sort Controls */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted">
                {ALL_LANDING_PAGES.length} landing pages across {Object.keys(sourceConfig).length} sources
              </div>
              <div className="flex items-center gap-1 bg-surface border border-border rounded-lg p-1">
                <button
                  onClick={() => setPagesSortBy('leads')}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    pagesSortBy === 'leads' ? 'bg-accent text-white' : 'text-muted hover:text-foreground'
                  }`}
                >
                  By Leads
                </button>
                <button
                  onClick={() => setPagesSortBy('recent')}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    pagesSortBy === 'recent' ? 'bg-accent text-white' : 'text-muted hover:text-foreground'
                  }`}
                >
                  Most Recent
                </button>
                <button
                  onClick={() => setPagesSortBy('name')}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    pagesSortBy === 'name' ? 'bg-accent text-white' : 'text-muted hover:text-foreground'
                  }`}
                >
                  A → Z
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="bg-surface border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-surface-elevated">
                      <th className="text-left px-4 py-3 font-medium text-muted">Page</th>
                      <th className="text-left px-4 py-3 font-medium text-muted">Source</th>
                      <th className="text-center px-4 py-3 font-medium text-muted">Total Leads</th>
                      <th className="text-center px-4 py-3 font-medium text-muted">
                        <span className="hidden md:inline">New</span>
                        <span className="md:hidden">N</span>
                      </th>
                      <th className="text-center px-4 py-3 font-medium text-muted">
                        <span className="hidden md:inline">Contacted</span>
                        <span className="md:hidden">C</span>
                      </th>
                      <th className="text-center px-4 py-3 font-medium text-muted">
                        <span className="hidden md:inline">Qualified</span>
                        <span className="md:hidden">Q</span>
                      </th>
                      <th className="text-center px-4 py-3 font-medium text-muted">
                        <span className="hidden md:inline">Converted</span>
                        <span className="md:hidden">W</span>
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-muted">Last Lead</th>
                      <th className="text-center px-4 py-3 font-medium text-muted">Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      // Merge static page list with actual lead data
                      const merged = ALL_LANDING_PAGES
                        .filter(p => !sourceFilter || p.source === sourceFilter)
                        .map(page => {
                          // Match by source + listing
                          const data = pageStats.find(
                            ps => ps.source === page.source && ps.listing === page.listing
                          );
                          return {
                            ...page,
                            totalLeads: parseInt(data?.total_leads || '0'),
                            newLeads: parseInt(data?.new_leads || '0'),
                            contactedLeads: parseInt(data?.contacted_leads || '0'),
                            qualifiedLeads: parseInt(data?.qualified_leads || '0'),
                            convertedLeads: parseInt(data?.converted_leads || '0'),
                            lastLead: data?.last_lead || null,
                            firstLead: data?.first_lead || null,
                          };
                        });

                      // Sort
                      if (pagesSortBy === 'leads') {
                        merged.sort((a, b) => b.totalLeads - a.totalLeads);
                      } else if (pagesSortBy === 'recent') {
                        merged.sort((a, b) => {
                          if (!a.lastLead && !b.lastLead) return 0;
                          if (!a.lastLead) return 1;
                          if (!b.lastLead) return -1;
                          return new Date(b.lastLead).getTime() - new Date(a.lastLead).getTime();
                        });
                      } else {
                        merged.sort((a, b) => a.category.localeCompare(b.category));
                      }

                      return merged.map((page, idx) => {
                        const info = getSourceInfo(page.source);
                        const Icon = info.icon;
                        const hasLeads = page.totalLeads > 0;

                        return (
                          <tr
                            key={`${page.source}-${page.listing}`}
                            className={`border-b border-border/50 transition-colors hover:bg-surface-elevated/50 ${
                              !hasLeads ? 'opacity-60' : ''
                            }`}
                          >
                            {/* Page Name */}
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground">{page.category}</span>
                              </div>
                              <div className="text-xs text-muted mt-0.5">{page.path}</div>
                            </td>

                            {/* Source */}
                            <td className="px-4 py-3">
                              <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs ${info.bgColor} ${info.color}`}>
                                <Icon className="w-3 h-3" />
                                {info.label}
                              </div>
                            </td>

                            {/* Total Leads */}
                            <td className="px-4 py-3 text-center">
                              <span className={`text-lg font-bold ${hasLeads ? 'text-foreground' : 'text-muted/40'}`}>
                                {page.totalLeads}
                              </span>
                            </td>

                            {/* New */}
                            <td className="px-4 py-3 text-center">
                              {page.newLeads > 0 ? (
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">
                                  {page.newLeads}
                                </span>
                              ) : (
                                <span className="text-muted/30">—</span>
                              )}
                            </td>

                            {/* Contacted */}
                            <td className="px-4 py-3 text-center">
                              {page.contactedLeads > 0 ? (
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-medium">
                                  {page.contactedLeads}
                                </span>
                              ) : (
                                <span className="text-muted/30">—</span>
                              )}
                            </td>

                            {/* Qualified */}
                            <td className="px-4 py-3 text-center">
                              {page.qualifiedLeads > 0 ? (
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                                  {page.qualifiedLeads}
                                </span>
                              ) : (
                                <span className="text-muted/30">—</span>
                              )}
                            </td>

                            {/* Converted */}
                            <td className="px-4 py-3 text-center">
                              {page.convertedLeads > 0 ? (
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs font-medium">
                                  {page.convertedLeads}
                                </span>
                              ) : (
                                <span className="text-muted/30">—</span>
                              )}
                            </td>

                            {/* Last Lead */}
                            <td className="px-4 py-3">
                              {page.lastLead ? (
                                <div>
                                  <div className="text-foreground text-xs">{formatDateShort(page.lastLead)}</div>
                                  <div className="text-muted text-xs">{timeAgo(page.lastLead)}</div>
                                </div>
                              ) : (
                                <span className="text-muted/30 text-xs">No leads yet</span>
                              )}
                            </td>

                            {/* Link */}
                            <td className="px-4 py-3 text-center">
                              <a
                                href={`https://checkitv6.com${page.path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-surface-elevated hover:bg-accent/20 text-muted hover:text-accent transition-colors"
                                title={`Open ${page.category} landing page`}
                              >
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </a>
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>

              {/* Summary Footer */}
              <div className="px-4 py-3 bg-surface-elevated border-t border-border flex flex-wrap items-center gap-4 text-xs text-muted">
                {(() => {
                  const filtered = ALL_LANDING_PAGES.filter(p => !sourceFilter || p.source === sourceFilter);
                  const withLeads = filtered.filter(p => 
                    pageStats.some(ps => ps.source === p.source && ps.listing === p.listing)
                  ).length;
                  const totalPageLeads = pageStats
                    .filter(ps => !sourceFilter || ps.source === sourceFilter)
                    .reduce((sum, ps) => sum + parseInt(ps.total_leads || '0'), 0);
                  return (
                    <>
                      <span>{filtered.length} pages total</span>
                      <span className="text-muted/30">|</span>
                      <span>{withLeads} with leads</span>
                      <span className="text-muted/30">|</span>
                      <span>{filtered.length - withLeads} awaiting first lead</span>
                      <span className="text-muted/30">|</span>
                      <span className="text-foreground font-medium">{totalPageLeads} total leads</span>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* No GA Warning */}
            <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-400">No page view analytics</p>
                <p className="text-xs text-muted mt-1">
                  Google Analytics is not installed. Lead counts are tracked but page views, bounce rate, and traffic volume are not available.
                  Add a GA4 Measurement ID to enable full funnel tracking.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
