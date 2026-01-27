'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  Mail, 
  Phone, 
  Building2, 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  RefreshCw,
  Filter,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';

interface DemoRequest {
  id: number;
  name: string;
  email: string;
  company: string;
  phone: string | null;
  industry: string | null;
  message: string | null;
  source_page: string | null;
  status: 'new' | 'contacted' | 'scheduled' | 'completed' | 'not_interested' | 'spam';
  notes: string | null;
  assigned_to: number | null;
  assigned_user_name: string | null;
  followed_up_at: string | null;
  created_at: string;
  updated_at: string;
}

const statusConfig = {
  new: { label: 'New', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  contacted: { label: 'Contacted', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  scheduled: { label: 'Scheduled', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  completed: { label: 'Completed', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' },
  not_interested: { label: 'Not Interested', color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/30' },
  spam: { label: 'Spam', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<DemoRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editingNotes, setEditingNotes] = useState<Record<number, string>>({});
  const [updating, setUpdating] = useState<number | null>(null);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const url = filter === 'all' 
        ? '/api/demo-request' 
        : `/api/demo-request?status=${filter}`;
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok) {
        setLeads(data.requests || []);
      }
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const updateLead = async (id: number, updates: { status?: string; notes?: string }) => {
    setUpdating(id);
    try {
      const response = await fetch(`/api/demo-request/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        fetchLeads();
        if (updates.notes !== undefined) {
          setEditingNotes(prev => {
            const next = { ...prev };
            delete next[id];
            return next;
          });
        }
      }
    } catch (error) {
      console.error('Failed to update lead:', error);
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const newCount = leads.filter(l => l.status === 'new').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Users className="w-7 h-7 text-accent" />
            Demo Requests
          </h1>
          <p className="text-sm text-muted mt-1">
            Manage demo requests and leads • {newCount} new
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Filter Dropdown */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg focus:outline-none focus:border-accent cursor-pointer"
          >
            <option value="all">All Leads</option>
            <option value="new">New ({newCount})</option>
            <option value="contacted">Contacted</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="not_interested">Not Interested</option>
            <option value="spam">Spam</option>
          </select>
          
          <button
            onClick={fetchLeads}
            className="p-2 text-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-border rounded-lg p-4">
          <p className="text-sm text-muted">Total Leads</p>
          <p className="text-2xl font-bold">{leads.length}</p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-sm text-blue-400">New</p>
          <p className="text-2xl font-bold text-blue-400">{leads.filter(l => l.status === 'new').length}</p>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
          <p className="text-sm text-purple-400">Scheduled</p>
          <p className="text-2xl font-bold text-purple-400">{leads.filter(l => l.status === 'scheduled').length}</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <p className="text-sm text-green-400">Completed</p>
          <p className="text-2xl font-bold text-green-400">{leads.filter(l => l.status === 'completed').length}</p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-accent" />
        </div>
      )}

      {/* Empty State */}
      {!loading && leads.length === 0 && (
        <div className="text-center py-16 bg-surface border border-border rounded-xl">
          <Users className="w-12 h-12 text-muted mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">No demo requests yet</h2>
          <p className="text-muted">
            Demo requests from the website will appear here.
          </p>
        </div>
      )}

      {/* Leads List */}
      {!loading && leads.length > 0 && (
        <div className="space-y-3">
          {leads.map((lead) => {
            const status = statusConfig[lead.status];
            const isExpanded = expandedId === lead.id;
            const isUpdating = updating === lead.id;

            return (
              <div
                key={lead.id}
                className={`bg-surface border rounded-xl overflow-hidden ${status.border}`}
              >
                {/* Header */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                  className="w-full p-4 flex items-start justify-between text-left hover:bg-surface-elevated/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className={`p-2 rounded-lg ${status.bg}`}>
                      <Building2 className={`w-4 h-4 ${status.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-foreground">{lead.name}</span>
                        <span className="text-muted">•</span>
                        <span className="text-foreground">{lead.company}</span>
                        {lead.industry && (
                          <>
                            <span className="text-muted">•</span>
                            <span className="text-sm text-muted">{lead.industry}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {lead.email}
                        </span>
                        {lead.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {lead.phone}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted">
                        <Clock className="w-3 h-3" />
                        {formatDate(lead.created_at)}
                        {lead.source_page && (
                          <>
                            <span>•</span>
                            <span>from {lead.source_page}</span>
                          </>
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

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-border">
                    {/* Message */}
                    {lead.message && (
                      <div className="p-4 bg-surface-elevated/30">
                        <p className="text-sm text-muted uppercase mb-2">Message</p>
                        <p className="text-foreground whitespace-pre-wrap">{lead.message}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="p-4 space-y-4">
                      {/* Status Update */}
                      <div>
                        <label className="block text-sm font-medium text-muted mb-2">
                          Update Status
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(statusConfig).map(([key, config]) => (
                            <button
                              key={key}
                              onClick={() => updateLead(lead.id, { status: key })}
                              disabled={isUpdating || lead.status === key}
                              className={`px-3 py-1.5 text-xs rounded-lg transition-colors cursor-pointer disabled:opacity-50 ${
                                lead.status === key
                                  ? `${config.bg} ${config.color} ring-1 ring-current`
                                  : 'bg-surface-elevated text-muted hover:text-foreground'
                              }`}
                            >
                              {config.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Notes */}
                      <div>
                        <label className="block text-sm font-medium text-muted mb-2">
                          Notes
                        </label>
                        <textarea
                          value={editingNotes[lead.id] ?? lead.notes ?? ''}
                          onChange={(e) => setEditingNotes(prev => ({
                            ...prev,
                            [lead.id]: e.target.value
                          }))}
                          placeholder="Add notes about this lead..."
                          rows={2}
                          className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:border-accent resize-none"
                        />
                        {(editingNotes[lead.id] !== undefined && editingNotes[lead.id] !== (lead.notes ?? '')) && (
                          <button
                            onClick={() => updateLead(lead.id, { notes: editingNotes[lead.id] })}
                            disabled={isUpdating}
                            className="mt-2 px-3 py-1.5 text-sm bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            Save Notes
                          </button>
                        )}
                      </div>

                      {/* Quick Actions */}
                      <div className="flex items-center gap-2 pt-2 border-t border-border">
                        <a
                          href={`mailto:${lead.email}`}
                          className="flex items-center gap-2 px-3 py-2 text-sm bg-surface-elevated text-foreground rounded-lg hover:bg-surface transition-colors cursor-pointer"
                        >
                          <Mail className="w-4 h-4" />
                          Email
                        </a>
                        {lead.phone && (
                          <a
                            href={`tel:${lead.phone}`}
                            className="flex items-center gap-2 px-3 py-2 text-sm bg-surface-elevated text-foreground rounded-lg hover:bg-surface transition-colors cursor-pointer"
                          >
                            <Phone className="w-4 h-4" />
                            Call
                          </a>
                        )}
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
