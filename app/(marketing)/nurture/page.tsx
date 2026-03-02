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
  Link as LinkIcon,
  Power,
  Plus,
  X,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  Circle,
} from 'lucide-react';
import VoiceTextarea from '@/components/VoiceTextarea';

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

interface StepPreview {
  step_number: number;
  delay_days: number;
  subject_template: string;
  content_tags: string[];
}

interface SendDetail {
  id: number;
  step_id: number;
  subject_sent: string | null;
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

const STEP_THEMES: Record<number, { theme: string; description: string }> = {
  1: { theme: 'Check-in', description: 'Brief personal check-in referencing what they were evaluating' },
  2: { theme: 'Value Story', description: 'Relevant case study based on their vertical' },
  3: { theme: 'Product Update', description: 'What\'s new since they last looked — temperature automation, asset intelligence' },
  4: { theme: 'Industry Insight', description: 'Relevant trend or challenge in their vertical' },
  5: { theme: 'Social Proof', description: 'Customer results and ROI data' },
  6: { theme: 'Open Door', description: 'Soft close with a clear call to action' },
};

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
  const [enrolling, setEnrolling] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [expandedDetail, setExpandedDetail] = useState<EnrollmentDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [updatingSettings, setUpdatingSettings] = useState(false);

  // Two-step enrollment
  const [enrollStep, setEnrollStep] = useState<1 | 2>(1);
  const [previewSteps, setPreviewSteps] = useState<StepPreview[]>([]);
  const [loadingPreview, setLoadingPreview] = useState(false);

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

