'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Mail,
  Users,
  TrendingUp,
  MousePointerClick,
  Send,
  Pause,
  Play,
  Trash2,
  ChevronDown,
  ChevronRight,
  Search,
  RefreshCw,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Link as LinkIcon,
  Power,
  Plus,
  X,
} from 'lucide-react';
import VoiceTextarea from '@/components/VoiceTextarea';

interface NurtureStats {
  activeEnrollments: number;
  totalEnrollments: number;
  emailsSent7d: number;
  openRate: number;
  clickRate: number;
}

interface Enrollment {
  id: number;
  track_id: number;
  contact_email: string;
  contact_name: string;
  company_name: string | null;
  vertical: string | null;
  account_context: string | null;
  loss_reason: string | null;
  enrolled_by_email: string | null;
  status: string;
  current_step: number;
  enrolled_at: string;
  next_send_at: string | null;
  paused_at: string | null;
  completed_at: string | null;
}

interface SendDetail {
  id: number;
  subject_sent: string | null;
  sent_at: string;
  events: Array<{
    event_type: string;
    clicked_url: string | null;
    event_timestamp: string;
  }>;
}

interface EnrollmentDetail {
  enrollment: Enrollment;
  sends: SendDetail[];
}

interface Settings {
  global_pause: string;
  daily_send_cap: string;
  recap_recipients: string;
}

const VERTICALS = [
  { value: '', label: 'Select vertical...' },
  { value: 'senior-living', label: 'Senior Living' },
  { value: 'food-retail', label: 'Food Retail' },
  { value: 'food-facilities', label: 'Food Facilities' },
  { value: 'medical', label: 'Medical / Pharma' },
  { value: 'nhs-pharmacies', label: 'NHS Pharmacies' },
  { value: 'operations', label: 'General Operations' },
];

const LOSS_REASONS = [
  { value: '', label: 'Select reason...' },
  { value: 'budget', label: 'Budget' },
  { value: 'timing', label: 'Timing' },
  { value: 'competitor', label: 'Went with competitor' },
  { value: 'no_decision', label: 'No decision made' },
  { value: 'champion_left', label: 'Champion left' },
  { value: 'other', label: 'Other' },
];

const STATUS_COLORS: Record<string, string> = {
  active: 'text-green-400 bg-green-400/10 border-green-400/20',
  paused: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  completed: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  removed: 'text-red-400 bg-red-400/10 border-red-400/20',
  unsubscribed: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  bounced: 'text-red-400 bg-red-400/10 border-red-400/20',
};

