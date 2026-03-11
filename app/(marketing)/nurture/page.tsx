'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Mail,
  Users,
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
  Plus,
  Clock,
  Circle,
} from 'lucide-react';
import EnrollmentModal from './EnrollmentModal';
import type { NurtureTrackOption } from './EnrollmentModal';

// --- Types ---

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
  track_name?: string;
  contact_email: string;
  contact_name: string;
  company_name: string | null;
  vertical: string | null;
  account_context: string | null;
  loss_reason: string | null;
  persona_type: string | null;
  persona_function: string | null;
  email_count: number | null;
  period_days: number | null;
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
  step_id: number;
  subject_sent: string | null;
  body_sent: string | null;
  sent_at: string;
  events: Array<{
    event_type: string;
    clicked_url: string | null;
    event_timestamp: string;
  }>;
}

interface TrackStep {
  id: number;
  step_number: number;
  delay_days: number;
  subject_template: string;
  content_tags: string[];
}

interface EnrollmentDetail {
  enrollment: Enrollment;
  sends: SendDetail[];
  steps: TrackStep[];
}

interface Settings {
  global_pause: string;
  daily_send_cap: string;
  recap_recipients: string;
}

// --- Constants ---

const STEP_THEMES_DEFAULT: Record<number, string> = {
  1: 'Overview / Brochure',
  2: 'Case Study',
  3: 'Product Update',
  4: 'Industry Trends',
  5: 'ROI & Results',
  6: 'Reconnect',
};

function getStepTheme(stepNumber: number, subjectTemplate?: string): string {
  if (subjectTemplate) {
    const clean = subjectTemplate
      .replace(/\{\{[^}]+\}\}/g, '')
      .replace(/[—–-]/g, ' ')
      .trim();
    if (clean.length > 3 && clean.length <= 50) return clean;
    if (clean.length > 50) return clean.slice(0, 47) + '...';
  }
  return STEP_THEMES_DEFAULT[stepNumber] || `Step ${stepNumber}`;
}

const STATUS_COLORS: Record<string, string> = {
  active: 'text-green-400 bg-green-400/10 border-green-400/20',
  paused: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  completed: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  removed: 'text-red-400 bg-red-400/10 border-red-400/20',
  unsubscribed: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  bounced: 'text-red-400 bg-red-400/10 border-red-400/20',
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

// --- Main Component ---

export default function NurturePage() {
  const [stats, setStats] = useState<NurtureStats | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [total, setTotal] = useState(0);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [trackFilter, setTrackFilter] = useState('');
  const [tracks, setTracks] = useState<NurtureTrackOption[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [expandedDetail, setExpandedDetail] = useState<EnrollmentDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [highlightedEnrollmentId, setHighlightedEnrollmentId] = useState<number | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ stats: 'true', limit: '100' });
      if (statusFilter) params.set('status', statusFilter);
      if (searchQuery) params.set('search', searchQuery);
      if (trackFilter) params.set('trackId', trackFilter);

      const [enrollRes, settingsRes, tracksRes] = await Promise.all([
        fetch(`/api/nurture/enrollments?${params}`),
        fetch('/api/nurture/settings'),
        fetch('/api/nurture/tracks'),
      ]);

      const enrollData = await enrollRes.json();
      const settingsData = await settingsRes.json();
      const tracksData = await tracksRes.json();

      setEnrollments(enrollData.enrollments || []);
      setTotal(enrollData.total || 0);
      if (enrollData.stats) setStats(enrollData.stats);
      setSettings(settingsData.settings || null);
      if (tracksData.tracks) setTracks(tracksData.tracks);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery, trackFilter]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleModalSuccess = (newId: number | null) => {
    setShowModal(false);
    loadData();
    if (newId) {
      setHighlightedEnrollmentId(newId);
      setTimeout(() => setHighlightedEnrollmentId(null), 5000);
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nurturing</h1>
          <p className="text-muted text-sm mt-1">Nurture tracks &amp; email engagement</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 btn-gradient text-white rounded-lg text-sm font-medium cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Contact
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard label="Active" value={stats.activeEnrollments} icon={Users} />
          <StatCard label="Total" value={stats.totalEnrollments} icon={Mail} />
          <StatCard label="Sent (7d)" value={stats.emailsSent7d} icon={Send} />
          <StatCard label="Open Rate" value={`${stats.openRate}%`} icon={Eye} />
          <StatCard label="Click Rate" value={`${stats.clickRate}%`} icon={MousePointerClick} />
        </div>
      )}

      {/* Enrollment Modal */}
      {showModal && (
        <EnrollmentModal
          onClose={() => setShowModal(false)}
          onSuccess={handleModalSuccess}
          tracks={tracks}
        />
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
          value={trackFilter}
          onChange={(e) => setTrackFilter(e.target.value)}
          className="px-3 py-2 text-sm bg-surface border border-border rounded-lg focus:outline-none focus:border-accent"
        >
          <option value="">All tracks</option>
          {tracks.map((t) => (
            <option key={t.id} value={String(t.id)}>{t.name}</option>
          ))}
        </select>
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
            <p className="text-sm">No contacts yet. Add a closed-lost contact to get started.</p>
          </div>
        ) : (
          <div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-4 py-3 text-muted font-medium w-8"></th>
                  <th className="px-4 py-3 text-muted font-medium">Contact</th>
                  <th className="px-4 py-3 text-muted font-medium hidden md:table-cell">Company</th>
                  <th className="px-4 py-3 text-muted font-medium hidden lg:table-cell">Track</th>
                  <th className="px-4 py-3 text-muted font-medium">Status</th>
                  <th className="px-4 py-3 text-muted font-medium hidden md:table-cell">Progress</th>
                  <th className="px-4 py-3 text-muted font-medium hidden lg:table-cell">Next Email</th>
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
                    isHighlighted={highlightedEnrollmentId === e.id}
                  />
                ))}
              </tbody>
            </table>
            <div className="px-4 py-3 border-t border-border text-xs text-muted">
              Showing {enrollments.length} of {total}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Sub-components ---


