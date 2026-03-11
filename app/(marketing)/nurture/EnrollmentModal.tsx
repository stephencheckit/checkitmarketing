'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Send,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  X,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Mic,
  Square,
  Pencil,
  Type,
} from 'lucide-react';
import { useVoiceRecording, formatRecordingTime } from '@/lib/useVoiceRecording';

// --- Types ---

export interface NurtureTrackOption {
  id: number;
  name: string;
  description: string | null;
  status: string;
}

// --- Constants ---

const PERSONA_TYPES = [
  { value: 'exec', label: 'C-Suite / Executive' },
  { value: 'vp', label: 'VP' },
  { value: 'director', label: 'Director' },
  { value: 'manager', label: 'Manager' },
  { value: 'individual', label: 'Individual Contributor' },
];

const PERSONA_FUNCTIONS = [
  { value: 'operations', label: 'Operations' },
  { value: 'food_safety', label: 'Food Safety / HACCP' },
  { value: 'compliance', label: 'Compliance / Quality' },
  { value: 'facilities', label: 'Facilities Management' },
  { value: 'it', label: 'IT / Technology' },
  { value: 'procurement', label: 'Procurement' },
  { value: 'finance', label: 'Finance' },
  { value: 'general_management', label: 'General Management' },
];

const CADENCE_OPTIONS = [
  { emails: 4, days: 30, label: '4 emails over 30 days' },
  { emails: 6, days: 60, label: '6 emails over 60 days' },
  { emails: 6, days: 90, label: '6 emails over 90 days (default)' },
  { emails: 8, days: 90, label: '8 emails over 90 days' },
  { emails: 8, days: 120, label: '8 emails over 120 days' },
];

const LOSS_REASONS = [
  { value: 'budget', label: 'Budget' },
  { value: 'timing', label: 'Timing' },
  { value: 'competitor', label: 'Went with competitor' },
  { value: 'no_decision', label: 'No decision made' },
  { value: 'champion_left', label: 'Champion left' },
  { value: 'other', label: 'Other' },
];

const VERTICALS = [
  { value: '', label: 'Select vertical...' },
  { value: 'senior-living', label: 'Senior Living' },
  { value: 'food-retail', label: 'Food Retail' },
  { value: 'food-facilities', label: 'Food Facilities' },
  { value: 'medical', label: 'Medical / Pharma' },
  { value: 'nhs-pharmacies', label: 'NHS Pharmacies' },
  { value: 'operations', label: 'General Operations' },
];

const TRACK_VERTICAL_MAP: Record<string, string> = {
  'Post-Call: Forecourts': 'food-retail',
  'Post-Call: Food to Go': 'food-facilities',
  'Post-Call: Facilities Management': 'operations',
  'Post-Call: Chain Dining & Pub Groups': 'food-facilities',
  'Post-Call: Pharmacy & Pathology (CAM+)': 'medical',
};

function isIndustryTrack(trackName: string): boolean {
  return trackName.startsWith('Post-Call:');
}

function isClosedLostTrack(trackName: string): boolean {
  return trackName.toLowerCase().includes('closed-lost');
}

const FREE_EMAIL_PROVIDERS = new Set([
  'gmail', 'yahoo', 'hotmail', 'outlook', 'aol', 'icloud',
  'protonmail', 'live', 'msn', 'me', 'mail', 'ymail', 'zoho',
]);

function extractCompanyFromDomain(email: string): string {
  const match = email.match(/@([^.]+)\./);
  if (!match) return '';
  const domain = match[1].toLowerCase();
  if (FREE_EMAIL_PROVIDERS.has(domain)) return '';
  return domain.charAt(0).toUpperCase() + domain.slice(1);
}

// --- Components ---

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

// --- Main Modal ---

const TOTAL_STEPS = 5;
const STEP_LABELS = ['Contact', 'Persona', 'Track', 'Cadence', 'Context'];