export default function NurturePage() {
  const [stats, setStats] = useState<NurtureStats | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [total, setTotal] = useState(0);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [expandedDetail, setExpandedDetail] = useState<EnrollmentDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [updatingSettings, setUpdatingSettings] = useState(false);

  // Enrollment form
  const [form, setForm] = useState({
    contactName: '',
    contactEmail: '',
    companyName: '',
    vertical: '',
    lossReason: '',
    accountContext: '',
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ stats: 'true', limit: '100' });
      if (statusFilter) params.set('status', statusFilter);
      if (searchQuery) params.set('search', searchQuery);

      const [enrollRes, settingsRes] = await Promise.all([
        fetch(`/api/nurture/enrollments?${params}`),
        fetch('/api/nurture/settings'),
      ]);

      const enrollData = await enrollRes.json();
      const settingsData = await settingsRes.json();

      setEnrollments(enrollData.enrollments || []);
      setTotal(enrollData.total || 0);
      if (enrollData.stats) setStats(enrollData.stats);
      setSettings(settingsData.settings || null);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setEnrolling(true);

    try {
      const res = await fetch('/api/nurture/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || 'Failed to enroll');
        return;
      }
      setFormSuccess(`${form.contactName} enrolled successfully. First email scheduled.`);
      setForm({ contactName: '', contactEmail: '', companyName: '', vertical: '', lossReason: '', accountContext: '' });
      loadData();
      setTimeout(() => setFormSuccess(''), 5000);
    } catch {
      setFormError('Failed to enroll contact');
    } finally {
      setEnrolling(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await fetch(`/api/nurture/enrollments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      loadData();
      if (expandedId === id) setExpandedId(null);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleTogglePause = async () => {
    if (!settings) return;
    setUpdatingSettings(true);
    try {
      const newValue = settings.global_pause === 'true' ? 'false' : 'true';
      const res = await fetch('/api/nurture/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'global_pause', value: newValue }),
      });
      const data = await res.json();
      setSettings(data.settings);
    } catch (error) {
      console.error('Failed to update setting:', error);
    } finally {
      setUpdatingSettings(false);
    }
  };

  const handleSendCapChange = async (value: string) => {
    try {
      const res = await fetch('/api/nurture/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'daily_send_cap', value }),
      });
      const data = await res.json();
      setSettings(data.settings);
    } catch (error) {
      console.error('Failed to update setting:', error);
    }
  };

  const loadDetail = async (id: number) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    setLoadingDetail(true);
    try {
      const res = await fetch(`/api/nurture/enrollments/${id}`);
      const data = await res.json();
      setExpandedDetail(data);
    } catch (error) {
      console.error('Failed to load detail:', error);
    } finally {
      setLoadingDetail(false);
    }
  };

  const isPaused = settings?.global_pause === 'true';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nurture Engine</h1>
          <p className="text-muted text-sm mt-1">Closed-lost account re-engagement</p>
        </div>
        <div className="flex items-center gap-3">
          {isPaused && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-400 text-sm">
              <AlertTriangle className="w-4 h-4" />
              All sends paused
            </div>
          )}
          <button
            onClick={handleTogglePause}
            disabled={updatingSettings}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              isPaused
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30'
            }`}
          >
            {updatingSettings ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isPaused ? (
              <Play className="w-4 h-4" />
            ) : (
              <Power className="w-4 h-4" />
            )}
            {isPaused ? 'Resume Sends' : 'Kill Switch'}
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 btn-gradient text-white rounded-lg text-sm font-medium cursor-pointer"
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Close' : 'Enroll Contact'}
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard label="Active" value={stats.activeEnrollments} icon={Users} />
          <StatCard label="Total Enrolled" value={stats.totalEnrollments} icon={Mail} />
          <StatCard label="Sent (7d)" value={stats.emailsSent7d} icon={Send} />
          <StatCard label="Open Rate" value={`${stats.openRate}%`} icon={Eye} />
          <StatCard label="Click Rate" value={`${stats.clickRate}%`} icon={MousePointerClick} />
        </div>
      )}

      {/* Enrollment Form */}
      {showForm && (
        <div className="bg-surface-elevated border border-border rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Enroll Closed-Lost Contact</h2>
          <form onSubmit={handleEnroll} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Contact Name *</label>
                <input
                  type="text"
                  required
                  value={form.contactName}
                  onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                  placeholder="Jane Smith"
                  className="w-full px-3 py-2 text-sm bg-surface border border-border rounded-lg focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={form.contactEmail}
                  onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                  placeholder="jane@company.com"
                  className="w-full px-3 py-2 text-sm bg-surface border border-border rounded-lg focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Company</label>
                <input
                  type="text"
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  placeholder="Acme Corp"
                  className="w-full px-3 py-2 text-sm bg-surface border border-border rounded-lg focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Vertical</label>
                <select
                  value={form.vertical}
                  onChange={(e) => setForm({ ...form, vertical: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-surface border border-border rounded-lg focus:outline-none focus:border-accent"
                >
                  {VERTICALS.map((v) => (
                    <option key={v.value} value={v.value}>{v.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Loss Reason</label>
                <select
                  value={form.lossReason}
                  onChange={(e) => setForm({ ...form, lossReason: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-surface border border-border rounded-lg focus:outline-none focus:border-accent"
                >
                  {LOSS_REASONS.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted mb-1">
                Account Context
                <span className="text-muted/50 font-normal ml-1">(voice or type — what do you know about this account?)</span>
              </label>
              <VoiceTextarea
                value={form.accountContext}
                onChange={(val) => setForm({ ...form, accountContext: val })}
                placeholder="Share what you know about this account — what were they evaluating, who were the key stakeholders, what caused the loss, and anything else that would help personalize outreach..."
                rows={4}
                autoExpand
                minHeight={100}
              />
            </div>

            {formError && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="flex items-center gap-2 text-green-400 text-sm bg-green-400/10 border border-green-400/20 rounded-lg px-3 py-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {formSuccess}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={enrolling}
                className="flex items-center gap-2 px-6 py-2.5 btn-gradient text-white rounded-lg text-sm font-medium cursor-pointer disabled:opacity-50"
              >
                {enrolling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Enroll in Nurture Track
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Controls Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contacts..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-surface border border-border rounded-lg focus:outline-none focus:border-accent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm bg-surface border border-border rounded-lg focus:outline-none focus:border-accent"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="completed">Completed</option>
          <option value="removed">Removed</option>
          <option value="unsubscribed">Unsubscribed</option>
          <option value="bounced">Bounced</option>
        </select>
        <button onClick={loadData} className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted hover:text-foreground bg-surface border border-border rounded-lg cursor-pointer">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
        {settings && (
          <div className="flex items-center gap-2 ml-auto text-sm text-muted">
            <span>Daily cap:</span>
            <select
              value={settings.daily_send_cap}
              onChange={(e) => handleSendCapChange(e.target.value)}
              className="px-2 py-1 text-xs bg-surface border border-border rounded focus:outline-none focus:border-accent"
            >
              {[10, 25, 50, 75, 100].map((n) => (
                <option key={n} value={String(n)}>{n}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Enrollments Table */}
      <div className="bg-surface-elevated border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-accent" />
          </div>
        ) : enrollments.length === 0 ? (
          <div className="text-center py-16 text-muted">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No enrollments yet. Enroll a closed-lost contact to get started.</p>
          </div>
        ) : (
          <div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-4 py-3 text-muted font-medium w-8"></th>
                  <th className="px-4 py-3 text-muted font-medium">Contact</th>
                  <th className="px-4 py-3 text-muted font-medium hidden md:table-cell">Company</th>
                  <th className="px-4 py-3 text-muted font-medium hidden lg:table-cell">Vertical</th>
                  <th className="px-4 py-3 text-muted font-medium">Status</th>
                  <th className="px-4 py-3 text-muted font-medium hidden md:table-cell">Step</th>
                  <th className="px-4 py-3 text-muted font-medium hidden lg:table-cell">Next Send</th>
                  <th className="px-4 py-3 text-muted font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((e) => (
                  <EnrollmentRow
                    key={e.id}
                    enrollment={e}
                    isExpanded={expandedId === e.id}
                    detail={expandedId === e.id ? expandedDetail : null}
                    loadingDetail={expandedId === e.id && loadingDetail}
                    onToggle={() => loadDetail(e.id)}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </tbody>
            </table>
            <div className="px-4 py-3 border-t border-border text-xs text-muted">
              Showing {enrollments.length} of {total} enrollments
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: string | number; icon: React.ElementType }) {
  return (
    <div className="bg-surface-elevated border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4 text-accent" />
        <span className="text-xs text-muted">{label}</span>
      </div>
      <div className="text-xl font-bold text-foreground">{value}</div>
    </div>
  );
}

function EnrollmentRow({
  enrollment,
  isExpanded,
  detail,
  loadingDetail,
  onToggle,
  onStatusChange,
}: {
  enrollment: Enrollment;
  isExpanded: boolean;
  detail: EnrollmentDetail | null;
  loadingDetail: boolean;
  onToggle: () => void;
  onStatusChange: (id: number, status: string) => void;
}) {
  const statusColor = STATUS_COLORS[enrollment.status] || 'text-muted bg-muted/10 border-muted/20';

  return (
    <>
      <tr className="border-b border-border/50 hover:bg-surface/50 transition-colors">
        <td className="px-4 py-3">
          <button onClick={onToggle} className="text-muted hover:text-foreground cursor-pointer">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </td>
        <td className="px-4 py-3">
          <div className="font-medium text-foreground">{enrollment.contact_name}</div>
          <div className="text-xs text-muted">{enrollment.contact_email}</div>
        </td>
        <td className="px-4 py-3 hidden md:table-cell text-muted">{enrollment.company_name || '—'}</td>
        <td className="px-4 py-3 hidden lg:table-cell text-muted capitalize">{enrollment.vertical?.replace('-', ' ') || '—'}</td>
        <td className="px-4 py-3">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusColor}`}>
            {enrollment.status}
          </span>
        </td>
        <td className="px-4 py-3 hidden md:table-cell text-muted">{enrollment.current_step}/6</td>
        <td className="px-4 py-3 hidden lg:table-cell text-muted text-xs">
          {enrollment.next_send_at
            ? new Date(enrollment.next_send_at).toLocaleDateString()
            : '—'}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-1">
            {enrollment.status === 'active' && (
              <button
                onClick={() => onStatusChange(enrollment.id, 'paused')}
                className="p-1 text-muted hover:text-yellow-400 cursor-pointer"
                title="Pause"
              >
                <Pause className="w-4 h-4" />
              </button>
            )}
            {enrollment.status === 'paused' && (
              <button
                onClick={() => onStatusChange(enrollment.id, 'active')}
                className="p-1 text-muted hover:text-green-400 cursor-pointer"
                title="Resume"
              >
                <Play className="w-4 h-4" />
              </button>
            )}
            {(enrollment.status === 'active' || enrollment.status === 'paused') && (
              <button
                onClick={() => onStatusChange(enrollment.id, 'removed')}
                className="p-1 text-muted hover:text-red-400 cursor-pointer"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={8} className="bg-surface/30 px-4 py-4 border-b border-border/50">
            {loadingDetail ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-accent" />
              </div>
            ) : detail ? (
              <div className="space-y-4">
                {/* Account Context */}
                {detail.enrollment.account_context && (
                  <div>
                    <h4 className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">Account Context</h4>
                    <p className="text-sm text-foreground/80 whitespace-pre-wrap bg-surface border border-border rounded-lg p-3">
                      {detail.enrollment.account_context}
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-muted">Loss Reason:</span>
                    <span className="ml-1 text-foreground capitalize">{detail.enrollment.loss_reason?.replace('_', ' ') || '—'}</span>
                  </div>
                  <div>
                    <span className="text-muted">Enrolled:</span>
                    <span className="ml-1 text-foreground">{new Date(detail.enrollment.enrolled_at).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-muted">Enrolled By:</span>
                    <span className="ml-1 text-foreground">{detail.enrollment.enrolled_by_email || '—'}</span>
                  </div>
                  <div>
                    <span className="text-muted">Vertical:</span>
                    <span className="ml-1 text-foreground capitalize">{detail.enrollment.vertical?.replace('-', ' ') || '—'}</span>
                  </div>
                </div>

                {/* Sends */}
                {detail.sends.length > 0 ? (
                  <div>
                    <h4 className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">Email Activity</h4>
                    <div className="space-y-2">
                      {detail.sends.map((send) => {
                        const opened = send.events.some((e) => e.event_type === 'opened');
                        const clicked = send.events.filter((e) => e.event_type === 'clicked');
                        const bounced = send.events.some((e) => e.event_type === 'bounced');

                        return (
                          <div key={send.id} className="bg-surface border border-border rounded-lg p-3 text-sm">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <div className="font-medium text-foreground">{send.subject_sent || 'No subject'}</div>
                                <div className="text-xs text-muted mt-0.5">
                                  Sent {new Date(send.sent_at).toLocaleString()}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                {bounced && (
                                  <span className="flex items-center gap-1 text-xs text-red-400">
                                    <AlertTriangle className="w-3 h-3" /> Bounced
                                  </span>
                                )}
                                {opened && (
                                  <span className="flex items-center gap-1 text-xs text-green-400">
                                    <Eye className="w-3 h-3" /> Opened
                                  </span>
                                )}
                                {clicked.length > 0 && (
                                  <span className="flex items-center gap-1 text-xs text-blue-400">
                                    <MousePointerClick className="w-3 h-3" /> {clicked.length} click{clicked.length > 1 ? 's' : ''}
                                  </span>
                                )}
                              </div>
                            </div>
                            {clicked.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {clicked.map((c, i) => (
                                  <div key={i} className="flex items-center gap-1 text-xs text-muted">
                                    <LinkIcon className="w-3 h-3 shrink-0" />
                                    <span className="truncate">{c.clicked_url}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted">No emails sent yet. First email is scheduled.</p>
                )}
              </div>
            ) : null}
          </td>
        </tr>
      )}
    </>
  );
}
