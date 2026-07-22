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
  MapPin,
} from 'lucide-react';

const STORAGE_KEY = 'checkit-gtm-planning-v3';

type Rep = {
  id: string;
  name: string;
  quota: number; // new + expansion ARR
  isOpen: boolean;
};

type Beachhead = { name: string; logo?: string };
type MarketDef = {
  id: string;
  label: string;
  detail?: string;
  category: 'medical' | 'commercial';
  beachheads: Beachhead[];
};

const UK_MARKETS: MarketDef[] = [
  {
    id: 'uk-healthcare',
    label: 'Healthcare / hospitals',
    detail: 'Pharmacies, pathologies',
    category: 'medical',
    beachheads: [{ name: 'NHS', logo: '/logos/nhs.svg' }],
  },
  {
    id: 'uk-forecourts',
    label: 'Forecourts',
    category: 'commercial',
    beachheads: [{ name: 'BP', logo: '/logos/bp.png' }],
  },
  {
    id: 'uk-entertainment',
    label: 'Entertainment',
    category: 'commercial',
    beachheads: [
      { name: 'P&O Ferries', logo: '/logos/poferries.png' },
      { name: 'Tenpin', logo: '/logos/tenpin.png' },
    ],
  },
  {
    id: 'uk-foodservice',
    label: 'Food service',
    category: 'commercial',
    beachheads: [],
  },
];

const US_MARKETS: MarketDef[] = [
  {
    id: 'us-plasma',
    label: 'Plasma',
    category: 'medical',
    beachheads: [
      { name: 'Grifols', logo: '/logos/grifols.svg' },
      { name: 'Octapharma', logo: '/logos/octapharma.svg' },
    ],
  },
  {
    id: 'us-venues',
    label: 'Food service (venues)',
    category: 'commercial',
    beachheads: [{ name: 'OVG' }],
  },
  {
    id: 'us-senior',
    label: 'Food service (senior living)',
    category: 'commercial',
    beachheads: [{ name: 'Morningstar' }],
  },
  {
    id: 'us-facilities',
    label: 'Food service (facilities)',
    category: 'commercial',
    beachheads: [{ name: 'ISS' }],
  },
];

type PlanState = {
  netNew: number;
  expansion: number;
  renewal: number;
  ukPct: number;
  closeRatePct: number; // opp → close
  avgDealSize: number;
  currentPipeline: number;
  ukMarketPct: Record<string, number>;
  usMarketPct: Record<string, number>;
  reps: Rep[];
};

function equalPcts(ids: string[]): Record<string, number> {
  const each = Math.floor(100 / ids.length);
  const out: Record<string, number> = {};
  ids.forEach((id, i) => {
    out[id] = i === ids.length - 1 ? 100 - each * (ids.length - 1) : each;
  });
  return out;
}

/** When one market % changes, rescale the others so the region still sums to 100. */
function setMarketPct(
  current: Record<string, number>,
  id: string,
  nextVal: number
): Record<string, number> {
  const clamped = clamp(nextVal, 0, 100);
  const others = Object.keys(current).filter((k) => k !== id);
  const remaining = 100 - clamped;
  const othersSum = others.reduce((s, k) => s + (current[k] || 0), 0) || others.length;
  const next: Record<string, number> = { ...current, [id]: clamped };
  let allocated = 0;
  others.forEach((k, i) => {
    if (i === others.length - 1) {
      next[k] = Math.max(0, remaining - allocated);
    } else {
      const v = Math.round(remaining * ((current[k] || 0) / othersSum));
      next[k] = v;
      allocated += v;
    }
  });
  return next;
}

const DEFAULT_STATE: PlanState = {
  netNew: 1_800_000,
  expansion: 600_000,
  renewal: 0,
  ukPct: 50,
  closeRatePct: 20,
  avgDealSize: 50_000,
  currentPipeline: 1_900_000,
  ukMarketPct: equalPcts(UK_MARKETS.map((m) => m.id)),
  usMarketPct: equalPcts(US_MARKETS.map((m) => m.id)),
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

function BeachheadChip({ name, logo }: Beachhead) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-surface border border-border text-xs text-foreground">
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo} alt="" className="h-3.5 w-auto max-w-[52px] object-contain" />
      ) : null}
      {name}
    </span>
  );
}