  const handleNext = async () => {
    if (!form.contactName || !form.contactEmail) {
      setFormError('Contact name and email are required');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.contactEmail)) {
      setFormError('Invalid email format');
      return;
    }
    setFormError('');
    setLoadingPreview(true);
    try {
      const res = await fetch('/api/nurture/preview');
      const data = await res.json();
      setPreviewSteps(data.steps || []);
      setEnrollStep(2);
    } catch {
      setFormError('Failed to load engagement pathway');
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleConfirmEnroll = async () => {
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
        setFormError(data.error || 'Failed to start engagement');
        return;
      }
      setFormSuccess(`${form.contactName} added to engagement track. First email goes out ${
        data.enrollment?.next_send_at ? formatDate(data.enrollment.next_send_at) : 'in 3 days'
      }.`);
      setForm({ contactName: '', contactEmail: '', companyName: '', vertical: '', lossReason: '', accountContext: '' });
      setEnrollStep(1);
      setPreviewSteps([]);
      loadData();
      setTimeout(() => { setFormSuccess(''); setShowForm(false); }, 4000);
    } catch {
      setFormError('Failed to start engagement');
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
          <h1 className="text-2xl font-bold text-foreground">Re-engagement</h1>
          <p className="text-muted text-sm mt-1">Closed-lost account outreach</p>
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
            onClick={() => { setShowForm(!showForm); setEnrollStep(1); setFormError(''); setFormSuccess(''); }}
            className="flex items-center gap-2 px-4 py-2 btn-gradient text-white rounded-lg text-sm font-medium cursor-pointer"
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Close' : 'Add Contact'}
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

      {/* Enrollment Form — Two Steps */}
      {showForm && (
        <div className="bg-surface-elevated border border-border rounded-xl p-6 mb-8">
          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-6">
            <div className={`flex items-center gap-2 text-sm font-medium ${enrollStep === 1 ? 'text-accent' : 'text-muted'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${enrollStep === 1 ? 'bg-accent text-white' : 'bg-surface border border-border'}`}>1</span>
              Contact Info
            </div>
            <ArrowRight className="w-4 h-4 text-muted/40" />
            <div className={`flex items-center gap-2 text-sm font-medium ${enrollStep === 2 ? 'text-accent' : 'text-muted'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${enrollStep === 2 ? 'bg-accent text-white' : 'bg-surface border border-border'}`}>2</span>
              Review Pathway
            </div>
          </div>

          {enrollStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">Contact Name *</label>
                  <input
                    type="text"
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
                </label>
                <VoiceTextarea
                  value={form.accountContext}
                  onChange={(val) => setForm({ ...form, accountContext: val })}
                  placeholder="What were they evaluating? Who were the key stakeholders? What caused the loss?"
                  rows={4}
                  autoExpand
                  minHeight={100}
                  prominentMic
                />
              </div>

              {formError && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {formError}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={loadingPreview}
                  className="flex items-center gap-2 px-6 py-2.5 btn-gradient text-white rounded-lg text-sm font-medium cursor-pointer disabled:opacity-50"
                >
                  {loadingPreview ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Next — Preview Pathway
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {enrollStep === 2 && (
            <div className="space-y-5">
              {/* Contact summary */}
              <div className="bg-surface border border-border rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <span className="text-muted text-xs">Contact</span>
                    <div className="font-medium text-foreground">{form.contactName}</div>
                  </div>
                  <div>
                    <span className="text-muted text-xs">Email</span>
                    <div className="font-medium text-foreground">{form.contactEmail}</div>
                  </div>
                  <div>
                    <span className="text-muted text-xs">Company</span>
                    <div className="font-medium text-foreground">{form.companyName || '—'}</div>
                  </div>
                  <div>
                    <span className="text-muted text-xs">Vertical</span>
                    <div className="font-medium text-foreground capitalize">{form.vertical?.replace('-', ' ') || '—'}</div>
                  </div>
                </div>
                {form.accountContext && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <span className="text-muted text-xs">Account Context</span>
                    <p className="text-sm text-foreground/80 mt-1 whitespace-pre-wrap">{form.accountContext}</p>
                  </div>
                )}
              </div>

              {/* Engagement pathway timeline */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Engagement Pathway — 6 emails over 90 days</h3>
                <p className="text-xs text-muted mb-4">Each email is personalized using the account context you provided. Content is selected based on the contact&apos;s vertical.</p>
                <div className="space-y-0">
                  {previewSteps.map((step, i) => {
                    const theme = STEP_THEMES[step.step_number] || { theme: `Step ${step.step_number}`, description: '' };
                    const sendDate = addDays(new Date(), step.delay_days);
                    const isLast = i === previewSteps.length - 1;

                    return (
                      <div key={step.step_number} className="flex gap-3">
                        {/* Timeline line */}
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-accent">{step.step_number}</span>
                          </div>
                          {!isLast && <div className="w-px flex-1 bg-border min-h-[24px]" />}
                        </div>
                        {/* Content */}
                        <div className={`flex-1 ${isLast ? 'pb-0' : 'pb-4'}`}>
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm font-medium text-foreground">{theme.theme}</span>
                            <span className="text-xs text-muted">Day {step.delay_days}</span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Calendar className="w-3 h-3 text-muted" />
                            <span className="text-xs text-muted">{sendDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                          </div>
                          <p className="text-xs text-muted/70 mt-1">{theme.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
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

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setEnrollStep(1)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-muted hover:text-foreground bg-surface border border-border rounded-lg cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleConfirmEnroll}
                  disabled={enrolling}
                  className="flex items-center gap-2 px-6 py-2.5 btn-gradient text-white rounded-lg text-sm font-medium cursor-pointer disabled:opacity-50"
                >
                  {enrolling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Start Engagement
                </button>
              </div>
            </div>
          )}
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
  const totalSteps = 6;

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
          <td colSpan={7} className="bg-surface/30 px-4 py-4 border-b border-border/50">
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

  return (
    <div className="space-y-5">
      {/* Account Context */}
      {enrollment.account_context && (
        <div>
          <h4 className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">Account Context</h4>
          <p className="text-sm text-foreground/80 whitespace-pre-wrap bg-surface border border-border rounded-lg p-3">
            {enrollment.account_context}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
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
      </div>

      {/* Full timeline */}
      <div>
        <h4 className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">Engagement Timeline</h4>
        <div className="space-y-0">
          {(steps || []).map((step, i) => {
            const theme = STEP_THEMES[step.step_number] || { theme: `Step ${step.step_number}`, description: '' };
            const scheduledDate = addDays(enrolledDate, step.delay_days);
            const matchingSend = sends.find((s) => s.step_id === step.id);
            const isLast = i === (steps || []).length - 1;

            const isSent = !!matchingSend;
            const isCurrent = !isSent && enrollment.current_step === step.step_number && enrollment.status === 'active';
            const isFuture = !isSent && !isCurrent;

            const opened = matchingSend?.events.some((e) => e.event_type === 'opened');
            const clicked = matchingSend?.events.filter((e) => e.event_type === 'clicked') || [];
            const bounced = matchingSend?.events.some((e) => e.event_type === 'bounced');

            return (
              <div key={step.step_number} className="flex gap-3">
                {/* Timeline node */}
                <div className="flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    isSent
                      ? bounced
                        ? 'bg-red-500/20 border border-red-500/40'
                        : 'bg-green-500/20 border border-green-500/40'
                      : isCurrent
                      ? 'bg-accent/20 border border-accent/40'
                      : 'bg-surface border border-border'
                  }`}>
                    {isSent ? (
                      bounced
                        ? <AlertTriangle className="w-3 h-3 text-red-400" />
                        : <CheckCircle2 className="w-3 h-3 text-green-400" />
                    ) : isCurrent ? (
                      <Clock className="w-3 h-3 text-accent" />
                    ) : (
                      <Circle className="w-3 h-3 text-muted/30" />
                    )}
                  </div>
                  {!isLast && <div className="w-px flex-1 bg-border min-h-[16px]" />}
                </div>

                {/* Content */}
                <div className={`flex-1 ${isLast ? 'pb-0' : 'pb-3'}`}>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className={`text-sm font-medium ${isFuture ? 'text-muted' : 'text-foreground'}`}>{theme.theme}</span>
                    <span className="text-xs text-muted">Day {step.delay_days}</span>
                    {isCurrent && <span className="text-xs text-accent font-medium">Next up</span>}
                  </div>

                  {isSent && matchingSend ? (
                    <div className="mt-1">
                      <div className="text-xs text-muted">
                        Sent {formatDate(matchingSend.sent_at)}
                        {matchingSend.subject_sent && <span className="ml-1">— {matchingSend.subject_sent}</span>}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
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
                        {bounced && (
                          <span className="flex items-center gap-1 text-xs text-red-400">
                            <AlertTriangle className="w-3 h-3" /> Bounced
                          </span>
                        )}
                      </div>
                      {clicked.length > 0 && (
                        <div className="mt-1 space-y-0.5">
                          {clicked.map((c, ci) => (
                            <div key={ci} className="flex items-center gap-1 text-xs text-muted">
                              <LinkIcon className="w-3 h-3 shrink-0" />
                              <span className="truncate">{c.clicked_url}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3 h-3 text-muted/50" />
                      <span className={`text-xs ${isCurrent ? 'text-accent' : 'text-muted/50'}`}>
                        {isCurrent && enrollment.next_send_at
                          ? formatDate(enrollment.next_send_at)
                          : scheduledDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
                        }
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
