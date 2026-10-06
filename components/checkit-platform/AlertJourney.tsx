'use client';

import { useEffect, useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Circle,
  ClipboardCheck,
  FileText,
  GitBranch,
  Mail,
  MessageSquare,
  PenLine,
  Phone,
  Radio,
  ShieldCheck,
  Smartphone,
  type LucideIcon,
} from 'lucide-react';
import { sparklinePath, valueToY } from './sparkline';

export type JourneyStepId = 'detect' | 'alert' | 'escalate' | 'act' | 'record' | 'prove';

export interface JourneyStep {
  id: JourneyStepId;
  title: string;
  description: string;
}

const stepIcons: Record<JourneyStepId, LucideIcon> = {
  detect: Radio,
  alert: Bell,
  escalate: GitBranch,
  act: ClipboardCheck,
  record: PenLine,
  prove: ShieldCheck,
};

const AUTO_ADVANCE_MS = 5000;

function Panel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] uppercase tracking-widest text-muted">{label}</span>
        <span className="text-[11px] text-muted">Vaccine fridge · Ward 4</span>
      </div>
      <div className="flex-1 flex flex-col justify-center">{children}</div>
    </div>
  );
}

function DetectVisual() {
  const series = [4.9, 5.1, 5.0, 5.2, 5.1, 5.3, 5.6, 6.0, 6.6, 7.2, 7.8, 8.4, 8.9];
  const w = 560;
  const h = 180;
  const min = 2;
  const max = 10;
  const { line, area, last } = sparklinePath(series, w, h, min, max);
  const upper = valueToY(8, h, min, max);
  const lower = valueToY(2, h, min, max);

  return (
    <Panel label="Live reading">
      <div className="flex items-end justify-between mb-3">
        <p className="text-4xl font-bold text-red-400 tabular-nums">8.9°C</p>
        <span className="text-xs px-2 py-1 rounded-md bg-red-500/15 text-red-300">Out of range</span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto overflow-visible" aria-hidden="true">
        <defs>
          <linearGradient id="platform-detect-area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="0" y={upper} width={w} height={lower - upper} fill="#22c55e" opacity="0.06" />
        <line x1="0" x2={w} y1={upper} y2={upper} stroke="#ef4444" strokeDasharray="4 4" strokeWidth="1" />
        <text x={w} y={upper - 6} textAnchor="end" className="fill-red-300 text-[10px]">Upper limit 8.0°C</text>
        <path d={area} fill="url(#platform-detect-area)" />
        <path d={line} fill="none" stroke="#3b82f6" strokeWidth="2" />
        <circle cx={last[0]} cy={last[1]} r="9" fill="#ef4444" opacity="0.25" className="animate-ping origin-center [transform-box:fill-box]" />
        <circle cx={last[0]} cy={last[1]} r="4" fill="#ef4444" />
      </svg>
    </Panel>
  );
}

function AlertVisual() {
  // TODO(product): email, SMS and voice call are documented for the current medical platform; in-app push
  // and in-app acknowledgement are not. Confirm for the new platform.
  const channels = [
    { icon: Smartphone, label: 'App push' },
    { icon: MessageSquare, label: 'SMS' },
    { icon: Phone, label: 'Voice call' },
    { icon: Mail, label: 'Email' },
  ];
  return (
    <Panel label="Alert sent">
      <div className="mx-auto w-full max-w-xs rounded-[1.75rem] border border-white/10 bg-black/40 p-3 shadow-xl">
        <div className="mx-auto w-16 h-1.5 rounded-full bg-white/10 mb-4" />
        <div className="rounded-2xl bg-white/[0.06] border border-white/10 p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-5 h-5 rounded-md bg-red-500/20 text-red-400 flex items-center justify-center">
              <Bell className="w-3 h-3" />
            </span>
            <span className="text-[10px] uppercase tracking-wider text-muted">Checkit · now</span>
          </div>
          <p className="text-sm font-semibold text-foreground">Temperature alert</p>
          <p className="text-xs text-muted mb-3">Vaccine fridge, Ward 4 is at 8.9°C.</p>
          <div className="grid grid-cols-2 gap-2">
            <span className="text-center text-xs font-medium py-2 rounded-lg bg-accent text-white">Acknowledge</span>
            <span className="text-center text-xs font-medium py-2 rounded-lg bg-white/[0.08] text-foreground">Details</span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-2 mt-5">
        {channels.map(({ icon: Icon, label }) => (
          <span key={label} className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-foreground">
            <Icon className="w-3.5 h-3.5 text-accent" />
            {label}
          </span>
        ))}
      </div>
    </Panel>
  );
}

