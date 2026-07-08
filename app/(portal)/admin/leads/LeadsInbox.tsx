'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Mail,
  Phone,
  Building2,
  Clock,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Search,
  Flame,
  Briefcase,
  Layers,
  Link2,
  Sparkles,
} from 'lucide-react';

interface Lead {
  id: number;
  email: string;
  name: string | null;
  company: string | null;
  phone: string | null;
  job_title: string | null;
  first_source: string | null;
  last_source: string | null;
  submission_count: number;
  status: string;
  owner_id: number | null;
  owner_name: string | null;
  notes: string | null;
  followed_up_at: string | null;
  score: number | null;
  score_band: string | null;
  score_rationale: string | null;
  hubspot_contact_id: string | null;
  hubspot_lifecycle_stage: string | null;
  hubspot_deal_stage: string | null;
  synced_at: string | null;
  first_seen_at: string;
  last_seen_at: string;
}

interface Submission {
  kind: string;
  source: string;
  name: string | null;
  company: string | null;
  job_title: string | null;
  industry: string | null;
  source_page: string | null;
  message: string | null;
  listing: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  created_at: string;
}

interface Owner {
  id: number;
  name: string;
  email: string;
}

interface Stats {
  total: number;
  byStatus: Record<string, number>;
  newCount: number;
  hotCount: number;
  unsyncedCount: number;
}

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  new: { label: 'New', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  contacted: { label: 'Contacted', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  scheduled: { label: 'Scheduled', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  completed: { label: 'Completed', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' },
  not_interested: { label: 'Not Interested', color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/30' },
  spam: { label: 'Spam', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
};

function sourceMeta(source: string | null): { label: string; cls: string } {
  switch (source) {
    case 'capterra':
      return { label: 'Capterra', cls: 'bg-orange-500/10 text-orange-400' };
    case 'linkedin':
      return { label: 'LinkedIn', cls: 'bg-blue-500/10 text-blue-400' };
    case 'google':
      return { label: 'Google Ads', cls: 'bg-green-500/10 text-green-400' };
    case 'demo-request':
      return { label: 'Demo Request', cls: 'bg-purple-500/10 text-purple-400' };
    default:
      return { label: source || 'Unknown', cls: 'bg-gray-500/10 text-gray-400' };
  }
}

const bandMeta: Record<string, { label: string; cls: string }> = {
  hot: { label: 'Hot', cls: 'bg-red-500/10 text-red-400 border border-red-500/30' },
  warm: { label: 'Warm', cls: 'bg-amber-500/10 text-amber-400 border border-amber-500/30' },
  cold: { label: 'Cold', cls: 'bg-slate-500/10 text-slate-400 border border-slate-500/30' },
};

const HUBSPOT_PORTAL_ID = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID;

function hubspotUrl(contactId: string): string | null {
  if (!HUBSPOT_PORTAL_ID) return null;
  return `https://app.hubspot.com/contacts/${HUBSPOT_PORTAL_ID}/record/0-1/${contactId}`;
}

export default function LeadsInbox() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [submissions, setSubmissions] = useState<Record<number, Submission[]>>({});
  const [editingNotes, setEditingNotes] = useState<Record<number, string>>({});
  const [updating, setUpdating] = useState<number | null>(null);
  const [scoring, setScoring] = useState(false);
  const [scoreMsg, setScoreMsg] = useState<string | null>(null);

  // Debounce the search box.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const qs = new URLSearchParams();
      if (statusFilter !== 'all') qs.set('status', statusFilter);
      if (sourceFilter !== 'all') qs.set('source', sourceFilter);
      if (debouncedSearch) qs.set('search', debouncedSearch);
      const res = await fetch(`/api/leads?${qs.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setLeads(data.leads || []);
        setStats(data.stats || null);
        setOwners(data.owners || []);
      }
    } catch (e) {
      console.error('Failed to fetch leads:', e);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, sourceFilter, debouncedSearch]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const scoreLeads = async () => {
    setScoring(true);
    setScoreMsg(null);
    try {
      const res = await fetch('/api/leads/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (res.ok) {
        setScoreMsg(
          data.enqueued > 0
            ? `Scoring ${data.enqueued} lead${data.enqueued === 1 ? '' : 's'}… refresh in a moment.`
            : 'All leads are already scored.'
        );
        if (data.enqueued > 0) setTimeout(() => fetchLeads(), 6000);
      } else {
        setScoreMsg(data.error || 'Failed to start scoring.');
      }
    } catch {
      setScoreMsg('Failed to start scoring.');
    } finally {
      setScoring(false);
    }
  };

  const toggleExpand = async (lead: Lead) => {
    if (expandedId === lead.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(lead.id);
    if (!submissions[lead.id]) {
      try {
        const res = await fetch(`/api/leads/${lead.id}`);
        const data = await res.json();
        if (res.ok) {
          setSubmissions((prev) => ({ ...prev, [lead.id]: data.submissions || [] }));
        }
      } catch (e) {
        console.error('Failed to fetch lead detail:', e);
      }
    }
  };

  const updateLead = async (
    id: number,
    updates: { status?: string; notes?: string; ownerId?: number | null }
  ) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        await fetchLeads();
        if (updates.notes !== undefined) {
          setEditingNotes((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
          });
        }
      }
    } catch (e) {
      console.error('Failed to update lead:', e);
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Users className="w-7 h-7 text-accent" />
            Leads
          </h1>
          <p className="text-sm text-muted mt-1">
            Unified inbox across all sources • {stats?.newCount ?? 0} new
          </p>
          {scoreMsg && <p className="text-xs text-accent mt-1">{scoreMsg}</p>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={scoreLeads}
            disabled={scoring}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${scoring ? 'animate-pulse' : ''}`} />
            Score leads
          </button>
          <button
            onClick={fetchLeads}
            className="p-2 text-muted hover:text-foreground transition-colors cursor-pointer"
            aria-label="Refresh"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-border rounded-lg p-4">
          <p className="text-sm text-muted">Total Leads</p>
          <p className="text-2xl font-bold">{stats?.total ?? 0}</p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-sm text-blue-400">New</p>
          <p className="text-2xl font-bold text-blue-400">{stats?.newCount ?? 0}</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-sm text-red-400 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5" /> Hot
          </p>
          <p className="text-2xl font-bold text-red-400">{stats?.hotCount ?? 0}</p>
        </div>
        <div className="bg-surface border border-border rounded-lg p-4">
          <p className="text-sm text-muted">Not in HubSpot</p>
          <p className="text-2xl font-bold">{stats?.unsyncedCount ?? 0}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, or company..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg focus:outline-none focus:border-accent"
          />
        </div>
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="px-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg focus:outline-none focus:border-accent cursor-pointer"
        >
          <option value="all">All Sources</option>
          <option value="capterra">Capterra</option>
          <option value="linkedin">LinkedIn</option>
          <option value="google">Google Ads</option>
          <option value="demo-request">Demo Request</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg focus:outline-none focus:border-accent cursor-pointer"
        >
          <option value="all">All Statuses</option>
          {Object.entries(statusConfig).map(([key, cfg]) => (
            <option key={key} value={key}>
              {cfg.label}
            </option>
          ))}
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-accent" />
        </div>
      )}

      {/* Empty */}
      {!loading && leads.length === 0 && (
        <div className="text-center py-16 bg-surface border border-border rounded-xl">
          <Users className="w-12 h-12 text-muted mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">No leads found</h2>
          <p className="text-muted">Leads from PPC landing pages and demo requests will appear here.</p>
        </div>
      )}

      {/* List */}
      {!loading && leads.length > 0 && (
        <div className="space-y-3">
          {leads.map((lead) => {
            const status = statusConfig[lead.status] || statusConfig.new;
            const isExpanded = expandedId === lead.id;
            const isUpdating = updating === lead.id;
            const band = lead.score_band ? bandMeta[lead.score_band] : null;
            const hsLink = lead.hubspot_contact_id ? hubspotUrl(lead.hubspot_contact_id) : null;

            return (
              <div key={lead.id} className={`bg-surface border rounded-xl overflow-hidden ${status.border}`}>
                <button
                  onClick={() => toggleExpand(lead)}
                  className="w-full p-4 flex items-start justify-between text-left hover:bg-surface-elevated/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className={`p-2 rounded-lg ${status.bg}`}>
                      <Building2 className={`w-4 h-4 ${status.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-foreground">{lead.name || lead.email}</span>
                        {lead.company && (
                          <>
                            <span className="text-muted">•</span>
                            <span className="text-foreground">{lead.company}</span>
                          </>
                        )}
                        {band && (
                          <span className={`text-xs font-medium px-2 py-0.5 rounded ${band.cls}`}>
                            {band.label}
                            {lead.score != null ? ` · ${lead.score}` : ''}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted flex-wrap">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {lead.email}
                        </span>
                        {lead.job_title && (
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3" />
                            {lead.job_title}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted flex-wrap">
                        <Clock className="w-3 h-3" />
                        {formatDate(lead.last_seen_at)}
                        <span>•</span>
                        <span className={`px-2 py-0.5 rounded ${sourceMeta(lead.last_source).cls}`}>
                          {sourceMeta(lead.last_source).label}
                        </span>
                        {lead.submission_count > 1 && (
                          <span className="flex items-center gap-1">
                            <Layers className="w-3 h-3" />
                            {lead.submission_count} submissions
                          </span>
                        )}
                        {lead.hubspot_contact_id && (
                          <span className="flex items-center gap-1 text-orange-400">
                            <Link2 className="w-3 h-3" /> HubSpot
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded ${status.bg} ${status.color}`}>
                      {status.label}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-border">
                    {/* Submissions history */}
                    <div className="p-4 bg-surface-elevated/30 space-y-3">
                      <p className="text-xs text-muted uppercase">Submissions</p>
                      {(submissions[lead.id] || []).map((s, i) => (
                        <div key={i} className="text-sm border-l-2 border-border pl-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs px-2 py-0.5 rounded ${sourceMeta(s.source).cls}`}>
                              {sourceMeta(s.source).label}
                            </span>
                            {s.industry && <span className="text-muted text-xs">{s.industry}</span>}
                            <span className="text-muted text-xs">{formatDate(s.created_at)}</span>
                          </div>
                          {s.message && <p className="text-foreground mt-1 whitespace-pre-wrap">{s.message}</p>}
                          {(s.utm_campaign || s.source_page) && (
                            <p className="text-xs text-muted mt-1">
                              {s.utm_campaign ? `Campaign: ${s.utm_campaign}` : ''}
                              {s.utm_campaign && s.source_page ? ' • ' : ''}
                              {s.source_page || ''}
                            </p>
                          )}
                        </div>
                      ))}
                      {!submissions[lead.id] && <p className="text-xs text-muted">Loading…</p>}
                    </div>

                    <div className="p-4 space-y-4">
                      {lead.score_rationale && (
                        <div className="text-sm text-muted">
                          <span className="uppercase text-xs">Why this score</span>
                          <p className="text-foreground mt-1">{lead.score_rationale}</p>
                        </div>
                      )}

                      {/* Status */}
                      <div>
                        <label className="block text-sm font-medium text-muted mb-2">Status</label>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(statusConfig).map(([key, cfg]) => (
                            <button
                              key={key}
                              onClick={() => updateLead(lead.id, { status: key })}
                              disabled={isUpdating || lead.status === key}
                              className={`px-3 py-1.5 text-xs rounded-lg transition-colors cursor-pointer disabled:opacity-50 ${
                                lead.status === key
                                  ? `${cfg.bg} ${cfg.color} ring-1 ring-current`
                                  : 'bg-surface-elevated text-muted hover:text-foreground'
                              }`}
                            >
                              {cfg.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Owner */}
                      <div>
                        <label className="block text-sm font-medium text-muted mb-2">Owner</label>
                        <select
                          value={lead.owner_id ?? ''}
                          onChange={(e) =>
                            updateLead(lead.id, {
                              ownerId: e.target.value === '' ? null : Number(e.target.value),
                            })
                          }
                          disabled={isUpdating}
                          className="px-3 py-2 text-sm bg-surface border border-border rounded-lg focus:outline-none focus:border-accent cursor-pointer"
                        >
                          <option value="">Unassigned</option>
                          {owners.map((o) => (
                            <option key={o.id} value={o.id}>
                              {o.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Notes */}
                      <div>
                        <label className="block text-sm font-medium text-muted mb-2">Notes</label>
                        <textarea
                          value={editingNotes[lead.id] ?? lead.notes ?? ''}
                          onChange={(e) =>
                            setEditingNotes((prev) => ({ ...prev, [lead.id]: e.target.value }))
                          }
                          placeholder="Add notes about this lead..."
                          rows={2}
                          className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:border-accent resize-none"
                        />
                        {editingNotes[lead.id] !== undefined &&
                          editingNotes[lead.id] !== (lead.notes ?? '') && (
                            <button
                              onClick={() => updateLead(lead.id, { notes: editingNotes[lead.id] })}
                              disabled={isUpdating}
                              className="mt-2 px-3 py-1.5 text-sm bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors cursor-pointer disabled:opacity-50"
                            >
                              Save Notes
                            </button>
                          )}
                      </div>

                      {/* Quick actions */}
                      <div className="flex items-center gap-2 pt-2 border-t border-border flex-wrap">
                        <a
                          href={`mailto:${lead.email}`}
                          className="flex items-center gap-2 px-3 py-2 text-sm bg-surface-elevated text-foreground rounded-lg hover:bg-surface transition-colors cursor-pointer"
                        >
                          <Mail className="w-4 h-4" /> Email
                        </a>
                        {lead.phone && (
                          <a
                            href={`tel:${lead.phone}`}
                            className="flex items-center gap-2 px-3 py-2 text-sm bg-surface-elevated text-foreground rounded-lg hover:bg-surface transition-colors cursor-pointer"
                          >
                            <Phone className="w-4 h-4" /> Call
                          </a>
                        )}
                        {hsLink ? (
                          <a
                            href={hsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 text-sm bg-orange-500/10 text-orange-400 rounded-lg hover:bg-orange-500/20 transition-colors cursor-pointer"
                          >
                            <ExternalLink className="w-4 h-4" /> View in HubSpot
                          </a>
                        ) : lead.hubspot_contact_id ? (
                          <span className="flex items-center gap-2 px-3 py-2 text-sm text-orange-400">
                            <Link2 className="w-4 h-4" /> Synced to HubSpot
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
