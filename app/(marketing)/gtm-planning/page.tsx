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
  Plus,
  Trash2,
} from 'lucide-react';

const STORAGE_KEY = 'checkit-gtm-planning-v5';

type ScenarioId = 'base' | 'upside' | 'conservative' | 'custom';
type Category = 'medical' | 'commercial';
type Region = 'uk' | 'us';

type Rep = {
  id: string;
  name: string;
  quota: number;
  isOpen: boolean;
};

type Beachhead = { name: string; logo?: string };

type Market = {
  id: string;
  label: string;
  detail?: string;
  category: Category;
  region: Region;
  beachheads: Beachhead[];
  focusPct: number; // within category; category markets sum to 100
};

type PlanState = {
  scenario: ScenarioId;
  includeOpenHire: boolean;
  netNew: number;
  expansion: number;
  renewal: number;
  medicalPct: number;
  closeRatePct: number;
  avgDealSize: number;
  currentPipeline: number;
  marketPipeline: Record<string, number>;
  markets: Market[];
  sdrCount: number;
  meetingsPerSdrPerMonth: number;
  meetingToOppPct: number;
  reps: Rep[];
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function equalFocus(markets: Market[], category: Category): Market[] {
  const inCat = markets.filter((m) => m.category === category);
  if (inCat.length === 0) return markets;
  const each = Math.floor(100 / inCat.length);
  let used = 0;
  const focusById: Record<string, number> = {};
  inCat.forEach((m, i) => {
    focusById[m.id] = i === inCat.length - 1 ? 100 - used : each;
    if (i < inCat.length - 1) used += each;
  });
  return markets.map((m) =>
    m.category === category ? { ...m, focusPct: focusById[m.id] ?? 0 } : m
  );
}

/** Adjust one market's focus; rescale others in the same category to sum 100. */
function setFocusPct(markets: Market[], id: string, nextVal: number): Market[] {
  const target = markets.find((m) => m.id === id);
  if (!target) return markets;
  const clamped = clamp(nextVal, 0, 100);
  const siblings = markets.filter((m) => m.category === target.category && m.id !== id);
  const remaining = 100 - clamped;
  const siblingSum = siblings.reduce((s, m) => s + m.focusPct, 0) || siblings.length || 1;
  let allocated = 0;
  const nextFocus: Record<string, number> = { [id]: clamped };
  siblings.forEach((m, i) => {
    if (i === siblings.length - 1) {
      nextFocus[m.id] = Math.max(0, remaining - allocated);
    } else {
      const v = Math.round(remaining * (m.focusPct / siblingSum));
      nextFocus[m.id] = v;
      allocated += v;
    }
  });
  return markets.map((m) =>
    nextFocus[m.id] !== undefined ? { ...m, focusPct: nextFocus[m.id] } : m
  );
}

function distributePipeline(
  total: number,
  markets: Market[],
  weights: Record<string, number>
): Record<string, number> {
  const ids = markets.map((m) => m.id);
  if (ids.length === 0) return {};
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

function seedMarkets(): Market[] {
  const medical: Omit<Market, 'focusPct'>[] = [
    {
      id: 'uk-healthcare',
      label: 'Healthcare / hospitals',
      detail: 'Pharmacies, pathologies',
      category: 'medical',
      region: 'uk',
      beachheads: [{ name: 'NHS', logo: '/logos/nhs.svg' }],
    },
    {
      id: 'us-plasma',
      label: 'Plasma',
      category: 'medical',
      region: 'us',
      beachheads: [
        { name: 'Grifols', logo: '/logos/grifols.svg' },
        { name: 'Octapharma', logo: '/logos/octapharma.svg' },
      ],
    },
  ];
  const commercial: Omit<Market, 'focusPct'>[] = [
    {
      id: 'uk-forecourts',
      label: 'Forecourts',
      category: 'commercial',
      region: 'uk',
      beachheads: [{ name: 'BP', logo: '/logos/bp.png' }],
    },
    {
      id: 'uk-entertainment',
      label: 'Entertainment',
      category: 'commercial',
      region: 'uk',
      beachheads: [
        { name: 'P&O Ferries', logo: '/logos/poferries.png' },
        { name: 'Tenpin', logo: '/logos/tenpin.png' },
      ],
    },
    {
      id: 'uk-foodservice',
      label: 'Food service',
      category: 'commercial',
      region: 'uk',
      beachheads: [],
    },
    {
      id: 'us-venues',
      label: 'Food service (venues)',
      category: 'commercial',
      region: 'us',
      beachheads: [{ name: 'OVG' }],
    },
    {
      id: 'us-senior',
      label: 'Food service (senior living)',
      category: 'commercial',
      region: 'us',
      beachheads: [{ name: 'Morningstar' }],
    },
    {
      id: 'us-facilities',
      label: 'Food service (facilities)',
      category: 'commercial',
      region: 'us',
      beachheads: [{ name: 'ISS' }],
    },
  ];
  const withZero = [...medical, ...commercial].map((m) => ({ ...m, focusPct: 0 }));
  return equalFocus(equalFocus(withZero, 'medical'), 'commercial');
}

const DEFAULT_PIPELINE = 1_900_000;
const DEFAULT_MARKETS = seedMarkets();

const DEFAULT_STATE: PlanState = {
  scenario: 'base',
  includeOpenHire: true,
  netNew: 1_800_000,
  expansion: 600_000,
  renewal: 0,
  medicalPct: 50,
  closeRatePct: 20,
  avgDealSize: 50_000,
  currentPipeline: DEFAULT_PIPELINE,
  marketPipeline: distributePipeline(
    DEFAULT_PIPELINE,
    DEFAULT_MARKETS,
    Object.fromEntries(DEFAULT_MARKETS.map((m) => [m.id, 1]))
  ),
  markets: DEFAULT_MARKETS,
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
      medicalPct: 50,
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
      medicalPct: 45,
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
      medicalPct: 55,
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
  if (Math.abs(n) >= 1_000_000)
    return `£${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 1 : 2)}m`;
  if (Math.abs(n) >= 1_000) return `£${Math.round(n / 1_000)}k`;
  return formatGBP(n);
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

const BAR_COLORS = [
  'bg-violet-500',
  'bg-sky-500',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-rose-500',
  'bg-orange-500',
];

function CategoryFocusPanel({
  category,
  categoryArr,
  categoryPct,
  markets,
  onFocusChange,
  onEqualize,
  onRemove,
  onAdd,
}: {
  category: Category;
  categoryArr: number;
  categoryPct: number;
  markets: (Market & { arr: number })[];
  onFocusChange: (id: string, pct: number) => void;
  onEqualize: () => void;
  onRemove: (id: string) => void;
  onAdd: (draft: {
    label: string;
    region: Region;
    detail: string;
    beachheads: string;
  }) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({
    label: '',
    region: 'uk' as Region,
    detail: '',
    beachheads: '',
  });

  const isMedical = category === 'medical';

  return (
    <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${isMedical ? 'bg-violet-500' : 'bg-orange-500'}`}
            />
            {isMedical ? 'Medical' : 'Commercial'} industries
          </h3>
          <p className="text-xs text-muted mt-1">
            {categoryPct}% of total · {formatCompact(categoryArr)} — focus sliders sum to 100%
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onEqualize}
            className="text-xs px-2.5 py-1 rounded-lg bg-surface-elevated border border-border text-muted hover:text-foreground"
          >
            Equalize
          </button>
          <button
            type="button"
            onClick={() => setAdding((v) => !v)}
            className="text-xs px-2.5 py-1 rounded-lg bg-accent/15 border border-accent/40 text-accent inline-flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            Add
          </button>
        </div>
      </div>

      {markets.length > 0 ? (
        <StackBar
          segments={markets.map((m, i) => ({
            label: m.label,
            value: m.arr,
            className: BAR_COLORS[i % BAR_COLORS.length],
          }))}
        />
      ) : (
        <p className="text-sm text-muted">No markets yet — add one to plan focus.</p>
      )}

      {adding ? (
        <div className="rounded-lg border border-accent/30 bg-accent/5 p-3 space-y-2">
          <input
            placeholder="Market name (e.g. Pathology)"
            value={draft.label}
            onChange={(e) => setDraft((d) => ({ ...d, label: e.target.value }))}
            className="w-full px-3 py-2 text-sm rounded-md bg-surface-elevated border border-border"
          />
          <input
            placeholder="Detail (optional)"
            value={draft.detail}
            onChange={(e) => setDraft((d) => ({ ...d, detail: e.target.value }))}
            className="w-full px-3 py-2 text-sm rounded-md bg-surface-elevated border border-border"
          />
          <input
            placeholder="Beachheads, comma-separated"
            value={draft.beachheads}
            onChange={(e) => setDraft((d) => ({ ...d, beachheads: e.target.value }))}
            className="w-full px-3 py-2 text-sm rounded-md bg-surface-elevated border border-border"
          />
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={draft.region}
              onChange={(e) =>
                setDraft((d) => ({ ...d, region: e.target.value as Region }))
              }
              className="px-3 py-2 text-sm rounded-md bg-surface-elevated border border-border"
            >
              <option value="uk">UK / RoW</option>
              <option value="us">US</option>
            </select>
            <button
              type="button"
              disabled={!draft.label.trim()}
              onClick={() => {
                onAdd(draft);
                setDraft({ label: '', region: 'uk', detail: '', beachheads: '' });
                setAdding(false);
              }}
              className="px-3 py-2 text-sm rounded-md bg-accent text-white disabled:opacity-40"
            >
              Save market
            </button>
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="px-3 py-2 text-sm text-muted"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      <div className="space-y-3">
        {markets.map((m) => (
          <div
            key={m.id}
            className="rounded-lg border border-border/70 bg-surface-elevated/40 p-3 space-y-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-sm font-medium text-foreground">{m.label}</div>
                {m.detail ? <div className="text-[11px] text-muted">{m.detail}</div> : null}
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-surface border border-border text-muted">
                    {m.region === 'uk' ? 'UK / RoW' : 'US'}
                  </span>
                  {m.beachheads.length > 0 ? (
                    m.beachheads.map((b) => <BeachheadChip key={b.name} {...b} />)
                  ) : (
                    <span className="text-[11px] text-muted italic">Beachhead TBD</span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRemove(m.id)}
                className="p-1.5 rounded-md text-muted hover:text-red-400 hover:bg-red-500/10"
                title="Remove market"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <SliderRow
              label="Focus"
              value={m.focusPct}
              min={0}
              max={100}
              step={5}
              onChange={(v) => onFocusChange(m.id, v)}
              display={`${m.focusPct}% · ${formatCompact(m.arr)}`}
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
        if (parsed?.reps?.length === 4 && Array.isArray(parsed.markets)) {
          setState({
            ...DEFAULT_STATE,
            ...parsed,
            reps: parsed.reps,
            markets: parsed.markets,
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

  const medicalPct = state.medicalPct;
  const commercialPct = 100 - medicalPct;
  const medicalArr = totalArr * (medicalPct / 100);
  const commercialArr = totalArr * (commercialPct / 100);

  const marketRows = state.markets.map((m) => {
    const catArr = m.category === 'medical' ? medicalArr : commercialArr;
    return { ...m, arr: catArr * (m.focusPct / 100) };
  });
  const medicalMarkets = marketRows.filter((m) => m.category === 'medical');
  const commercialMarkets = marketRows.filter((m) => m.category === 'commercial');

  const ukArr = marketRows
    .filter((m) => m.region === 'uk')
    .reduce((s, m) => s + m.arr, 0);
  const usArr = marketRows
    .filter((m) => m.region === 'us')
    .reduce((s, m) => s + m.arr, 0);
  const ukPct = totalArr > 0 ? Math.round((ukArr / totalArr) * 100) : 0;
  const usPct = 100 - ukPct;

  const closeRate = Math.max(state.closeRatePct, 1) / 100;
  const coverageMultiple = 100 / Math.max(state.closeRatePct, 1);
  const currentPipeline = state.markets.reduce(
    (s, m) => s + (state.marketPipeline[m.id] || 0),
    0
  );
  const pipelineNeeded = state.netNew * coverageMultiple;
  const pipelineGap = Math.max(0, pipelineNeeded - currentPipeline);
  const oppsNeeded =
    state.avgDealSize > 0 ? Math.ceil(state.netNew / state.avgDealSize / closeRate) : 0;

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
      next.reps = buildReps(next.includeOpenHire, next.netNew + next.expansion);
      next.marketPipeline = distributePipeline(
        next.currentPipeline,
        next.markets,
        Object.fromEntries(next.markets.map((m) => [m.id, 1]))
      );
      return next;
    });
  };

  const toggleOpenHire = () => {
    setState((prev) => {
      const includeOpenHire = !prev.includeOpenHire;
      return markCustom({
        ...prev,
        includeOpenHire,
        reps: buildReps(includeOpenHire, prev.netNew + prev.expansion),
      });
    });
  };

  const setArrType = (key: 'netNew' | 'expansion' | 'renewal', value: number) => {
    setState((prev) => {
      const next = markCustom({ ...prev, [key]: value });
      if (key === 'renewal') return next;
      return {
        ...next,
        reps: buildReps(next.includeOpenHire, next.netNew + next.expansion),
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
      const sum = prev.markets.reduce((s, m) => s + (marketPipeline[m.id] || 0), 0);
      return markCustom({ ...prev, marketPipeline, currentPipeline: sum });
    });
  };

  const redistributePipelineByArr = () => {
    setState((prev) => {
      const med = (prev.netNew + prev.expansion + prev.renewal) * (prev.medicalPct / 100);
      const com = (prev.netNew + prev.expansion + prev.renewal) * ((100 - prev.medicalPct) / 100);
      const weights = Object.fromEntries(
        prev.markets.map((m) => [
          m.id,
          (m.category === 'medical' ? med : com) * (m.focusPct / 100) || 1,
        ])
      );
      const needed = prev.netNew * (100 / Math.max(prev.closeRatePct, 1));
      const marketPipeline = distributePipeline(needed, prev.markets, weights);
      const sum = prev.markets.reduce((s, m) => s + (marketPipeline[m.id] || 0), 0);
      return markCustom({ ...prev, marketPipeline, currentPipeline: sum });
    });
  };

  const addMarket = (
    category: Category,
    draft: { label: string; region: Region; detail: string; beachheads: string }
  ) => {
    setState((prev) => {
      const id = `${draft.region}-${category}-${Date.now()}`;
      const beachheads = draft.beachheads
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((name) => ({ name }));
      const markets = equalFocus(
        [
          ...prev.markets,
          {
            id,
            label: draft.label.trim(),
            detail: draft.detail.trim() || undefined,
            category,
            region: draft.region,
            beachheads,
            focusPct: 0,
          },
        ],
        category
      );
      return markCustom({
        ...prev,
        markets,
        marketPipeline: { ...prev.marketPipeline, [id]: 0 },
      });
    });
  };

  const removeMarket = (id: string) => {
    setState((prev) => {
      const target = prev.markets.find((m) => m.id === id);
      if (!target) return prev;
      let markets = prev.markets.filter((m) => m.id !== id);
      markets = equalFocus(markets, target.category);
      const { [id]: _removed, ...restPipe } = prev.marketPipeline;
      const sum = markets.reduce((s, m) => s + (restPipe[m.id] || 0), 0);
      return markCustom({
        ...prev,
        markets,
        marketPipeline: restPipe,
        currentPipeline: sum,
      });
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
      `Medical ${medicalPct}% / Commercial ${commercialPct}%`,
      `Opp→close ${state.closeRatePct}% ≈ ${coverageMultiple.toFixed(1)}:1 coverage`,
      `SDR: ${state.sdrCount} × ${state.meetingsPerSdrPerMonth} mtgs/mo → ${state.meetingToOppPct}% opp`,
    ],
    [
      activeReps.length,
      medicalPct,
      commercialPct,
      state.closeRatePct,
      coverageMultiple,
      state.sdrCount,
      state.meetingsPerSdrPerMonth,
      state.meetingToOppPct,
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
              FY28 ARR scenario — medical vs commercial first, then industry focus, with
              beachhead markets you can add or remove.
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
            {state.includeOpenHire ? 'Open hire ON · 4 AEs' : 'Open hire OFF · 3 AEs'}
          </button>
        </div>

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
          {/* Medical vs commercial — primary driver */}
          <section className="bg-surface border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-accent" />
              <h2 className="font-semibold text-foreground">Medical vs commercial</h2>
            </div>
            <p className="text-xs text-muted">
              Primary split of total ARR. Industry focus below allocates within each side.
            </p>
            <SliderRow
              label="Medical %"
              value={medicalPct}
              min={0}
              max={100}
              step={5}
              onChange={(v) =>
                setState((p) => markCustom({ ...p, medicalPct: clamp(v, 0, 100) }))
              }
              display={`${medicalPct}% · ${formatCompact(medicalArr)}`}
            />
            <div className="text-sm text-muted flex justify-between">
              <span>Commercial {commercialPct}%</span>
              <span className="tabular-nums text-foreground">
                {formatCompact(commercialArr)}
              </span>
            </div>
            <StackBar
              segments={[
                { label: 'Medical', value: medicalArr, className: 'bg-violet-500' },
                { label: 'Commercial', value: commercialArr, className: 'bg-orange-500' },
              ]}
            />
          </section>

          {/* Region — derived from market tags */}
          <section className="bg-surface border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-accent" />
              <h2 className="font-semibold text-foreground">Region (derived)</h2>
            </div>
            <p className="text-xs text-muted">
              From each industry&apos;s UK/US tag — not a separate planning slider.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3">
                <div className="text-xs text-muted">UK / RoW</div>
                <div className="text-lg font-bold tabular-nums">{ukPct}%</div>
                <div className="text-sm tabular-nums">{formatCompact(ukArr)}</div>
              </div>
              <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-3">
                <div className="text-xs text-muted">US</div>
                <div className="text-lg font-bold tabular-nums">{usPct}%</div>
                <div className="text-sm tabular-nums">{formatCompact(usArr)}</div>
              </div>
            </div>
            <StackBar
              segments={[
                { label: 'UK/RoW', value: ukArr, className: 'bg-blue-500' },
                { label: 'US', value: usArr, className: 'bg-rose-500' },
              ]}
            />
          </section>

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
                <span className="text-muted">Qualified now</span>
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
          </section>
        </div>

        {/* Industry focus under medical / commercial */}
        <section className="mb-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <MapPin className="w-5 h-5 text-accent" />
              Industry focus
            </h2>
            <p className="text-sm text-muted mt-1">
              Set focus within medical and commercial. Add or remove markets; UK/US is a tag
              on each market (drives region totals above).
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <CategoryFocusPanel
              category="medical"
              categoryArr={medicalArr}
              categoryPct={medicalPct}
              markets={medicalMarkets}
              onFocusChange={(id, pct) =>
                setState((p) =>
                  markCustom({ ...p, markets: setFocusPct(p.markets, id, pct) })
                )
              }
              onEqualize={() =>
                setState((p) =>
                  markCustom({ ...p, markets: equalFocus(p.markets, 'medical') })
                )
              }
              onRemove={removeMarket}
              onAdd={(draft) => addMarket('medical', draft)}
            />
            <CategoryFocusPanel
              category="commercial"
              categoryArr={commercialArr}
              categoryPct={commercialPct}
              markets={commercialMarkets}
              onFocusChange={(id, pct) =>
                setState((p) =>
                  markCustom({ ...p, markets: setFocusPct(p.markets, id, pct) })
                )
              }
              onEqualize={() =>
                setState((p) =>
                  markCustom({ ...p, markets: equalFocus(p.markets, 'commercial') })
                )
              }
              onRemove={removeMarket}
              onAdd={(draft) => addMarket('commercial', draft)}
            />
          </div>
        </section>

        {/* SDR capacity */}
        <section className="bg-surface border border-border rounded-xl p-5 mb-6 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent" />
                SDR capacity → net-new
              </h2>
              <p className="text-xs text-muted mt-1">
                Meetings/mo × opp conversion × ACV × close rate vs net-new target.
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

        {/* Pipeline by market */}
        <section className="bg-surface border border-border rounded-xl p-5 mb-6 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold text-foreground">Pipeline by market</h2>
              <p className="text-xs text-muted mt-1">
                Manual qualified pipeline — SF sync later. Needed = market ARR share ×
                pipeline required for net-new.
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
                  <th className="py-2 pr-3 font-medium">Category</th>
                  <th className="py-2 pr-3 font-medium">Region</th>
                  <th className="py-2 pr-3 font-medium">Plan ARR</th>
                  <th className="py-2 pr-3 font-medium">Needed</th>
                  <th className="py-2 pr-3 font-medium">Qualified</th>
                  <th className="py-2 font-medium text-right">Gap</th>
                </tr>
              </thead>
              <tbody>
                {marketRows.map((row) => {
                  const share = totalArr > 0 ? row.arr / totalArr : 0;
                  const needed = pipelineNeeded * share;
                  const have = state.marketPipeline[row.id] || 0;
                  const gap = needed - have;
                  return (
                    <tr key={row.id} className="border-b border-border/60">
                      <td className="py-2.5 pr-3 text-foreground">{row.label}</td>
                      <td className="py-2.5 pr-3 text-muted capitalize">{row.category}</td>
                      <td className="py-2.5 pr-3 text-muted">
                        {row.region === 'uk' ? 'UK / RoW' : 'US'}
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
                  <td className="py-3 tabular-nums font-semibold">
                    {formatCompact(totalArr)}
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

        <section className="bg-accent/5 border border-accent/20 rounded-xl p-5">
          <h2 className="font-semibold text-foreground mb-3">Model assumptions</h2>
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