function EscalateVisual() {
  const levels = [
    { role: 'Ward nurse in charge', status: 'No response', state: 'missed' as const },
    { role: 'Pharmacy on-call', status: 'Acknowledged', state: 'done' as const },
    { role: 'Facilities manager', status: 'Not needed', state: 'idle' as const },
  ];
  return (
    <Panel label="Escalation path">
      <ol className="space-y-0">
        {levels.map((level, i) => (
          <li key={level.role} className="relative pl-10 pb-5 last:pb-0">
            {i < levels.length - 1 && <span className="absolute left-[15px] top-8 bottom-0 w-px bg-white/10" aria-hidden="true" />}
            <span
              className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                level.state === 'done'
                  ? 'bg-green-500/20 text-green-300 ring-1 ring-green-500/40'
                  : level.state === 'missed'
                    ? 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30'
                    : 'bg-white/[0.05] text-muted ring-1 ring-white/10'
              }`}
            >
              L{i + 1}
            </span>
            <div className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2.5">
              <span className="text-sm text-foreground">{level.role}</span>
              <span
                className={`text-[11px] font-medium ${
                  level.state === 'done' ? 'text-green-300' : level.state === 'missed' ? 'text-amber-300' : 'text-muted'
                }`}
              >
                {level.status}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </Panel>
  );
}

function ActVisual() {
  // TODO(product): guided corrective-action checklists depend on task management, listed as roadmap for medical.
  const tasks = [
    { label: 'Check door seal and power', done: true },
    { label: 'Move stock to backup fridge', done: true },
    { label: 'Quarantine affected stock for review', done: true },
    { label: 'Confirm temperature back in range', done: false },
  ];
  return (
    <Panel label="Corrective action">
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.label}
            className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 ${
              task.done ? 'border-white/[0.06] bg-white/[0.03]' : 'border-accent/40 bg-accent/10'
            }`}
          >
            {task.done ? (
              <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
            ) : (
              <Circle className="w-4 h-4 text-accent shrink-0" />
            )}
            <span className={`text-sm ${task.done ? 'text-muted line-through decoration-white/20' : 'text-foreground'}`}>
              {task.label}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-4 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
        <div className="h-full w-3/4 rounded-full bg-linear-to-r from-accent to-green-400" />
      </div>
      <p className="mt-2 text-[11px] text-muted">3 of 4 steps complete</p>
    </Panel>
  );
}

function RecordVisual() {
  const entries = [
    { time: '02:14', text: 'Reading exceeded upper limit (8.9°C)', who: 'System' },
    { time: '02:14', text: 'Alert sent: push, SMS', who: 'System' },
    { time: '02:24', text: 'Escalated to level 2', who: 'System' },
    { time: '02:26', text: 'Alert acknowledged', who: 'Pharmacy on-call' },
    { time: '02:41', text: 'Corrective action completed', who: 'Pharmacy on-call' },
  ];
  return (
    <Panel label="Attributable record">
      <ul className="divide-y divide-white/[0.06] rounded-lg border border-white/[0.06] bg-white/[0.02]">
        {entries.map((entry, i) => (
          <li key={i} className="grid grid-cols-[3rem_1fr] gap-3 px-3 py-2.5">
            <span className="text-xs text-muted tabular-nums">{entry.time}</span>
            <div className="min-w-0">
              <p className="text-sm text-foreground leading-snug">{entry.text}</p>
              <p className="text-[11px] text-muted">{entry.who}</p>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function ProveVisual() {
  const sections = ['Readings and limits', 'Alert and escalation history', 'Actions and decisions', 'Electronic sign-off'];
  return (
    <Panel label="Evidence on demand">
      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
        <div className="flex items-start gap-3 mb-4">
          <span className="w-10 h-10 rounded-lg bg-accent/15 text-accent flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">Incident report</p>
            <p className="text-xs text-muted">Vaccine fridge, Ward 4 · complete record</p>
          </div>
        </div>
        <ul className="space-y-2 mb-4">
          {sections.map((section) => (
            <li key={section} className="flex items-center gap-2 text-sm text-foreground">
              <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
              {section}
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between rounded-lg bg-green-500/10 border border-green-500/20 px-3 py-2">
          <span className="text-xs text-green-300">Signed off by Pharmacy lead</span>
          <ShieldCheck className="w-4 h-4 text-green-300" />
        </div>
      </div>
    </Panel>
  );
}

const visuals: Record<JourneyStepId, () => React.ReactElement> = {
  detect: DetectVisual,
  alert: AlertVisual,
  escalate: EscalateVisual,
  act: ActVisual,
  record: RecordVisual,
  prove: ProveVisual,
};

export default function AlertJourney({ steps }: { steps: JourneyStep[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setTimeout(() => setActive((i) => (i + 1) % steps.length), AUTO_ADVANCE_MS);
    return () => window.clearTimeout(timer);
  }, [active, paused, steps.length]);

  const current = steps[active];
  const Visual = visuals[current.id];

  return (
    <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-stretch">
      <ol className="lg:col-span-5 space-y-2" role="tablist" aria-label="From alert to evidence">
        {steps.map((step, i) => {
          const Icon = stepIcons[step.id];
          const isActive = i === active;
          return (
            <li key={step.id}>
              <button
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setActive(i);
                  setPaused(true);
                }}
                className={`relative w-full text-left rounded-xl border px-4 py-3.5 transition-all overflow-hidden cursor-pointer ${
                  isActive
                    ? 'border-accent/50 bg-accent/10'
                    : 'border-border bg-surface/60 hover:border-accent/30 hover:bg-surface'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isActive ? 'bg-accent text-white' : 'bg-surface-elevated text-muted'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 font-semibold text-foreground">
                      <span className={`text-xs tabular-nums ${isActive ? 'text-accent' : 'text-muted'}`}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {step.title}
                    </p>
                    <p className={`text-sm leading-relaxed transition-colors ${isActive ? 'text-foreground/80' : 'text-muted'}`}>
                      {step.description}
                    </p>
                  </div>
                </div>
                {isActive && !paused && (
                  <span
                    key={`progress-${active}`}
                    className="platform-progress absolute left-0 bottom-0 h-0.5 bg-accent"
                    style={{ animationDuration: `${AUTO_ADVANCE_MS}ms` }}
                    aria-hidden="true"
                  />
                )}
              </button>
            </li>
          );
        })}
      </ol>

      <div className="lg:col-span-7" role="tabpanel" aria-label={current.title}>
        <div className="relative h-full min-h-[22rem] rounded-2xl border border-white/10 bg-[#0b1220] p-5 sm:p-7 shadow-2xl shadow-black/40 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent/15 blur-3xl rounded-full" aria-hidden="true" />
          <div key={current.id} className="relative h-full platform-fade-in">
            <Visual />
          </div>
        </div>
      </div>
    </div>
  );
}
