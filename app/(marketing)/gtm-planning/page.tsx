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
  UserPlus,
  Zap,
} from 'lucide-react';

const STORAGE_KEY = 'checkit-gtm-planning-v4';

type ScenarioId = 'base' | 'upside' | 'conservative' | 'custom';

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

const ALL_MARKET_IDS = [...UK_MARKETS, ...US_MARKETS].map((m) => m.id);

type PlanState = {
  scenario: ScenarioId;
  includeOpenHire: boolean;
  netNew: number;
  expansion: number;
  renewal: number;
  ukPct: number;
  closeRatePct: number; // opp → close
  avgDealSize: number;
  currentPipeline: number;
  marketPipeline: Record<string, number>;
  ukMarketPct: Record<string, number>;
  usMarketPct: Record<string, number>;
  sdrCount: number;
  meetingsPerSdrPerMonth: number;
  meetingToOppPct: number;
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

function distributePipeline(total: number, weights: Record<string, number>): Record<string, number> {
  const ids = ALL_MARKET_IDS;
  const weightSum = ids.reduce((s, id) => s + (weights[id] || 0), 0) || ids.length;
  const out: Record<string, number> = {};
  let allocated = 0;
  ids.forEach((id, i) => {
    if (i === ids.length - 1) {
      out[id] = Math.max(0, total - allocated);
    } else {
      const v = Math.round(total * ((weights[id] || 0) / weightSum));
      out[id] = v;
      allocated += v;
    }
  });
  return out;
}

function buildReps(includeOpen: boolean, targetNewExp: number): Rep[] {
  const base: Rep[] = [
    { id: 'jen', name: 'Jen', quota: 0, isOpen: false },
    { id: 'ae-2', name: 'AE 2', quota: 0, isOpen: false },
    { id: 'ae-3', name: 'AE 3', quota: 0, isOpen: false },
    { id: 'open', name: 'Open hire', quota: 0, isOpen: true },
  ];
  const active = includeOpen ? base : base.filter((r) => !r.isOpen);
  const each = Math.round(targetNewExp / active.length);
  return base.map((r) => {
    if (!includeOpen && r.isOpen) return { ...r, quota: 0 };
    const idx = active.findIndex((a) => a.id === r.id);
    if (idx < 0) return { ...r, quota: 0 };
    const quota =
      idx === active.length - 1 ? targetNewExp - each * (active.length - 1) : each;
    return { ...r, quota };
  });
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

const DEFAULT_PIPELINE = 1_900_000;

const DEFAULT_STATE: PlanState = {
  scenario: 'base',
  includeOpenHire: true,
  netNew: 1_800_000,
  expansion: 600_000,
  renewal: 0,
  ukPct: 50,
  closeRatePct: 20,
  avgDealSize: 50_000,
  currentPipeline: DEFAULT_PIPELINE,
  marketPipeline: distributePipeline(
    DEFAULT_PIPELINE,
    Object.fromEntries(ALL_MARKET_IDS.map((id) => [id, 1]))
  ),
  ukMarketPct: equalPcts(UK_MARKETS.map((m) => m.id)),
  usMarketPct: equalPcts(US_MARKETS.map((m) => m.id)),
  sdrCount: 2,
  meetingsPerSdrPerMonth: 11,
  meetingToOppPct: 50,
  reps: buildReps(true, 2_400_000),
};

const SCENARIOS: {
  id: Exclude<ScenarioId, 'custom'>;
  label: string;
  blurb: string;
  patch: Partial<PlanState>;
}[] = [
  {
    id: 'base',
    label: 'Base',
    blurb: 'Steve model · £1.8m new',
    patch: {
      netNew: 1_800_000,
      expansion: 600_000,
      closeRatePct: 20,
      avgDealSize: 50_000,
      currentPipeline: 1_900_000,
      sdrCount: 2,
      meetingsPerSdrPerMonth: 11,
      meetingToOppPct: 50,
    },
  },
  {
    id: 'upside',
    label: 'Upside',
    blurb: '£2.2m new · 23% close',
    patch: {
      netNew: 2_200_000,
      expansion: 800_000,
      closeRatePct: 23,
      avgDealSize: 55_000,
      currentPipeline: 1_900_000,
      sdrCount: 3,
      meetingsPerSdrPerMonth: 12,
      meetingToOppPct: 50,
    },
  },
  {
    id: 'conservative',
    label: 'Conservative',
    blurb: '£1.4m new · 15% close',
    patch: {
      netNew: 1_400_000,
      expansion: 500_000,
      closeRatePct: 15,
      avgDealSize: 40_000,
      currentPipeline: 1_900_000,
      sdrCount: 2,
      meetingsPerSdrPerMonth: 8,
      meetingToOppPct: 40,
    },
  },
];

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
            marketPipeline: {
              ...DEFAULT_STATE.marketPipeline,
              ...parsed.marketPipeline,
            },
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

  const activeReps = state.reps.filter((r) => state.includeOpenHire || !r.isOpen);
  const newPlusExpansion = state.netNew + state.expansion;
  const totalArr = newPlusExpansion + state.renewal;
  const repTotal = activeReps.reduce((s, r) => s + r.quota, 0);
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
  const allMarketRows = [...ukMarketRows, ...usMarketRows];

  const medicalArr =
    ukMarketRows.filter((m) => m.category === 'medical').reduce((s, m) => s + m.arr, 0) +
    usMarketRows.filter((m) => m.category === 'medical').reduce((s, m) => s + m.arr, 0);
  const commercialArr = totalArr - medicalArr;
  const medicalPct = totalArr > 0 ? Math.round((medicalArr / totalArr) * 100) : 0;
  const commercialPct = 100 - medicalPct;

  const closeRate = Math.max(state.closeRatePct, 1) / 100;
  const coverageMultiple = 100 / Math.max(state.closeRatePct, 1);
  const pipelineFromMarkets = ALL_MARKET_IDS.reduce(
    (s, id) => s + (state.marketPipeline[id] || 0),
    0
  );
  const currentPipeline = pipelineFromMarkets;
  const pipelineNeeded = state.netNew * coverageMultiple;
  const pipelineGap = Math.max(0, pipelineNeeded - currentPipeline);
  const oppsNeeded =
    state.avgDealSize > 0 ? Math.ceil(state.netNew / state.avgDealSize / closeRate) : 0;

  // SDR capacity (Steve model: mtgs → 50% opp → close)
  const sdrOppsPerYear =
    state.sdrCount *
    state.meetingsPerSdrPerMonth *
    12 *
    (state.meetingToOppPct / 100);
  const sdrArrCapacity = sdrOppsPerYear * state.avgDealSize * closeRate;
  const sdrGap = state.netNew - sdrArrCapacity;

  const markCustom = (prev: PlanState): PlanState =>
    prev.scenario === 'custom' ? prev : { ...prev, scenario: 'custom' };

  const applyScenario = (id: Exclude<ScenarioId, 'custom'>) => {
    const scenario = SCENARIOS.find((s) => s.id === id);
    if (!scenario) return;
    setState((prev) => {
      const next: PlanState = {
        ...prev,
        ...scenario.patch,
        scenario: id,
      };
      const target = next.netNew + next.expansion;
      next.reps = buildReps(next.includeOpenHire, target);
      next.marketPipeline = distributePipeline(
        next.currentPipeline,
        Object.fromEntries(ALL_MARKET_IDS.map((mid) => [mid, 1]))
      );
      return next;
    });
  };

  const toggleOpenHire = () => {
    setState((prev) => {
      const includeOpenHire = !prev.includeOpenHire;
      const target = prev.netNew + prev.expansion;
      return markCustom({
        ...prev,
        includeOpenHire,
        reps: buildReps(includeOpenHire, target),
      });
    });
  };

  const setArrType = (key: 'netNew' | 'expansion' | 'renewal', value: number) => {
    setState((prev) => {
      const next = markCustom({ ...prev, [key]: value });
      if (key === 'renewal') return next;

      const target = next.netNew + next.expansion;
      return {
        ...next,
        reps: buildReps(next.includeOpenHire, target),
      };
    });
  };

  const setRepQuota = (id: string, quota: number) => {
    setState((prev) => {
      const reps = prev.reps.map((r) => (r.id === id ? { ...r, quota } : r));
      const active = reps.filter((r) => prev.includeOpenHire || !r.isOpen);
      const total = active.reduce((s, r) => s + r.quota, 0);
      const ratio =
        prev.netNew + prev.expansion > 0
          ? prev.netNew / (prev.netNew + prev.expansion)
          : 0.75;
      return markCustom({
        ...prev,
        reps,
        netNew: Math.round(total * ratio),
        expansion: Math.round(total * (1 - ratio)),
      });
    });
  };

  const equalizeReps = () => {
    setState((prev) =>
      markCustom({
        ...prev,
        reps: buildReps(prev.includeOpenHire, prev.netNew + prev.expansion),
      })
    );
  };

  const setMarketPipeline = (id: string, value: number) => {
    setState((prev) => {
      const marketPipeline = { ...prev.marketPipeline, [id]: Math.max(0, value) };
      const sum = ALL_MARKET_IDS.reduce((s, mid) => s + (marketPipeline[mid] || 0), 0);
      return markCustom({
        ...prev,
        marketPipeline,
        currentPipeline: sum,
      });
    });
  };

  const redistributePipelineByArr = () => {
    setState((prev) => {
      const weights = Object.fromEntries(allMarketRows.map((m) => [m.id, m.arr || 1]));
      const marketPipeline = distributePipeline(pipelineNeeded, weights);
      const sum = ALL_MARKET_IDS.reduce((s, id) => s + (marketPipeline[id] || 0), 0);
      return markCustom({ ...prev, marketPipeline, currentPipeline: sum });
    });
  };

  const resetDefaults = () => {
    setState(DEFAULT_STATE);
    localStorage.removeItem(STORAGE_KEY);
  };

  const assumptions = useMemo(
    () => [
      '£1.8m net-new / new-logo ARR target (base)',
      '£600k expansion from existing customers (historical)',
      `${activeReps.length} AE seats × ~£600k new+expansion`,
      `Opp→close ${state.closeRatePct}% ≈ ${coverageMultiple.toFixed(1)}:1 coverage`,
      `SDR: ${state.sdrCount} × ${state.meetingsPerSdrPerMonth} mtgs/mo → ${state.meetingToOppPct}% opp`,
      `Qualified pipeline (manual by beachhead) ~${formatCompact(currentPipeline)}`,
    ],
    [
      activeReps.length,
      state.closeRatePct,
      coverageMultiple,
      state.sdrCount,
      state.meetingsPerSdrPerMonth,
      state.meetingToOppPct,
      currentPipeline,
    ]
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

        {/* Scenarios + hire gate */}
        <div className="flex flex-col lg:flex-row gap-3 mb-6">
          <div className="flex-1 flex flex-wrap gap-2">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => applyScenario(s.id)}
                className={`px-4 py-2.5 rounded-xl border text-left transition-colors min-w-[140px] ${
                  state.scenario === s.id
                    ? 'bg-accent/15 border-accent text-foreground'
                    : 'bg-surface border-border text-muted hover:text-foreground'
                }`}
              >
                <div className="text-sm font-semibold">{s.label}</div>
                <div className="text-[11px] opacity-80">{s.blurb}</div>
              </button>
            ))}
            {state.scenario === 'custom' ? (
              <div className="px-4 py-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-300 min-w-[140px]">
                <div className="text-sm font-semibold">Custom</div>
                <div className="text-[11px]">Sliders adjusted</div>
              </div>
            ) : null}
          </div>
          <button
            type="button"
            onClick={toggleOpenHire}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-colors self-start ${
              state.includeOpenHire
                ? 'bg-accent/15 border-accent text-foreground'
                : 'bg-surface border-border text-muted'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            {state.includeOpenHire
              ? 'Open hire ON · 4 AEs'
              : 'Open hire OFF · 3 AEs'}
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
                Equalize across {activeReps.length} (
                {formatCompact(Math.round(newPlusExpansion / Math.max(activeReps.length, 1)))}{' '}
                each)
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
              {state.reps.map((rep) => {
                const inactive = rep.isOpen && !state.includeOpenHire;
                return (
                <div
                  key={rep.id}
                  className={`rounded-lg border border-border bg-surface-elevated/50 p-4 space-y-3 ${
                    inactive ? 'opacity-40 pointer-events-none' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={rep.name}
                      onChange={(e) =>
                        setState((prev) =>
                          markCustom({
                            ...prev,
                            reps: prev.reps.map((r) =>
                              r.id === rep.id ? { ...r, name: e.target.value } : r
                            ),
                          })
                        )
                      }
                      className="flex-1 bg-transparent text-sm font-medium text-foreground border-b border-transparent focus:border-accent outline-none"
                    />
                    {rep.isOpen ? (
                      <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">
                        {inactive ? 'Off' : 'Open'}
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
              );
              })}
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
              onChange={(v) =>
                setState((p) => markCustom({ ...p, ukPct: clamp(v, 0, 100) }))
              }
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
              onChange={(v) => setState((p) => markCustom({ ...p, closeRatePct: v }))}
              display={`${state.closeRatePct}% → ${coverageMultiple.toFixed(1)}:1`}
              hint="Steve model: ~20–23% (5:1 coverage)"
            />
            <SliderRow
              label="Avg deal size (ACV)"
              value={state.avgDealSize}
              min={20_000}
              max={100_000}
              step={5_000}
              onChange={(v) => setState((p) => markCustom({ ...p, avgDealSize: v }))}
              display={formatGBP(state.avgDealSize)}
              hint="YTD ~£40–46k · target ~£50k"
            />
            <div className="space-y-3 text-sm pt-1 border-t border-border">
              <div className="flex justify-between gap-2">
                <span className="text-muted">Qualified now (sum of markets)</span>
                <span className="font-medium tabular-nums">{formatGBP(currentPipeline)}</span>
              </div>
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
              Edit qualified £ by beachhead below. SF live sync later.
            </p>
          </section>
        </div>

        {/* SDR capacity */}
        <section className="bg-surface border border-border rounded-xl p-5 mb-6 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent" />
                SDR capacity → net-new
              </h2>
              <p className="text-xs text-muted mt-1">
                Meetings/mo × opp conversion × ACV × close rate vs net-new target (Steve model).
              </p>
            </div>
            <div
              className={`text-sm px-3 py-1.5 rounded-lg border ${
                sdrGap <= 0
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}
            >
              {sdrGap <= 0
                ? `Capacity covers net-new (+${formatCompact(Math.abs(sdrGap))})`
                : `Shortfall ${formatCompact(sdrGap)} vs net-new`}
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <SliderRow
              label="SDR headcount"
              value={state.sdrCount}
              min={1}
              max={8}
              step={1}
              onChange={(v) => setState((p) => markCustom({ ...p, sdrCount: v }))}
              display={`${state.sdrCount}`}
            />
            <SliderRow
              label="Meetings / SDR / month"
              value={state.meetingsPerSdrPerMonth}
              min={3}
              max={15}
              step={1}
              onChange={(v) =>
                setState((p) => markCustom({ ...p, meetingsPerSdrPerMonth: v }))
              }
              display={`${state.meetingsPerSdrPerMonth}`}
              hint="Target 10–12 when stacked"
            />
            <SliderRow
              label="Meeting → opp %"
              value={state.meetingToOppPct}
              min={20}
              max={80}
              step={5}
              onChange={(v) => setState((p) => markCustom({ ...p, meetingToOppPct: v }))}
              display={`${state.meetingToOppPct}%`}
            />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
            <div className="rounded-lg bg-surface-elevated p-3">
              <div className="text-xs text-muted">Opps / year</div>
              <div className="text-lg font-semibold tabular-nums">
                {Math.round(sdrOppsPerYear)}
              </div>
            </div>
            <div className="rounded-lg bg-surface-elevated p-3">
              <div className="text-xs text-muted">ARR capacity</div>
              <div className="text-lg font-semibold tabular-nums">
                {formatCompact(sdrArrCapacity)}
              </div>
            </div>
            <div className="rounded-lg bg-surface-elevated p-3">
              <div className="text-xs text-muted">Net-new target</div>
              <div className="text-lg font-semibold tabular-nums">
                {formatCompact(state.netNew)}
              </div>
            </div>
            <div className="rounded-lg bg-surface-elevated p-3">
              <div className="text-xs text-muted">Coverage of target</div>
              <div className="text-lg font-semibold tabular-nums">
                {state.netNew > 0
                  ? `${Math.round((sdrArrCapacity / state.netNew) * 100)}%`
                  : '—'}
              </div>
            </div>
          </div>
        </section>

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
                setState((p) =>
                  markCustom({
                    ...p,
                    ukMarketPct: setMarketPct(p.ukMarketPct, id, pct),
                  })
                )
              }
              onEqualize={() =>
                setState((p) =>
                  markCustom({
                    ...p,
                    ukMarketPct: equalPcts(UK_MARKETS.map((m) => m.id)),
                  })
                )
              }
            />
            <RegionMarketPanel
              title="US"
              regionArr={usArr}
              regionPct={usPct}
              markets={usMarketRows}
              accentClass="bg-rose-500"
              onPctChange={(id, pct) =>
                setState((p) =>
                  markCustom({
                    ...p,
                    usMarketPct: setMarketPct(p.usMarketPct, id, pct),
                  })
                )
              }
              onEqualize={() =>
                setState((p) =>
                  markCustom({
                    ...p,
                    usMarketPct: equalPcts(US_MARKETS.map((m) => m.id)),
                  })
                )
              }
            />
          </div>
        </section>

        {/* Pipeline by beachhead */}
        <section className="bg-surface border border-border rounded-xl p-5 mb-6 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold text-foreground">Pipeline by beachhead</h2>
              <p className="text-xs text-muted mt-1">
                Manual qualified pipeline today — replace with SF pull later. Needed =
                market share of total ARR × pipeline required for net-new.
              </p>
            </div>
            <button
              type="button"
              onClick={redistributePipelineByArr}
              className="text-xs px-3 py-1.5 rounded-lg bg-surface-elevated border border-border text-muted hover:text-foreground"
            >
              Fill to needed by ARR mix
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="text-left text-muted border-b border-border">
                  <th className="py-2 pr-3 font-medium">Market</th>
                  <th className="py-2 pr-3 font-medium">Beachheads</th>
                  <th className="py-2 pr-3 font-medium">Plan ARR</th>
                  <th className="py-2 pr-3 font-medium">Needed pipe</th>
                  <th className="py-2 pr-3 font-medium">Qualified now</th>
                  <th className="py-2 font-medium text-right">Gap</th>
                </tr>
              </thead>
              <tbody>
                {allMarketRows.map((row) => {
                  const share = totalArr > 0 ? row.arr / totalArr : 0;
                  const needed = pipelineNeeded * share;
                  const have = state.marketPipeline[row.id] || 0;
                  const gap = needed - have;
                  return (
                    <tr key={row.id} className="border-b border-border/60">
                      <td className="py-2.5 pr-3 text-foreground">{row.label}</td>
                      <td className="py-2.5 pr-3 text-muted text-xs">
                        {row.beachheads.length
                          ? row.beachheads.map((b) => b.name).join(', ')
                          : '—'}
                      </td>
                      <td className="py-2.5 pr-3 tabular-nums">{formatCompact(row.arr)}</td>
                      <td className="py-2.5 pr-3 tabular-nums text-muted">
                        {formatCompact(needed)}
                      </td>
                      <td className="py-2.5 pr-3">
                        <input
                          type="number"
                          value={have}
                          step={50_000}
                          min={0}
                          onChange={(e) =>
                            setMarketPipeline(row.id, parseInt(e.target.value) || 0)
                          }
                          className="w-28 px-2 py-1 rounded-md bg-surface-elevated border border-border tabular-nums text-sm"
                        />
                      </td>
                      <td
                        className={`py-2.5 tabular-nums text-right font-medium ${
                          gap > 0 ? 'text-amber-400' : 'text-emerald-400'
                        }`}
                      >
                        {gap > 0 ? formatCompact(gap) : `+${formatCompact(Math.abs(gap))}`}
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <td colSpan={3} className="py-3 text-muted">
                    Total
                  </td>
                  <td className="py-3 tabular-nums text-muted">
                    {formatCompact(pipelineNeeded)}
                  </td>
                  <td className="py-3 tabular-nums font-semibold">
                    {formatCompact(currentPipeline)}
                  </td>
                  <td
                    className={`py-3 tabular-nums font-bold text-right ${
                      pipelineGap > 0 ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  >
                    {formatCompact(pipelineGap)}
                  </td>
                </tr>
              </tbody>
            </table>
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
