'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Target,
  Users,
  Globe,
  Building2,
  SlidersHorizontal,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

const STORAGE_KEY = 'checkit-gtm-planning-v1';
const PIPELINE_MULTIPLE = 5;
const CURRENT_QUALIFIED_PIPELINE = 1_900_000;

type Rep = {
  id: string;
  name: string;
  quota: number; // new + expansion ARR
  isOpen: boolean;
};

type PlanState = {
  netNew: number;
  expansion: number;
  renewal: number;
  medicalPct: number;
  ukPct: number;
  reps: Rep[];
};

const DEFAULT_STATE: PlanState = {
  netNew: 1_800_000,
  expansion: 600_000,
  renewal: 0,
  medicalPct: 50,
  ukPct: 50,
  reps: [
    { id: 'jen', name: 'Jen', quota: 600_000, isOpen: false },
    { id: 'ae-2', name: 'AE 2', quota: 600_000, isOpen: false },
    { id: 'ae-3', name: 'AE 3', quota: 600_000, isOpen: false },
    { id: 'open', name: 'Open hire', quota: 600_000, isOpen: true },
  ],
};

function formatGBP(n: number) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

function formatCompact(n: number) {
  if (Math.abs(n) >= 1_000_000) return `£${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 1 : 2)}m`;
  if (Math.abs(n) >= 1_000) return `£${Math.round(n / 1_000)}k`;
  return formatGBP(n);
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  display: string;
  hint?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <span className="text-sm font-semibold text-accent tabular-nums">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--accent)] h-2"
      />
      {hint ? <p className="text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

function StackBar({
  segments,
}: {
  segments: { label: string; value: number; className: string }[];
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  return (
    <div className="space-y-2">
      <div className="h-3 rounded-full overflow-hidden flex bg-surface-elevated">
        {segments.map((seg) => (
          <div
            key={seg.label}
            className={`h-full ${seg.className}`}
            style={{ width: `${(seg.value / total) * 100}%` }}
            title={`${seg.label}: ${formatGBP(seg.value)}`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        {segments.map((seg) => (
          <span key={seg.label} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${seg.className}`} />
            {seg.label} {formatCompact(seg.value)}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function GtmPlanningPage() {
  const [state, setState] = useState<PlanState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PlanState;
        if (parsed?.reps?.length === 4) setState({ ...DEFAULT_STATE, ...parsed });
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const newPlusExpansion = state.netNew + state.expansion;
  const totalArr = newPlusExpansion + state.renewal;
  const repTotal = state.reps.reduce((s, r) => s + r.quota, 0);
  const repDelta = repTotal - newPlusExpansion;
  const repsBalanced = Math.abs(repDelta) < 1;

  const commercialPct = 100 - state.medicalPct;
  const usPct = 100 - state.ukPct;

  const medicalArr = totalArr * (state.medicalPct / 100);
  const commercialArr = totalArr * (commercialPct / 100);
  const ukArr = totalArr * (state.ukPct / 100);
  const usArr = totalArr * (usPct / 100);

  const pipelineNeeded = state.netNew * PIPELINE_MULTIPLE;
  const pipelineGap = Math.max(0, pipelineNeeded - CURRENT_QUALIFIED_PIPELINE);

  const setArrType = (key: 'netNew' | 'expansion' | 'renewal', value: number) => {
    setState((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'renewal') return next;

      const target = next.netNew + next.expansion;
      const currentRepTotal = prev.reps.reduce((s, r) => s + r.quota, 0) || 1;
      return {
        ...next,
        reps: prev.reps.map((r) => ({
          ...r,
          quota: Math.round((r.quota / currentRepTotal) * target),
        })),
      };
    });
  };

  const setRepQuota = (id: string, quota: number) => {
    setState((prev) => {
      const reps = prev.reps.map((r) => (r.id === id ? { ...r, quota } : r));
      const total = reps.reduce((s, r) => s + r.quota, 0);
      const ratio =
        prev.netNew + prev.expansion > 0
          ? prev.netNew / (prev.netNew + prev.expansion)
          : 0.75;
      return {
        ...prev,
        reps,
        netNew: Math.round(total * ratio),
        expansion: Math.round(total * (1 - ratio)),
      };
    });
  };

  const equalizeReps = () => {
    setState((prev) => {
      const target = prev.netNew + prev.expansion;
      const each = Math.round(target / prev.reps.length);
      return {
        ...prev,
        reps: prev.reps.map((r, i) => ({
          ...r,
          // absorb rounding on last seat
          quota: i === prev.reps.length - 1 ? target - each * (prev.reps.length - 1) : each,
        })),
      };
    });
  };

  const resetDefaults = () => {
    setState(DEFAULT_STATE);
    localStorage.removeItem(STORAGE_KEY);
  };

  const assumptions = useMemo(
    () => [
      '£1.8m net-new / new-logo ARR target',
      '£600k expansion from existing customers (historical)',
      '£600k new + expansion per AE × 4 seats (3 FT + 1 open)',
      '5:1 pipeline coverage on net-new → £9.5m needed',
      'Current FY28 qualified pipeline ~£1.9m',
      'Opp→close ~20% · target ACV ~£50k',
    ],
    []
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <Target className="w-7 h-7 text-accent" />
              GTM Planning
            </h1>
            <p className="text-sm text-muted mt-1 max-w-2xl">
              FY28 ARR scenario model — net new, expansion, renewal by rep, market, and region.
              Sliders stay linked so the math adds up.
            </p>
          </div>
          <button
            type="button"
            onClick={resetDefaults}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-surface-elevated border border-border text-muted hover:text-foreground transition-colors self-start"
          >
            <RotateCcw className="w-4 h-4" />
            Reset defaults
          </button>
        </div>

        {/* Headline totals */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total ARR', value: totalArr, accent: true },
            { label: 'Net New', value: state.netNew },
            { label: 'Expansion', value: state.expansion },
            { label: 'Renewal', value: state.renewal },
          ].map((card) => (
            <div
              key={card.label}
              className={`rounded-xl border p-4 ${
                card.accent
                  ? 'bg-accent/10 border-accent/30'
                  : 'bg-surface border-border'
              }`}
            >
              <div className="text-xs text-muted mb-1">{card.label}</div>
              <div className="text-2xl font-bold text-foreground tabular-nums">
                {formatCompact(card.value)}
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* ARR type */}
          <section className="bg-surface border border-border rounded-xl p-5 space-y-5 lg:col-span-1">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-accent" />
              <h2 className="font-semibold text-foreground">ARR mix</h2>
            </div>
            <SliderRow
              label="Net new (new logo)"
              value={state.netNew}
              min={0}
              max={4_000_000}
              step={50_000}
              onChange={(v) => setArrType('netNew', v)}
              display={formatGBP(state.netNew)}
              hint="Steve model: ~£1.8m new-logo ARR"
            />
            <SliderRow
              label="Expansion"
              value={state.expansion}
              min={0}
              max={2_000_000}
              step={25_000}
              onChange={(v) => setArrType('expansion', v)}
              display={formatGBP(state.expansion)}
              hint="Historical ~£600k from existing customers"
            />
            <SliderRow
              label="Renewal / retained base"
              value={state.renewal}
              min={0}
              max={10_000_000}
              step={100_000}
              onChange={(v) => setArrType('renewal', v)}
              display={formatGBP(state.renewal)}
              hint="Nova = retention value; set your base ARR here"
            />
            <StackBar
              segments={[
                { label: 'Net new', value: state.netNew, className: 'bg-accent' },
                { label: 'Expansion', value: state.expansion, className: 'bg-sky-500' },
                { label: 'Renewal', value: state.renewal, className: 'bg-emerald-500' },
              ]}
            />
          </section>

          {/* By rep */}
          <section className="bg-surface border border-border rounded-xl p-5 space-y-4 lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-accent" />
                <h2 className="font-semibold text-foreground">By rep (new + expansion)</h2>
              </div>
              <button
                type="button"
                onClick={equalizeReps}
                className="text-xs px-3 py-1.5 rounded-lg bg-surface-elevated border border-border text-muted hover:text-foreground"
              >
                Equalize to £{Math.round(newPlusExpansion / 1000)}k each
              </button>
            </div>

            <div
              className={`flex items-center gap-2 text-sm rounded-lg px-3 py-2 border ${
                repsBalanced
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}
            >
              {repsBalanced ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0" />
              )}
              {repsBalanced ? (
                <span>
                  Rep quotas = net new + expansion ({formatGBP(newPlusExpansion)})
                </span>
              ) : (
                <span>
                  Off by {formatGBP(Math.abs(repDelta))} — adjusting a rep updates net
                  new/expansion to match
                </span>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {state.reps.map((rep) => (
                <div
                  key={rep.id}
                  className="rounded-lg border border-border bg-surface-elevated/50 p-4 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={rep.name}
                      onChange={(e) =>
                        setState((prev) => ({
                          ...prev,
                          reps: prev.reps.map((r) =>
                            r.id === rep.id ? { ...r, name: e.target.value } : r
                          ),
                        }))
                      }
                      className="flex-1 bg-transparent text-sm font-medium text-foreground border-b border-transparent focus:border-accent outline-none"
                    />
                    {rep.isOpen ? (
                      <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">
                        Open
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-accent/20 text-accent">
                        FT
                      </span>
                    )}
                  </div>
                  <SliderRow
                    label="Quota"
                    value={rep.quota}
                    min={0}
                    max={1_500_000}
                    step={25_000}
                    onChange={(v) => setRepQuota(rep.id, v)}
                    display={formatGBP(rep.quota)}
                  />
                  <div className="text-xs text-muted">
                    Share of new+exp:{' '}
                    {newPlusExpansion > 0
                      ? `${Math.round((rep.quota / newPlusExpansion) * 100)}%`
                      : '—'}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Market */}
          <section className="bg-surface border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-accent" />
              <h2 className="font-semibold text-foreground">Market split</h2>
            </div>
            <p className="text-xs text-muted">
              Medical: NHS (UK), blood/plasma/tissue (US). Commercial: facilities, food
              service, senior living.
            </p>
            <SliderRow
              label="Medical %"
              value={state.medicalPct}
              min={0}
              max={100}
              step={5}
              onChange={(v) => setState((p) => ({ ...p, medicalPct: clamp(v, 0, 100) }))}
              display={`${state.medicalPct}% · ${formatCompact(medicalArr)}`}
            />
            <div className="text-sm text-muted flex justify-between">
              <span>Commercial {commercialPct}%</span>
              <span className="tabular-nums text-foreground">{formatCompact(commercialArr)}</span>
            </div>
            <StackBar
              segments={[
                { label: 'Medical', value: medicalArr, className: 'bg-violet-500' },
                { label: 'Commercial', value: commercialArr, className: 'bg-orange-500' },
              ]}
            />
          </section>

          {/* Region */}
          <section className="bg-surface border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-accent" />
              <h2 className="font-semibold text-foreground">Region split</h2>
            </div>
            <p className="text-xs text-muted">Applied to total ARR for planning balance.</p>
            <SliderRow
              label="UK / RoW %"
              value={state.ukPct}
              min={0}
              max={100}
              step={5}
              onChange={(v) => setState((p) => ({ ...p, ukPct: clamp(v, 0, 100) }))}
              display={`${state.ukPct}% · ${formatCompact(ukArr)}`}
            />
            <div className="text-sm text-muted flex justify-between">
              <span>US {usPct}%</span>
              <span className="tabular-nums text-foreground">{formatCompact(usArr)}</span>
            </div>
            <StackBar
              segments={[
                { label: 'UK/RoW', value: ukArr, className: 'bg-blue-500' },
                { label: 'US', value: usArr, className: 'bg-rose-500' },
              ]}
            />
          </section>

          {/* Funnel check */}
          <section className="bg-surface border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              <h2 className="font-semibold text-foreground">Pipeline check</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-2">
                <span className="text-muted">Coverage multiple</span>
                <span className="font-medium">{PIPELINE_MULTIPLE}:1</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-muted">Pipeline needed</span>
                <span className="font-medium tabular-nums">{formatGBP(pipelineNeeded)}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-muted">FY28 qualified (now)</span>
                <span className="font-medium tabular-nums">
                  {formatGBP(CURRENT_QUALIFIED_PIPELINE)}
                </span>
              </div>
              <div className="flex justify-between gap-2 pt-2 border-t border-border">
                <span className="text-muted">Gap to fill</span>
                <span className="font-semibold text-amber-400 tabular-nums">
                  {formatGBP(pipelineGap)}
                </span>
              </div>
            </div>
            <p className="text-xs text-muted">
              At ~£50k ACV and 20% close, net-new {formatCompact(state.netNew)} ≈{' '}
              {Math.ceil(state.netNew / 50_000 / 0.2)} opportunities needed.
            </p>
          </section>
        </div>

        {/* Cross-cut matrix */}
        <section className="bg-surface border border-border rounded-xl p-5 mb-6">
          <h2 className="font-semibold text-foreground mb-4">Market × region (of total ARR)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[480px]">
              <thead>
                <tr className="text-left text-muted border-b border-border">
                  <th className="py-2 pr-4 font-medium"> </th>
                  <th className="py-2 pr-4 font-medium">UK / RoW ({state.ukPct}%)</th>
                  <th className="py-2 pr-4 font-medium">US ({usPct}%)</th>
                  <th className="py-2 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: `Medical (${state.medicalPct}%)`, m: state.medicalPct },
                  { label: `Commercial (${commercialPct}%)`, m: commercialPct },
                ].map((row) => (
                  <tr key={row.label} className="border-b border-border/60">
                    <td className="py-3 pr-4 text-muted">{row.label}</td>
                    <td className="py-3 pr-4 tabular-nums font-medium">
                      {formatGBP(totalArr * (row.m / 100) * (state.ukPct / 100))}
                    </td>
                    <td className="py-3 pr-4 tabular-nums font-medium">
                      {formatGBP(totalArr * (row.m / 100) * (usPct / 100))}
                    </td>
                    <td className="py-3 tabular-nums font-semibold">
                      {formatGBP(totalArr * (row.m / 100))}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="py-3 pr-4 text-muted">Total</td>
                  <td className="py-3 pr-4 tabular-nums font-semibold">{formatGBP(ukArr)}</td>
                  <td className="py-3 pr-4 tabular-nums font-semibold">{formatGBP(usArr)}</td>
                  <td className="py-3 tabular-nums font-bold text-accent">
                    {formatGBP(totalArr)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Assumptions */}
        <section className="bg-accent/5 border border-accent/20 rounded-xl p-5">
          <h2 className="font-semibold text-foreground mb-3">Model assumptions (from GTM thread)</h2>
          <ul className="grid sm:grid-cols-2 gap-2 text-sm text-muted">
            {assumptions.map((a) => (
              <li key={a} className="flex gap-2">
                <span className="text-accent shrink-0">•</span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