function RegionMarketPanel({
  title,
  regionArr,
  regionPct,
  markets,
  accentClass,
  onPctChange,
  onEqualize,
}: {
  title: string;
  regionArr: number;
  regionPct: number;
  markets: (MarketDef & { pct: number; arr: number })[];
  accentClass: string;
  onPctChange: (id: string, pct: number) => void;
  onEqualize: () => void;
}) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${accentClass}`} />
            {title}
          </h3>
          <p className="text-xs text-muted mt-1">
            {regionPct}% of total · {formatCompact(regionArr)} — split across beachhead markets
          </p>
        </div>
        <button
          type="button"
          onClick={onEqualize}
          className="text-xs px-2.5 py-1 rounded-lg bg-surface-elevated border border-border text-muted hover:text-foreground"
        >
          Equalize
        </button>
      </div>

      <StackBar
        segments={markets.map((m, i) => ({
          label: m.label,
          value: m.arr,
          className: [
            'bg-violet-500',
            'bg-sky-500',
            'bg-amber-500',
            'bg-emerald-500',
            'bg-rose-500',
          ][i % 5],
        }))}
      />

      <div className="space-y-4">
        {markets.map((m) => (
          <div key={m.id} className="rounded-lg border border-border/70 bg-surface-elevated/40 p-3 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-sm font-medium text-foreground">{m.label}</div>
                {m.detail ? <div className="text-[11px] text-muted">{m.detail}</div> : null}
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {m.beachheads.length > 0 ? (
                    m.beachheads.map((b) => <BeachheadChip key={b.name} {...b} />)
                  ) : (
                    <span className="text-[11px] text-muted italic">Beachhead TBD</span>
                  )}
                </div>
              </div>
              <span
                className={`text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded shrink-0 ${
                  m.category === 'medical'
                    ? 'bg-violet-500/20 text-violet-300'
                    : 'bg-orange-500/20 text-orange-300'
                }`}
              >
                {m.category}
              </span>
            </div>
            <SliderRow
              label="Share of region"
              value={m.pct}
              min={0}
              max={100}
              step={5}
              onChange={(v) => onPctChange(m.id, v)}
              display={`${m.pct}% · ${formatCompact(m.arr)}`}
            />
          </div>
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
        const parsed = JSON.parse(raw) as Partial<PlanState>;
        if (parsed?.reps?.length === 4) {
          setState({
            ...DEFAULT_STATE,
            ...parsed,
            reps: parsed.reps,
            ukMarketPct: { ...DEFAULT_STATE.ukMarketPct, ...parsed.ukMarketPct },
            usMarketPct: { ...DEFAULT_STATE.usMarketPct, ...parsed.usMarketPct },
          });
        }
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

  const usPct = 100 - state.ukPct;
  const ukArr = totalArr * (state.ukPct / 100);
  const usArr = totalArr * (usPct / 100);

  const ukMarketRows = UK_MARKETS.map((m) => {
    const pct = state.ukMarketPct[m.id] ?? 0;
    return { ...m, pct, arr: ukArr * (pct / 100) };
  });
  const usMarketRows = US_MARKETS.map((m) => {
    const pct = state.usMarketPct[m.id] ?? 0;
    return { ...m, pct, arr: usArr * (pct / 100) };
  });

  const medicalArr =
    ukMarketRows.filter((m) => m.category === 'medical').reduce((s, m) => s + m.arr, 0) +
    usMarketRows.filter((m) => m.category === 'medical').reduce((s, m) => s + m.arr, 0);
  const commercialArr = totalArr - medicalArr;
  const medicalPct = totalArr > 0 ? Math.round((medicalArr / totalArr) * 100) : 0;
  const commercialPct = 100 - medicalPct;

  const closeRate = Math.max(state.closeRatePct, 1) / 100;
  const coverageMultiple = 100 / Math.max(state.closeRatePct, 1);
  const pipelineNeeded = state.netNew * coverageMultiple;
  const pipelineGap = Math.max(0, pipelineNeeded - state.currentPipeline);
  const oppsNeeded =
    state.avgDealSize > 0 ? Math.ceil(state.netNew / state.avgDealSize / closeRate) : 0;

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
      `Opp→close ${state.closeRatePct}% ≈ ${coverageMultiple.toFixed(1)}:1 coverage`,
      `Current FY28 qualified pipeline ~${formatCompact(state.currentPipeline)}`,
      `Target ACV ~${formatCompact(state.avgDealSize)}`,
    ],
    [state.closeRatePct, state.currentPipeline, state.avgDealSize, coverageMultiple]
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
          {/* Medical / commercial — derived from beachheads */}
          <section className="bg-surface border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-accent" />
              <h2 className="font-semibold text-foreground">Medical vs commercial</h2>
            </div>
            <p className="text-xs text-muted">
              Derived from beachhead markets: medical = UK healthcare + US plasma.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-violet-500/10 border border-violet-500/20 p-3">
                <div className="text-xs text-muted">Medical</div>
                <div className="text-lg font-bold tabular-nums">{medicalPct}%</div>
                <div className="text-sm text-foreground tabular-nums">{formatCompact(medicalArr)}</div>
              </div>
              <div className="rounded-lg bg-orange-500/10 border border-orange-500/20 p-3">
                <div className="text-xs text-muted">Commercial</div>
                <div className="text-lg font-bold tabular-nums">{commercialPct}%</div>
                <div className="text-sm text-foreground tabular-nums">{formatCompact(commercialArr)}</div>
              </div>
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
            <p className="text-xs text-muted">
              Drives beachhead market £ below. UK/RoW vs US.
            </p>
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
            <SliderRow
              label="Opp → close conversion"
              value={state.closeRatePct}
              min={5}
              max={40}
              step={1}
              onChange={(v) => setState((p) => ({ ...p, closeRatePct: v }))}
              display={`${state.closeRatePct}% → ${coverageMultiple.toFixed(1)}:1`}
              hint="Steve model: ~20–23% (5:1 coverage)"
            />
            <SliderRow
              label="Avg deal size (ACV)"
              value={state.avgDealSize}
              min={20_000}
              max={100_000}
              step={5_000}
              onChange={(v) => setState((p) => ({ ...p, avgDealSize: v }))}
              display={formatGBP(state.avgDealSize)}
              hint="YTD ~£40–46k · target ~£50k"
            />
            <SliderRow
              label="Current qualified pipeline"
              value={state.currentPipeline}
              min={0}
              max={12_000_000}
              step={100_000}
              onChange={(v) => setState((p) => ({ ...p, currentPipeline: v }))}
              display={formatGBP(state.currentPipeline)}
            />
            <div className="space-y-3 text-sm pt-1 border-t border-border">
              <div className="flex justify-between gap-2">
                <span className="text-muted">Pipeline needed</span>
                <span className="font-medium tabular-nums">{formatGBP(pipelineNeeded)}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-muted">Gap to fill</span>
                <span className="font-semibold text-amber-400 tabular-nums">
                  {formatGBP(pipelineGap)}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-muted">Opps needed</span>
                <span className="font-medium tabular-nums">{oppsNeeded}</span>
              </div>
            </div>
            <p className="text-xs text-muted">
              Net-new {formatCompact(state.netNew)} ÷ {formatCompact(state.avgDealSize)} ÷{' '}
              {state.closeRatePct}% close ≈ {oppsNeeded} opportunities.
            </p>
          </section>
        </div>

        {/* Beachhead markets — derived from region */}
        <section className="mb-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <MapPin className="w-5 h-5 text-accent" />
              Beachhead markets
            </h2>
            <p className="text-sm text-muted mt-1">
              Region ARR flows into specific markets mapped to existing beachhead customers.
              Market % within each region always sum to 100%.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <RegionMarketPanel
              title="UK / RoW"
              regionArr={ukArr}
              regionPct={state.ukPct}
              markets={ukMarketRows}
              accentClass="bg-blue-500"
              onPctChange={(id, pct) =>
                setState((p) => ({
                  ...p,
                  ukMarketPct: setMarketPct(p.ukMarketPct, id, pct),
                }))
              }
              onEqualize={() =>
                setState((p) => ({
                  ...p,
                  ukMarketPct: equalPcts(UK_MARKETS.map((m) => m.id)),
                }))
              }
            />
            <RegionMarketPanel
              title="US"
              regionArr={usArr}
              regionPct={usPct}
              markets={usMarketRows}
              accentClass="bg-rose-500"
              onPctChange={(id, pct) =>
                setState((p) => ({
                  ...p,
                  usMarketPct: setMarketPct(p.usMarketPct, id, pct),
                }))
              }
              onEqualize={() =>
                setState((p) => ({
                  ...p,
                  usMarketPct: equalPcts(US_MARKETS.map((m) => m.id)),
                }))
              }
            />
          </div>
        </section>

        {/* Cross-cut matrix */}
        <section className="bg-surface border border-border rounded-xl p-5 mb-6">
          <h2 className="font-semibold text-foreground mb-4">Beachhead ARR rollup</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="text-left text-muted border-b border-border">
                  <th className="py-2 pr-4 font-medium">Market</th>
                  <th className="py-2 pr-4 font-medium">Region</th>
                  <th className="py-2 pr-4 font-medium">Beachheads</th>
                  <th className="py-2 pr-4 font-medium">% of region</th>
                  <th className="py-2 font-medium text-right">ARR</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ...ukMarketRows.map((m) => ({ ...m, region: 'UK / RoW' })),
                  ...usMarketRows.map((m) => ({ ...m, region: 'US' })),
                ].map((row) => (
                  <tr key={row.id} className="border-b border-border/60">
                    <td className="py-2.5 pr-4 text-foreground">{row.label}</td>
                    <td className="py-2.5 pr-4 text-muted">{row.region}</td>
                    <td className="py-2.5 pr-4 text-muted">
                      {row.beachheads.length
                        ? row.beachheads.map((b) => b.name).join(', ')
                        : '—'}
                    </td>
                    <td className="py-2.5 pr-4 tabular-nums">{row.pct}%</td>
                    <td className="py-2.5 tabular-nums font-medium text-right">
                      {formatGBP(row.arr)}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={4} className="py-3 text-muted">
                    Total
                  </td>
                  <td className="py-3 tabular-nums font-bold text-accent text-right">
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
