'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
  Mic,
  Square,
  Pencil,
  Type,
} from 'lucide-react';
import { useVoiceRecording, formatRecordingTime } from '@/lib/useVoiceRecording';

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
  body_template: string;
  content_tags: string[];
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
  1: { theme: 'Industry Overview', description: 'How teams in their vertical are modernizing operations' },
  2: { theme: 'Case Study', description: 'Real customer results — compliance time, audit scores, ROI' },
  3: { theme: 'Product Update', description: 'New platform features — asset intelligence, sensors, workflows' },
  4: { theme: 'Industry Trends', description: 'Key trends shaping operations and compliance in their space' },
  5: { theme: 'ROI & Results', description: 'Hard numbers and a free ROI calculator' },
  6: { theme: 'Reconnect', description: 'Quick question + easy way to book time or keep reading' },
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
  const [expandedPreviewStep, setExpandedPreviewStep] = useState<number | null>(null);
  const [scheduleMode, setScheduleMode] = useState<'now' | 'later'>('now');
  const [scheduledDate, setScheduledDate] = useState('');

  // Voice-first context input
  const [showTextInput, setShowTextInput] = useState(false);

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
  const [editingName, setEditingName] = useState(false);
  const [sendingTest, setSendingTest] = useState<number | null>(null);
  const [testSentStep, setTestSentStep] = useState<number | null>(null);
  const [highlightedEnrollmentId, setHighlightedEnrollmentId] = useState<number | null>(null);

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
      setExpandedPreviewStep(1);
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
    let newId: number | null = null;
    try {
      const payload: Record<string, string> = { ...form };
      if (scheduleMode === 'later' && scheduledDate) {
        payload.startDate = scheduledDate;
      }
      const res = await fetch('/api/nurture/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || 'Failed to start engagement');
        setEnrolling(false);
        return;
      }
      newId = data.enrollment?.id || null;
      setShowForm(false);
      setForm({ contactName: '', contactEmail: '', companyName: '', vertical: '', lossReason: '', accountContext: '' });
      setEnrollStep(1);
      setPreviewSteps([]);
      setScheduleMode('now');
      setScheduledDate('');
      setShowTextInput(false);
      setExpandedPreviewStep(null);
      setEditingName(false);
      setSendingTest(null);
      setTestSentStep(null);
      await loadData();
    } catch {
      setFormError('Failed to start engagement');
    } finally {
      setEnrolling(false);
      if (newId) {
        setHighlightedEnrollmentId(newId);
        setTimeout(() => setHighlightedEnrollmentId(null), 5000);
      }
    }
  };

  const handleTestSend = async (stepNumber: number) => {
    setSendingTest(stepNumber);
    setTestSentStep(null);
    try {
      const res = await fetch('/api/nurture/test-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stepNumber,
          testEmail: form.contactEmail || 'stephen.newman@checkit.net',
          contactName: form.contactName,
          contactEmail: form.contactEmail,
          companyName: form.companyName,
          vertical: form.vertical,
          accountContext: form.accountContext,
          lossReason: form.lossReason,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || 'Failed to send test');
      } else {
        setTestSentStep(stepNumber);
        setTimeout(() => setTestSentStep(null), 5000);
      }
    } catch {
      setFormError('Failed to send test email');
    } finally {
      setSendingTest(null);
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

  if (enrolling) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-6">
            <Loader2 className="w-6 h-6 animate-spin text-accent" />
          </div>
          <p className="text-lg font-medium text-foreground">Adding to engagement track</p>
          <p className="text-sm text-muted mt-2">Setting up the email sequence...</p>
        </div>
      </div>
    );
  }

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
            <Step1Form
              form={form}
              setForm={(f) => setForm(f)}
              showTextInput={showTextInput}
              setShowTextInput={setShowTextInput}
              formError={formError}
              loadingPreview={loadingPreview}
              onNext={handleNext}
            />
          )}

          {enrollStep === 2 && (
            <div className="space-y-5">
              {/* Contact summary — editable name */}
              <div className="bg-surface border border-border rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <span className="text-muted text-xs">Contact</span>
                    {editingName ? (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <input
                          type="text"
                          value={form.contactName}
                          onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                          className="flex-1 px-2 py-1 text-sm bg-surface-elevated border border-accent rounded focus:outline-none font-medium"
                          autoFocus
                          onKeyDown={(e) => { if (e.key === 'Enter') setEditingName(false); }}
                          onBlur={() => setEditingName(false)}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-foreground">{form.contactName}</span>
                        <button
                          type="button"
                          onClick={() => setEditingName(true)}
                          className="p-0.5 text-muted hover:text-accent transition-colors cursor-pointer"
                          title="Edit name — verify spelling"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                      </div>
                    )}
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

              {/* Scheduling */}
              <div className="bg-surface border border-border rounded-lg p-4">
                <h4 className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">When to start</h4>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setScheduleMode('now')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all cursor-pointer ${
                      scheduleMode === 'now'
                        ? 'bg-accent/10 border-accent/40 text-accent'
                        : 'bg-surface border-border text-muted hover:text-foreground'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    Start now
                  </button>
                  <button
                    type="button"
                    onClick={() => setScheduleMode('later')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all cursor-pointer ${
                      scheduleMode === 'later'
                        ? 'bg-accent/10 border-accent/40 text-accent'
                        : 'bg-surface border-border text-muted hover:text-foreground'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Schedule for later
                  </button>
                  {scheduleMode === 'later' && (
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="px-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg focus:outline-none focus:border-accent"
                    />
                  )}
                </div>
              </div>

              {/* Engagement pathway — split layout */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Engagement Pathway — 6 emails over 90 days</h3>
                <p className="text-xs text-muted mb-4">Click an email to preview it on the right.</p>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {/* Left: email list */}
                  <div className="md:col-span-2 space-y-0">
                    {previewSteps.map((step, i) => {
                      const theme = STEP_THEMES[step.step_number] || { theme: `Step ${step.step_number}`, description: '' };
                      const baseDate = scheduleMode === 'later' && scheduledDate ? new Date(scheduledDate + 'T00:00:00') : new Date();
                      const sendDate = addDays(baseDate, step.delay_days);
                      const isLast = i === previewSteps.length - 1;
                      const isSelected = expandedPreviewStep === step.step_number;

                      return (
                        <div key={step.step_number} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                              isSelected ? 'bg-accent text-white' : 'bg-accent/10 border border-accent/30'
                            }`}>
                              <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-accent'}`}>{step.step_number}</span>
                            </div>
                            {!isLast && <div className="w-px flex-1 bg-border min-h-[16px]" />}
                          </div>
                          <div className={`flex-1 ${isLast ? 'pb-0' : 'pb-3'}`}>
                            <button
                              type="button"
                              onClick={() => setExpandedPreviewStep(step.step_number)}
                              className={`w-full text-left px-3 py-2 -ml-1 rounded-lg transition-all cursor-pointer ${
                                isSelected ? 'bg-accent/10 border border-accent/20' : 'hover:bg-surface-elevated'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className={`text-sm font-medium ${isSelected ? 'text-accent' : 'text-foreground'}`}>{theme.theme}</span>
                                <span className="text-xs text-muted">Day {step.delay_days}</span>
                              </div>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <Calendar className="w-3 h-3 text-muted" />
                                <span className="text-xs text-muted">{sendDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                              </div>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Right: preview panel */}
                  <div className="md:col-span-3">
                    {expandedPreviewStep ? (
                      <EmailPreviewPanel
                        step={previewSteps.find((s) => s.step_number === expandedPreviewStep)!}
                        form={form}
                        sendingTest={sendingTest}
                        testSentStep={testSentStep}
                        onTestSend={handleTestSend}
                      />
                    ) : (
                      <div className="bg-surface border border-border rounded-lg p-8 text-center h-full flex items-center justify-center">
                        <div>
                          <Mail className="w-8 h-8 text-muted/30 mx-auto mb-2" />
                          <p className="text-sm text-muted">Click an email on the left to preview it</p>
                        </div>
                      </div>
                    )}
                  </div>
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
                  disabled={enrolling || (scheduleMode === 'later' && !scheduledDate)}
                  className="flex items-center gap-2 px-6 py-2.5 btn-gradient text-white rounded-lg text-sm font-medium cursor-pointer disabled:opacity-50"
                >
                  {enrolling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {scheduleMode === 'later' ? 'Schedule Engagement' : 'Start Engagement'}
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

function Step1Form({
  form,
  setForm,
  showTextInput,
  setShowTextInput,
  formError,
  loadingPreview,
  onNext,
}: {
  form: { contactName: string; contactEmail: string; companyName: string; vertical: string; lossReason: string; accountContext: string };
  setForm: (f: typeof form) => void;
  showTextInput: boolean;
  setShowTextInput: (v: boolean) => void;
  formError: string;
  loadingPreview: boolean;
  onNext: () => void;
}) {
  const {
    isRecording,
    isTranscribing,
    recordingTime,
    micPermission,
    error: voiceError,
    audioStream,
    startRecording,
    stopRecording,
  } = useVoiceRecording({
    onTranscriptionComplete: (text) => {
      if (form.accountContext.trim()) {
        setForm({ ...form, accountContext: form.accountContext + '\n\n' + text });
      } else {
        setForm({ ...form, accountContext: text });
      }
    },
  });

  const showMic = micPermission !== 'denied';

  return (
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

      {/* Account Context — voice-first */}
      <div className="bg-surface border border-border rounded-xl p-4">
        <label className="block text-sm font-medium text-foreground mb-1">Account Context</label>
        <p className="text-xs text-muted mb-3">What do you know about this account? Share via voice or text.</p>

        {form.accountContext && !showTextInput && (
          <div className="mb-3 bg-surface-elevated border border-border rounded-lg p-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm text-foreground/80 whitespace-pre-wrap flex-1">{form.accountContext}</p>
              <button
                type="button"
                onClick={() => setShowTextInput(true)}
                className="p-1 text-muted hover:text-accent shrink-0 cursor-pointer"
                title="Edit"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {showTextInput ? (
          <div className="space-y-2">
            <textarea
              value={form.accountContext}
              onChange={(e) => setForm({ ...form, accountContext: e.target.value })}
              placeholder="What were they evaluating? Who were the key stakeholders? What caused the loss?"
              rows={4}
              className="w-full px-3 py-2.5 text-sm bg-surface-elevated border border-border rounded-lg focus:outline-none focus:border-accent resize-none"
            />
            {showMic && !isRecording && !isTranscribing && (
              <button
                type="button"
                onClick={() => setShowTextInput(false)}
                className="text-xs text-muted hover:text-accent cursor-pointer"
              >
                Switch to voice
              </button>
            )}
          </div>
        ) : !form.accountContext || isRecording || isTranscribing ? (
          <div>
            {showMic && (
              <>
                {isRecording ? (
                  <div className="flex items-center gap-4 bg-red-500/5 border border-red-500/20 rounded-xl px-4 py-3">
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="shrink-0 w-14 h-14 flex items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/30 hover:bg-red-600 transition-all cursor-pointer"
                    >
                      <Square className="w-6 h-6" />
                    </button>
                    <div className="flex-1 flex items-center gap-3 min-w-0">
                      <VoiceWaveform stream={audioStream} />
                      <span className="text-sm font-mono text-red-400 shrink-0">{formatRecordingTime(recordingTime)}</span>
                    </div>
                  </div>
                ) : isTranscribing ? (
                  <div className="flex items-center gap-3 bg-accent/5 border border-accent/20 rounded-xl px-4 py-3">
                    <div className="w-14 h-14 flex items-center justify-center rounded-full bg-accent/20">
                      <Loader2 className="w-6 h-6 text-accent animate-spin" />
                    </div>
                    <span className="text-sm text-accent">Processing audio...</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={startRecording}
                    className="flex items-center gap-4 w-full bg-accent/5 hover:bg-accent/10 border border-accent/20 hover:border-accent/40 rounded-xl px-4 py-4 transition-all cursor-pointer group"
                  >
                    <div className="w-14 h-14 flex items-center justify-center rounded-full bg-accent/15 group-hover:bg-accent/25 transition-colors">
                      <Mic className="w-6 h-6 text-accent" />
                    </div>
                    <div className="text-left">
                      <span className="text-sm font-medium text-foreground">Tap to record</span>
                      <span className="block text-xs text-muted">Share what you know about this account</span>
                    </div>
                  </button>
                )}
              </>
            )}
            <button
              type="button"
              onClick={() => setShowTextInput(true)}
              className="flex items-center gap-1.5 mt-2 text-xs text-muted hover:text-accent cursor-pointer"
            >
              <Type className="w-3 h-3" />
              Or type instead
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            {showMic && !isRecording && !isTranscribing && (
              <button
                type="button"
                onClick={startRecording}
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted hover:text-accent bg-surface hover:bg-surface-elevated border border-border rounded-lg cursor-pointer transition-colors"
              >
                <Mic className="w-3 h-3" />
                Add more via voice
              </button>
            )}
          </div>
        )}

        {voiceError && <p className="text-xs text-red-400 mt-2">{voiceError}</p>}
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
          onClick={onNext}
          disabled={loadingPreview}
          className="flex items-center gap-2 px-6 py-2.5 btn-gradient text-white rounded-lg text-sm font-medium cursor-pointer disabled:opacity-50"
        >
          {loadingPreview ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Next — Preview Pathway
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function EmailPreviewPanel({
  step,
  form,
  sendingTest,
  testSentStep,
  onTestSend,
}: {
  step: StepPreview;
  form: { contactName: string; contactEmail: string; companyName: string; vertical: string; accountContext: string; lossReason: string };
  sendingTest: number | null;
  testSentStep: number | null;
  onTestSend: (stepNumber: number) => void;
}) {
  const theme = STEP_THEMES[step.step_number] || { theme: `Step ${step.step_number}`, description: '' };

  const previewBody = step.body_template
    .replace(/\{\{contact_name\}\}/g, form.contactName || 'there')
    .replace(/\{\{company_name\}\}/g, form.companyName || 'your organization')
    .replace(/\{\{vertical\}\}/g, form.vertical?.replace('-', ' ') || 'your industry')
    .replace(/\{\{sender_name\}\}/g, 'The Checkit Team')
    .replace(/\{\{personalized_context\}\}/g, form.accountContext
      ? '[Context from your notes will be woven in here]'
      : '[Additional context about their specific situation]')
    .replace(/\{\{content_block\}\}/g, '[Relevant content links selected for their vertical]');

  const previewSubject = step.subject_template
    .replace(/\{\{contact_name\}\}/g, form.contactName || 'there')
    .replace(/\{\{company_name\}\}/g, form.companyName || 'your organization')
    .replace(/\{\{vertical\}\}/g, form.vertical?.replace('-', ' ') || 'your industry');

  return (
    <div className="bg-surface-elevated border border-border rounded-lg overflow-hidden sticky top-4">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border bg-surface">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-muted">Email {step.step_number} of 6</span>
            <span className="mx-2 text-muted/30">·</span>
            <span className="text-xs text-accent font-medium">{theme.theme}</span>
          </div>
          <span className="text-xs text-muted">Day {step.delay_days}</span>
        </div>
      </div>

      {/* Subject */}
      <div className="px-4 py-2.5 border-b border-border/50">
        <div className="text-xs text-muted mb-0.5">Subject</div>
        <div className="text-sm font-medium text-foreground">{previewSubject}</div>
      </div>

      {/* Body */}
      <div className="px-4 py-4 max-h-[400px] overflow-y-auto">
        <div className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">{previewBody}</div>
        {(step.body_template.includes('{{personalized_context}}') || step.body_template.includes('{{content_block}}')) && (
          <div className="mt-4 px-3 py-2 bg-accent/5 border border-accent/15 rounded-lg">
            <p className="text-xs text-accent">
              Bracketed sections are filled with personalized content and relevant links when the email is sent.
            </p>
          </div>
        )}
      </div>

      {/* Test send footer */}
      <div className="px-4 py-3 border-t border-border bg-surface">
        {testSentStep === step.step_number ? (
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <CheckCircle2 className="w-4 h-4" />
            Test sent — check your inbox
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onTestSend(step.step_number)}
            disabled={sendingTest !== null}
            className="flex items-center gap-2 w-full justify-center px-4 py-2.5 text-sm font-medium text-accent bg-accent/10 hover:bg-accent/20 border border-accent/20 rounded-lg cursor-pointer disabled:opacity-50 transition-colors"
          >
            {sendingTest === step.step_number ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Send test preview to me
          </button>
        )}
      </div>
    </div>
  );
}

function VoiceWaveform({ stream }: { stream: MediaStream | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    if (!stream || !canvasRef.current) return;

    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 64;
    source.connect(analyser);
    analyserRef.current = analyser;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const barCount = 24;

    function draw() {
      if (!analyserRef.current || !ctx) return;
      animFrameRef.current = requestAnimationFrame(draw);
      analyserRef.current.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = canvas.width / barCount;
      const centerY = canvas.height / 2;

      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor((i / barCount) * dataArray.length);
        const value = dataArray[dataIndex] / 255;
        const barHeight = Math.max(3, value * centerY * 0.9);

        ctx.fillStyle = `rgba(239, 68, 68, ${0.4 + value * 0.6})`;
        ctx.beginPath();
        ctx.roundRect(
          i * barWidth + barWidth * 0.15,
          centerY - barHeight,
          barWidth * 0.7,
          barHeight * 2,
          2
        );
        ctx.fill();
      }
    }

    draw();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      analyserRef.current = null;
      source.disconnect();
      audioCtx.close();
    };
  }, [stream]);

  return (
    <canvas
      ref={canvasRef}
      width={240}
      height={48}
      className="w-full max-w-[240px] h-12"
    />
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
  const totalSteps = 6;

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
            const theme = STEP_THEMES[step.step_number] || { theme: `Step ${step.step_number}`, description: '' };
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
                      <span className={`text-xs font-medium ${isSelected ? 'text-accent' : isFuture ? 'text-muted' : 'text-foreground'}`}>{theme.theme}</span>
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