// NOTE: EnrollmentModal (with Step1Form, EmailPreviewPanel, VoiceWaveform) is in EnrollmentModal.tsx

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
  isHighlighted = false,
}: {
  enrollment: Enrollment;
  isExpanded: boolean;
  detail: EnrollmentDetail | null;
  loadingDetail: boolean;
  onToggle: () => void;
  onStatusChange: (id: number, status: string) => void;
  isHighlighted?: boolean;
}) {
  const statusColor = STATUS_COLORS[enrollment.status] || 'text-muted bg-muted/10 border-muted/20';
  const totalSteps = enrollment.email_count || 6;
  const trackLabel = enrollment.track_name || '';
  const shortTrack = trackLabel.replace('Post-Call: ', '').replace('Closed-Lost ', '');

  return (
    <>
      <tr className={`border-b hover:bg-surface/50 transition-all duration-700 ${
        isHighlighted
          ? 'bg-green-500/5 border-green-500/30 shadow-[inset_0_0_0_1px_rgba(34,197,94,0.2)]'
          : 'border-border/50'
      }`}>
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
        <td className="px-4 py-3 hidden lg:table-cell">
          <span className="text-xs text-muted">{shortTrack || '—'}</span>
        </td>
        <td className="px-4 py-3">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusColor}`}>
            {enrollment.status}
          </span>
        </td>
        <td className="px-4 py-3 hidden md:table-cell">
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-1.5 rounded-full ${
                    i < enrollment.current_step
                      ? 'bg-accent'
                      : i === enrollment.current_step && enrollment.status === 'active'
                      ? 'bg-accent/40'
                      : 'bg-border'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted">{Math.max(0, enrollment.current_step - 1)}/{totalSteps}</span>
          </div>
        </td>
        <td className="px-4 py-3 hidden lg:table-cell text-xs text-muted">
          {enrollment.status === 'completed' ? (
            <span className="text-blue-400">Completed</span>
          ) : enrollment.next_send_at ? (
            formatDate(enrollment.next_send_at)
          ) : enrollment.status === 'active' ? (
            <span className="text-muted/50">Scheduling...</span>
          ) : (
            '—'
          )}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-1">
            {enrollment.status === 'active' && (
              <button onClick={() => onStatusChange(enrollment.id, 'paused')} className="p-1 text-muted hover:text-yellow-400 cursor-pointer" title="Pause">
                <Pause className="w-4 h-4" />
              </button>
            )}
            {enrollment.status === 'paused' && (
              <button onClick={() => onStatusChange(enrollment.id, 'active')} className="p-1 text-muted hover:text-green-400 cursor-pointer" title="Resume">
                <Play className="w-4 h-4" />
              </button>
            )}
            {(enrollment.status === 'active' || enrollment.status === 'paused') && (
              <button onClick={() => onStatusChange(enrollment.id, 'removed')} className="p-1 text-muted hover:text-red-400 cursor-pointer" title="Remove">
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
              <ExpandedDetail detail={detail} />
            ) : null}
          </td>
        </tr>
      )}
    </>
  );
}

function ExpandedDetail({ detail }: { detail: EnrollmentDetail }) {
  const { enrollment, sends, steps } = detail;
  const enrolledDate = new Date(enrollment.enrolled_at);
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const [previewCache, setPreviewCache] = useState<Record<number, { subject: string; body: string }>>({});
  const [generatingStep, setGeneratingStep] = useState<number | null>(null);

  const loadEmailPreview = async (stepNumber: number) => {
    setSelectedStep(stepNumber);
    const matchingSend = sends.find((s) => {
      const step = steps.find((st) => st.id === s.step_id);
      return step?.step_number === stepNumber;
    });
    if (matchingSend?.subject_sent) return;
    if (previewCache[stepNumber]) return;

    setGeneratingStep(stepNumber);
    try {
      const res = await fetch('/api/nurture/generate-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentId: enrollment.id, stepNumber }),
      });
      const data = await res.json();
      if (res.ok) {
        setPreviewCache((prev) => ({ ...prev, [stepNumber]: { subject: data.subject, body: data.body } }));
      }
    } catch {
      // silently fail — user can retry by clicking again
    } finally {
      setGeneratingStep(null);
    }
  };

  const selectedStepData = steps.find((s) => s.step_number === selectedStep);
  const selectedSend = selectedStepData ? sends.find((s) => s.step_id === selectedStepData.id) : null;
  const selectedPreview = selectedStep ? previewCache[selectedStep] : null;

  return (
    <div className="space-y-4">
      {/* Meta row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
        <div>
          <span className="text-muted">Loss Reason:</span>
          <span className="ml-1 text-foreground capitalize">{enrollment.loss_reason?.replace('_', ' ') || '—'}</span>
        </div>
        <div>
          <span className="text-muted">Enrolled:</span>
          <span className="ml-1 text-foreground">{formatDate(enrollment.enrolled_at)}</span>
        </div>
        <div>
          <span className="text-muted">Enrolled By:</span>
          <span className="ml-1 text-foreground">{enrollment.enrolled_by_email || '—'}</span>
        </div>
        <div>
          <span className="text-muted">Vertical:</span>
          <span className="ml-1 text-foreground capitalize">{enrollment.vertical?.replace('-', ' ') || '—'}</span>
        </div>
        {enrollment.persona_type && (
          <div>
            <span className="text-muted">Persona:</span>
            <span className="ml-1 text-foreground capitalize">{enrollment.persona_type}</span>
          </div>
        )}
        {enrollment.persona_function && (
          <div>
            <span className="text-muted">Function:</span>
            <span className="ml-1 text-foreground capitalize">{enrollment.persona_function?.replace('_', ' ')}</span>
          </div>
        )}
        {enrollment.email_count && (
          <div>
            <span className="text-muted">Cadence:</span>
            <span className="ml-1 text-foreground">{enrollment.email_count} emails / {enrollment.period_days} days</span>
          </div>
        )}
        {enrollment.account_context && (
          <div className="col-span-2 md:col-span-5">
            <span className="text-muted">Context:</span>
            <span className="ml-1 text-foreground">{enrollment.account_context.length > 120 ? enrollment.account_context.slice(0, 120) + '...' : enrollment.account_context}</span>
          </div>
        )}
      </div>

      {/* Split: timeline left, preview right */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Left: email timeline */}
        <div className="md:col-span-2 space-y-0">
          <h4 className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">Emails</h4>
          {(steps || []).map((step, i) => {
            const stepTheme = getStepTheme(step.step_number, step.subject_template);
            const stepScheduledDate = addDays(enrolledDate, step.delay_days);
            const matchingSend = sends.find((s) => s.step_id === step.id);
            const isLast = i === (steps || []).length - 1;

            const isSent = !!matchingSend;
            const isCurrent = !isSent && enrollment.current_step === step.step_number && enrollment.status === 'active';
            const isFuture = !isSent && !isCurrent;

            const opened = matchingSend?.events.some((e) => e.event_type === 'opened');
            const clicked = matchingSend?.events.filter((e) => e.event_type === 'clicked') || [];
            const bounced = matchingSend?.events.some((e) => e.event_type === 'bounced');
            const isSelected = selectedStep === step.step_number;

            return (
              <div key={step.step_number} className="flex gap-2.5">
                <div className="flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-accent text-white'
                      : isSent
                      ? bounced
                        ? 'bg-red-500/20 border border-red-500/40'
                        : 'bg-green-500/20 border border-green-500/40'
                      : isCurrent
                      ? 'bg-accent/20 border border-accent/40'
                      : 'bg-surface border border-border'
                  }`}>
                    {isSelected ? (
                      <span className="text-[10px] font-bold text-white">{step.step_number}</span>
                    ) : isSent ? (
                      bounced
                        ? <AlertTriangle className="w-2.5 h-2.5 text-red-400" />
                        : <CheckCircle2 className="w-2.5 h-2.5 text-green-400" />
                    ) : isCurrent ? (
                      <Clock className="w-2.5 h-2.5 text-accent" />
                    ) : (
                      <Circle className="w-2.5 h-2.5 text-muted/30" />
                    )}
                  </div>
                  {!isLast && <div className="w-px flex-1 bg-border min-h-[12px]" />}
                </div>

                <div className={`flex-1 ${isLast ? 'pb-0' : 'pb-2'}`}>
                  <button
                    type="button"
                    onClick={() => loadEmailPreview(step.step_number)}
                    className={`w-full text-left px-2.5 py-1.5 -ml-0.5 rounded-lg transition-all cursor-pointer ${
                      isSelected ? 'bg-accent/10 border border-accent/20' : 'hover:bg-surface-elevated'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium ${isSelected ? 'text-accent' : isFuture ? 'text-muted' : 'text-foreground'}`}>{stepTheme}</span>
                      {isCurrent && <span className="text-[10px] text-accent font-medium">Next</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-muted">
                        {isSent && matchingSend
                          ? `Sent ${formatDate(matchingSend.sent_at)}`
                          : isCurrent && enrollment.next_send_at
                          ? formatDate(enrollment.next_send_at)
                          : stepScheduledDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        }
                      </span>
                      {isSent && (
                        <div className="flex items-center gap-1.5">
                          {opened && <Eye className="w-2.5 h-2.5 text-green-400" />}
                          {clicked.length > 0 && <MousePointerClick className="w-2.5 h-2.5 text-blue-400" />}
                          {bounced && <AlertTriangle className="w-2.5 h-2.5 text-red-400" />}
                        </div>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: email preview */}
        <div className="md:col-span-3">
          {selectedStep && selectedStepData ? (
            <div className="bg-surface-elevated border border-border rounded-lg overflow-hidden">
              {/* If sent, show actual sent content */}
              {selectedSend?.subject_sent ? (
                <>
                  <div className="px-4 py-2.5 border-b border-border bg-surface">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-green-400 font-medium">Sent</span>
                      <span className="text-xs text-muted">{formatDate(selectedSend.sent_at)}</span>
                    </div>
                  </div>
                  <div className="px-4 py-2.5 border-b border-border/50">
                    <div className="text-xs text-muted mb-0.5">Subject</div>
                    <div className="text-sm font-medium text-foreground">{selectedSend.subject_sent}</div>
                  </div>
                  <div className="px-4 py-4 max-h-[350px] overflow-y-auto">
                    <div className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">
                      {selectedSend.body_sent || 'Email body not stored.'}
                    </div>
                  </div>
                </>
              ) : generatingStep === selectedStep ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-5 h-5 animate-spin text-accent mb-3" />
                  <p className="text-sm text-muted">Generating personalized preview...</p>
                </div>
              ) : selectedPreview ? (
                <>
                  <div className="px-4 py-2.5 border-b border-border bg-surface">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-accent font-medium">Preview</span>
                      <span className="text-xs text-muted">This is what will be sent</span>
                    </div>
                  </div>
                  <div className="px-4 py-2.5 border-b border-border/50">
                    <div className="text-xs text-muted mb-0.5">Subject</div>
                    <div className="text-sm font-medium text-foreground">{selectedPreview.subject}</div>
                  </div>
                  <div className="px-4 py-4 max-h-[350px] overflow-y-auto">
                    <div className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">{selectedPreview.body}</div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-5 h-5 animate-spin text-accent mb-3" />
                  <p className="text-sm text-muted">Generating personalized preview...</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-surface border border-border rounded-lg p-8 text-center flex items-center justify-center h-full min-h-[200px]">
              <div>
                <Mail className="w-6 h-6 text-muted/30 mx-auto mb-2" />
                <p className="text-xs text-muted">Click an email to see the actual content</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