export default function EnrollmentModal({
  onClose,
  onSuccess,
  tracks,
  enrolledByEmail,
}: {
  onClose: () => void;
  onSuccess: (newId: number | null) => void;
  tracks: NurtureTrackOption[];
  enrolledByEmail?: string;
}) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    contactName: '',
    contactEmail: '',
    companyName: '',
    vertical: '',
    lossReason: '',
    personaType: '',
    personaFunction: '',
    emailCount: '6',
    periodDays: '90',
    accountContext: '',
  });
  const [selectedTrackId, setSelectedTrackId] = useState('');
  const [scheduleMode, setScheduleMode] = useState<'now' | 'later'>('now');
  const [scheduledDate, setScheduledDate] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [error, setError] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [companyHint, setCompanyHint] = useState('');

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
      setForm(prev => ({
        ...prev,
        accountContext: prev.accountContext.trim()
          ? prev.accountContext + '\n\n' + text
          : text,
      }));
    },
  });

  const showMic = micPermission !== 'denied';

  // Auto-fill company from email domain
  const handleEmailBlur = () => {
    if (!form.companyName && form.contactEmail) {
      const hint = extractCompanyFromDomain(form.contactEmail);
      if (hint) {
        setCompanyHint(hint);
        setForm(prev => ({ ...prev, companyName: hint }));
      }
    }
  };

  // Persona selection → auto-advance when both set (step 2 → step 3)
  const handlePersonaTypeSelect = (value: string) => {
    setForm(prev => ({ ...prev, personaType: value }));
    if (form.personaFunction) {
      setTimeout(() => setStep(3), 300);
    }
  };

  const handlePersonaFunctionSelect = (value: string) => {
    setForm(prev => ({ ...prev, personaFunction: value }));
    if (form.personaType) {
      setTimeout(() => setStep(3), 300);
    }
  };

  // Track selection → auto-advance to step 4
  const handleTrackSelect = (trackId: string) => {
    setSelectedTrackId(trackId);
    const track = tracks.find(t => String(t.id) === trackId);
    if (track) {
      const implied = TRACK_VERTICAL_MAP[track.name];
      if (implied) {
        setForm(prev => ({ ...prev, vertical: implied }));
      }
      if (isIndustryTrack(track.name)) {
        setForm(prev => ({ ...prev, emailCount: '6', periodDays: '45' }));
      }
    }
    setTimeout(() => setStep(4), 300);
  };

  const canAdvance = (fromStep: number): boolean => {
    switch (fromStep) {
      case 1:
        if (!form.contactName.trim() || !form.contactEmail.trim()) return false;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail);
      case 2:
        return true; // persona is optional
      case 3:
        return !!selectedTrackId;
      case 4:
        if (scheduleMode === 'later' && !scheduledDate) return false;
        return true;
      default:
        return true;
    }
  };

  const goNext = () => {
    if (!canAdvance(step)) {
      if (step === 1) setError('Name and a valid email are required');
      if (step === 3) setError('Please select a track');
      return;
    }
    setError('');
    setStep(s => Math.min(s + 1, TOTAL_STEPS));
  };

  const goBack = () => {
    setError('');
    setStep(s => Math.max(s - 1, 1));
  };

  const handleEnroll = async () => {
    setError('');
    setEnrolling(true);
    try {
      const payload: Record<string, string | boolean> = { ...form };
      if (selectedTrackId) payload.trackId = selectedTrackId;
      if (scheduleMode === 'later' && scheduledDate) {
        payload.startDate = scheduledDate;
      }
      if (scheduleMode === 'now') {
        payload.sendNow = true;
      }
      if (enrolledByEmail) {
        payload.enrolledByEmail = enrolledByEmail;
      }
      const res = await fetch('/api/nurture/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to start engagement');
        setEnrolling(false);
        return;
      }
      onSuccess(data.enrollment?.id || null);
    } catch {
      setError('Failed to start engagement');
      setEnrolling(false);
    }
  };

  const selectedTrack = tracks.find(t => String(t.id) === selectedTrackId);
  const selectedTrackName = selectedTrack?.name || '';
  const isIndustry = isIndustryTrack(selectedTrackName);
  const isClosedLost = isClosedLostTrack(selectedTrackName);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-surface-elevated border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with step indicator */}
        <div className="px-6 pt-5 pb-4 border-b border-border shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Add Contact</h2>
            <button onClick={onClose} className="p-1.5 text-muted hover:text-foreground rounded-lg hover:bg-surface transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center">
            {STEP_LABELS.map((label, i) => {
              const n = i + 1;
              const isActive = step === n;
              const isDone = step > n;
              return (
                <div key={label} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                      isActive ? 'bg-accent text-white' : isDone ? 'bg-accent/20 text-accent' : 'bg-surface border border-border text-muted'
                    }`}>
                      {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : n}
                    </div>
                    <span className={`text-[9px] mt-1 whitespace-nowrap ${isActive ? 'text-accent font-medium' : 'text-muted'}`}>{label}</span>
                  </div>
                  {i < STEP_LABELS.length - 1 && (
                    <div className={`flex-1 h-px mx-1.5 -mt-3 ${isDone ? 'bg-accent/30' : 'bg-border'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {enrolling ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <Loader2 className="w-6 h-6 animate-spin text-accent" />
              </div>
              <p className="text-sm font-medium text-foreground">Adding to engagement track...</p>
              <p className="text-xs text-muted mt-1">Setting up the email sequence</p>
            </div>
          ) : (
            <>
              {/* Step 1: Contact Info */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-medium text-foreground mb-1">Who are you enrolling?</h3>
                    <p className="text-xs text-muted">Enter their contact details to get started.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={form.contactName}
                      onChange={e => setForm(prev => ({ ...prev, contactName: e.target.value }))}
                      placeholder="Jane Smith"
                      className="w-full px-3 py-2.5 text-sm bg-surface border border-border rounded-lg focus:outline-none focus:border-accent"
                      autoFocus
                      onKeyDown={e => { if (e.key === 'Enter') goNext(); }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Email *</label>
                    <input
                      type="email"
                      value={form.contactEmail}
                      onChange={e => setForm(prev => ({ ...prev, contactEmail: e.target.value }))}
                      onBlur={handleEmailBlur}
                      placeholder="jane@company.com"
                      className="w-full px-3 py-2.5 text-sm bg-surface border border-border rounded-lg focus:outline-none focus:border-accent"
                      onKeyDown={e => { if (e.key === 'Enter') goNext(); }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Company</label>
                    <input
                      type="text"
                      value={form.companyName}
                      onChange={e => { setForm(prev => ({ ...prev, companyName: e.target.value })); setCompanyHint(''); }}
                      placeholder="Acme Corp"
                      className="w-full px-3 py-2.5 text-sm bg-surface border border-border rounded-lg focus:outline-none focus:border-accent"
                      onKeyDown={e => { if (e.key === 'Enter') goNext(); }}
                    />
                    {companyHint && form.companyName === companyHint && (
                      <p className="text-[10px] text-muted mt-1">Auto-detected from email domain</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Persona */}
              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-base font-medium text-foreground mb-1">{"What's their role?"}</h3>
                    <p className="text-xs text-muted">Helps tailor email content and tone. You can skip this.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-2">Level</label>
                    <div className="flex flex-wrap gap-2">
                      {PERSONA_TYPES.map(p => (
                        <button
                          key={p.value}
                          type="button"
                          onClick={() => handlePersonaTypeSelect(p.value)}
                          className={`px-3.5 py-2 rounded-lg text-sm border transition-all cursor-pointer ${
                            form.personaType === p.value
                              ? 'bg-accent/10 border-accent/40 text-accent font-medium'
                              : 'bg-surface border-border text-muted hover:text-foreground hover:border-accent/30'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-2">Function</label>
                    <div className="flex flex-wrap gap-2">
                      {PERSONA_FUNCTIONS.map(f => (
                        <button
                          key={f.value}
                          type="button"
                          onClick={() => handlePersonaFunctionSelect(f.value)}
                          className={`px-3.5 py-2 rounded-lg text-sm border transition-all cursor-pointer ${
                            form.personaFunction === f.value
                              ? 'bg-accent/10 border-accent/40 text-accent font-medium'
                              : 'bg-surface border-border text-muted hover:text-foreground hover:border-accent/30'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Select Track */}
              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-medium text-foreground mb-1">Select engagement track</h3>
                    <p className="text-xs text-muted">Choose the email sequence for this contact.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {tracks.filter(t => t.status === 'active').map(track => (
                      <button
                        key={track.id}
                        type="button"
                        onClick={() => handleTrackSelect(String(track.id))}
                        className={`text-left px-4 py-3.5 rounded-xl border transition-all cursor-pointer ${
                          selectedTrackId === String(track.id)
                            ? 'bg-accent/10 border-accent/40 text-accent ring-2 ring-accent/20'
                            : 'bg-surface border-border text-foreground hover:border-accent/30 hover:bg-surface-elevated'
                        }`}
                      >
                        <div className="text-sm font-medium">{track.name}</div>
                        {track.description && (
                          <div className="text-xs mt-0.5 text-muted line-clamp-2">{track.description}</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Cadence & Scheduling */}
              {step === 4 && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-base font-medium text-foreground mb-1">Email cadence</h3>
                    <p className="text-xs text-muted">How many emails, and when to start.</p>
                  </div>

                  {isIndustry ? (
                    <div className="bg-accent/5 border border-accent/15 rounded-lg px-4 py-3">
                      <p className="text-sm text-accent font-medium">Pre-set cadence for this track</p>
                      <p className="text-xs text-muted mt-1">6 emails over 45 days (Day 0, 3, 7, 14, 30, 45)</p>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-2">Cadence</label>
                      <div className="grid grid-cols-1 gap-2">
                        {CADENCE_OPTIONS.map(c => {
                          const val = `${c.emails}-${c.days}`;
                          const isSelected = `${form.emailCount}-${form.periodDays}` === val;
                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setForm(prev => ({ ...prev, emailCount: String(c.emails), periodDays: String(c.days) }))}
                              className={`text-left px-4 py-2.5 rounded-lg border transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-accent/10 border-accent/40 text-accent'
                                  : 'bg-surface border-border text-muted hover:text-foreground hover:border-accent/30'
                              }`}
                            >
                              <span className="text-sm font-medium">{c.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-2">When to start</label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setScheduleMode('now')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition-all cursor-pointer ${
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
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition-all cursor-pointer ${
                          scheduleMode === 'later'
                            ? 'bg-accent/10 border-accent/40 text-accent'
                            : 'bg-surface border-border text-muted hover:text-foreground'
                        }`}
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        Schedule for later
                      </button>
                    </div>
                    {scheduleMode === 'later' && (
                      <input
                        type="date"
                        value={scheduledDate}
                        onChange={e => setScheduledDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="mt-3 px-3 py-2 text-sm bg-surface border border-border rounded-lg focus:outline-none focus:border-accent"
                      />
                    )}
                  </div>

                  {isClosedLost && (
                    <div>
                      <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-2">Loss Reason</label>
                      <div className="flex flex-wrap gap-2">
                        {LOSS_REASONS.map(r => (
                          <button
                            key={r.value}
                            type="button"
                            onClick={() => setForm(prev => ({ ...prev, lossReason: r.value }))}
                            className={`px-3 py-2 rounded-lg text-sm border transition-all cursor-pointer ${
                              form.lossReason === r.value
                                ? 'bg-accent/10 border-accent/40 text-accent font-medium'
                                : 'bg-surface border-border text-muted hover:text-foreground hover:border-accent/30'
                            }`}
                          >
                            {r.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {!isIndustry && (
                    <div>
                      <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-2">Vertical</label>
                      <select
                        value={form.vertical}
                        onChange={e => setForm(prev => ({ ...prev, vertical: e.target.value }))}
                        className="w-full px-3 py-2 text-sm bg-surface border border-border rounded-lg focus:outline-none focus:border-accent"
                      >
                        {VERTICALS.map(v => (
                          <option key={v.value} value={v.value}>{v.label}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* Step 5: Context + Review */}
              {step === 5 && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-base font-medium text-foreground mb-1">Account context</h3>
                    <p className="text-xs text-muted">What do you know about this account? This personalizes the emails. Optional.</p>
                  </div>

                  <div className="bg-surface border border-border rounded-xl p-4">
                    {showTextInput ? (
                      <div className="space-y-2">
                        <textarea
                          value={form.accountContext}
                          onChange={e => setForm(prev => ({ ...prev, accountContext: e.target.value }))}
                          placeholder="What were they evaluating? Who were the key stakeholders?"
                          rows={3}
                          className="w-full px-3 py-2.5 text-sm bg-surface-elevated border border-border rounded-lg focus:outline-none focus:border-accent resize-none"
                          autoFocus
                        />
                        {showMic && !isRecording && !isTranscribing && (
                          <button type="button" onClick={() => setShowTextInput(false)} className="text-xs text-muted hover:text-accent cursor-pointer">
                            Switch to voice
                          </button>
                        )}
                      </div>
                    ) : form.accountContext && !isRecording && !isTranscribing ? (
                      <div>
                        <div className="bg-surface-elevated border border-border rounded-lg p-3 mb-2">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm text-foreground/80 whitespace-pre-wrap flex-1">{form.accountContext}</p>
                            <button type="button" onClick={() => setShowTextInput(true)} className="p-1 text-muted hover:text-accent shrink-0 cursor-pointer">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        {showMic && (
                          <button type="button" onClick={startRecording} className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted hover:text-accent bg-surface hover:bg-surface-elevated border border-border rounded-lg cursor-pointer transition-colors">
                            <Mic className="w-3 h-3" />
                            Add more via voice
                          </button>
                        )}
                      </div>
                    ) : (
                      <div>
                        {showMic && (
                          <>
                            {isRecording ? (
                              <div className="flex items-center gap-4 bg-red-500/5 border border-red-500/20 rounded-xl px-4 py-3">
                                <button type="button" onClick={stopRecording} className="shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/30 hover:bg-red-600 transition-all cursor-pointer">
                                  <Square className="w-5 h-5" />
                                </button>
                                <div className="flex-1 flex items-center gap-3 min-w-0">
                                  <VoiceWaveform stream={audioStream} />
                                  <span className="text-sm font-mono text-red-400 shrink-0">{formatRecordingTime(recordingTime)}</span>
                                </div>
                              </div>
                            ) : isTranscribing ? (
                              <div className="flex items-center gap-3 bg-accent/5 border border-accent/20 rounded-xl px-4 py-3">
                                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-accent/20">
                                  <Loader2 className="w-5 h-5 text-accent animate-spin" />
                                </div>
                                <span className="text-sm text-accent">Processing audio...</span>
                              </div>
                            ) : (
                              <button type="button" onClick={startRecording} className="flex items-center gap-4 w-full bg-accent/5 hover:bg-accent/10 border border-accent/20 hover:border-accent/40 rounded-xl px-4 py-3 transition-all cursor-pointer group">
                                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-accent/15 group-hover:bg-accent/25 transition-colors">
                                  <Mic className="w-5 h-5 text-accent" />
                                </div>
                                <div className="text-left">
                                  <span className="text-sm font-medium text-foreground">Tap to record</span>
                                  <span className="block text-xs text-muted">Share what you know about this account</span>
                                </div>
                              </button>
                            )}
                          </>
                        )}
                        <button type="button" onClick={() => setShowTextInput(true)} className="flex items-center gap-1.5 mt-2 text-xs text-muted hover:text-accent cursor-pointer">
                          <Type className="w-3 h-3" />
                          Or type instead
                        </button>
                      </div>
                    )}
                    {voiceError && <p className="text-xs text-red-400 mt-1">{voiceError}</p>}
                  </div>

                  {/* Summary */}
                  <div className="bg-surface border border-border rounded-xl p-4">
                    <h4 className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">Review</h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
                      <div>
                        <span className="text-muted text-xs">Contact</span>
                        <div className="font-medium text-foreground">{form.contactName}</div>
                      </div>
                      <div>
                        <span className="text-muted text-xs">Email</span>
                        <div className="font-medium text-foreground truncate">{form.contactEmail}</div>
                      </div>
                      {form.companyName && (
                        <div>
                          <span className="text-muted text-xs">Company</span>
                          <div className="font-medium text-foreground">{form.companyName}</div>
                        </div>
                      )}
                      <div>
                        <span className="text-muted text-xs">Track</span>
                        <div className="font-medium text-foreground">{selectedTrackName || '—'}</div>
                      </div>
                      {(form.personaType || form.personaFunction) && (
                        <div>
                          <span className="text-muted text-xs">Persona</span>
                          <div className="font-medium text-foreground">
                            {PERSONA_TYPES.find(p => p.value === form.personaType)?.label || ''}
                            {form.personaType && form.personaFunction ? ', ' : ''}
                            {PERSONA_FUNCTIONS.find(f => f.value === form.personaFunction)?.label || ''}
                          </div>
                        </div>
                      )}
                      <div>
                        <span className="text-muted text-xs">Cadence</span>
                        <div className="font-medium text-foreground">{form.emailCount} emails / {form.periodDays} days</div>
                      </div>
                      <div>
                        <span className="text-muted text-xs">Start</span>
                        <div className="font-medium text-foreground">{scheduleMode === 'now' ? 'Immediately' : scheduledDate || 'Not set'}</div>
                      </div>
                      {form.lossReason && (
                        <div>
                          <span className="text-muted text-xs">Loss Reason</span>
                          <div className="font-medium text-foreground capitalize">{form.lossReason.replace('_', ' ')}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2 mt-4">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!enrolling && (
          <div className="px-6 py-4 border-t border-border flex items-center justify-between shrink-0">
            <div>
              {step > 1 ? (
                <button type="button" onClick={goBack} className="flex items-center gap-2 px-4 py-2 text-sm text-muted hover:text-foreground bg-surface border border-border rounded-lg cursor-pointer">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              ) : (
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-muted hover:text-foreground cursor-pointer">
                  Cancel
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              {step === 2 && (
                <button type="button" onClick={goNext} className="px-4 py-2 text-sm text-muted hover:text-foreground cursor-pointer">
                  Skip
                </button>
              )}
              {step < TOTAL_STEPS ? (
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!canAdvance(step)}
                  className="flex items-center gap-2 px-5 py-2.5 btn-gradient text-white rounded-lg text-sm font-medium cursor-pointer disabled:opacity-50"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleEnroll}
                  className="flex items-center gap-2 px-5 py-2.5 btn-gradient text-white rounded-lg text-sm font-medium cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Start Engagement
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
