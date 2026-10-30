'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
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
  CalendarRange,
} from 'lucide-react';
import {
  DEFAULT_STATE,
  FY28_GOALS,
  buildReps,
  computePlan,
  distributePipeline,
  equalFocus,
  installedUkShare,
  normalizePlan,
  scaleQuarterly,
  type Beachhead,
  type Category,
  type Market,
  type PlanState,
  type Quarters,
  type Region,
  type ScenarioId,
} from '@/lib/gtm-plan-math';
import type { OutreachSettings } from '@/lib/gtm-plan';
import OutreachPanel from './OutreachPanel';
import {
  bucketMarketStages,
  marketsById,
  useApolloLists,
  type StageMix,
} from '@/lib/apollo-lists';

// Bumped on every change to the market list. A saved plan stores its own
// `markets` array and restoring it replaces the seed wholesale, so an old key
// would reinstate a market that has since been dropped — v7 drops UK water —
// along with the focus percentage it was holding.
const STORAGE_KEY = 'checkit-gtm-planning-v7';

interface MarketArr {
  marketId: string;
  customers: number;
  arrUsd: number;
}

interface ArrSnapshot {
  status: 'loading' | 'ready' | 'error';
  markets: MarketArr[];
  unattributed: { customers: number; arrUsd: number };
}

/** Active customer ARR per market, used to weight focus by real revenue. */
function useMarketArr(): ArrSnapshot {
  const [snapshot, setSnapshot] = useState<ArrSnapshot>({
    status: 'loading',
    markets: [],
    unattributed: { customers: 0, arrUsd: 0 },
  });

  useEffect(() => {
    let cancelled = false;
    fetch('/api/gtm-planning/market-arr')
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body?.error || `Request failed (${res.status})`);
        return body as Omit<ArrSnapshot, 'status'>;
      })
      .then((body) => {
        if (cancelled) return;
        setSnapshot({
          status: 'ready',
          markets: body.markets ?? [],
          unattributed: body.unattributed ?? { customers: 0, arrUsd: 0 },
        });
      })
      .catch(() => {
        if (!cancelled) {
          setSnapshot({
            status: 'error',
            markets: [],
            unattributed: { customers: 0, arrUsd: 0 },
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return snapshot;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/**
 * Set focus within a category from each market's share of active customer ARR.
 * Markets with no customers land on 0% — they have no installed base to argue
 * from — so the sliders stay available to put a net-new bet back on them.
 * Falls back to an even split if the category has no attributed ARR at all.
 */
function arrWeightedFocus(
  markets: Market[],
  category: Category,
  arrByMarket: Record<string, number>
): Market[] {
  const inCat = markets.filter((m) => m.category === category);
  if (inCat.length === 0) return markets;

  const total = inCat.reduce((s, m) => s + (arrByMarket[m.id] || 0), 0);
  if (total <= 0) return equalFocus(markets, category);

  let used = 0;
  const focusById: Record<string, number> = {};
  inCat.forEach((m, i) => {
    if (i === inCat.length - 1) {
      focusById[m.id] = Math.max(0, 100 - used);
    } else {
      const pct = Math.round(((arrByMarket[m.id] || 0) / total) * 100);
      focusById[m.id] = pct;
      used += pct;
    }
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

const SCENARIOS: {
  id: Exclude<ScenarioId, 'custom'>;
  label: string;
  blurb: string;
  patch: Partial<PlanState>;
}[] = [
  {
    id: 'base',
    label: 'Base',
    blurb: 'FY28 plan · £2.7m',
    patch: {
      ...FY28_GOALS,
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

/** Customer ARR is stored in USD, unlike the plan itself which is in GBP. */
function formatUsdCompact(n: number) {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}m`;
  if (Math.abs(n) >= 1_000) return `$${Math.round(n / 1_000)}k`;
  return `$${Math.round(n)}`;
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
        {segments.map((seg, i) => (
          <div
            key={`${seg.label}-${i}`}
            className={`h-full ${seg.className}`}
            style={{ width: `${(seg.value / total) * 100}%` }}
            title={`${seg.label}: ${formatGBP(seg.value)}`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        {segments.map((seg, i) => (
          <span key={`${seg.label}-${i}`} className="flex items-center gap-1.5">
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
  arrShare,
  canWeightByArr,
  onFocusChange,
  onEqualize,
  onWeightByArr,
  onRemove,
  onAdd,
}: {
  category: Category;
  categoryArr: number;
  categoryPct: number;
  markets: (Market & { arr: number })[];
  /** Each market's share of active customer ARR within this category, 0–100. */
  arrShare: Record<string, number>;
  canWeightByArr: boolean;
  onFocusChange: (id: string, pct: number) => void;
  onEqualize: () => void;
  onWeightByArr: () => void;
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
            onClick={onWeightByArr}
            disabled={!canWeightByArr}
            title={
              canWeightByArr
                ? 'Set focus from each market’s share of active customer ARR'
                : 'Customer ARR unavailable'
            }
            className="text-xs px-2.5 py-1 rounded-lg bg-surface-elevated border border-border text-muted hover:text-foreground disabled:opacity-40"
          >
            Weight by ARR
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
              hint={
                arrShare[m.id] === undefined
                  ? 'No attributed customer ARR'
                  : `${Math.round(arrShare[m.id])}% of today’s ${category} ARR`
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Turns a market's pipeline target into the conversion rate it implies against
 * the accounts Apollo actually holds. A market needing more opportunities than
 * it has prospectable accounts is not a plan, and this is where that shows.
 */
function ApolloCapacityCells({
  mix,
  status,
  pipelineNeeded,
  avgDealSize,
}: {
  mix: StageMix | undefined;
  status: 'off' | 'loading' | 'ready' | 'error';
  pipelineNeeded: number;
  avgDealSize: number;
}) {
  if (status === 'loading') {
    return (
      <>
        <td className="py-2.5 pr-3 text-xs italic text-muted">…</td>
        <td className="py-2.5 pr-3" />
      </>
    );
  }

  if (status === 'error') {
    return (
      <>
        <td className="py-2.5 pr-3 text-xs text-rose-300">n/a</td>
        <td className="py-2.5 pr-3" />
      </>
    );
  }

  if (!mix || mix.accounts === 0) {
    return (
      <>
        <td className="py-2.5 pr-3 text-xs italic text-amber-300" title="No Apollo account list">
          no list
        </td>
        <td className="py-2.5 pr-3" />
      </>
    );
  }

  const oppsNeeded = avgDealSize > 0 ? pipelineNeeded / avgDealSize : 0;
  const required = mix.prospectable > 0 ? oppsNeeded / mix.prospectable : Infinity;

  // Benchmarks are deliberately coarse: outbound account-to-opportunity rates
  // in the low single digits are normal, so anything needing more than ~15% of
  // a list to convert is flagged.
  const tone =
    required <= 0.05
      ? 'text-emerald-400'
      : required <= 0.15
        ? 'text-amber-400'
        : 'text-rose-400';

  return (
    <>
      <td className="py-2.5 pr-3 tabular-nums">
        <span className="text-foreground">{mix.prospectable.toLocaleString()}</span>
        {mix.clients > 0 ? (
          <span
            className="ml-1.5 text-[10px] text-muted"
            title={`${mix.clients} current clients excluded`}
          >
            −{mix.clients}
          </span>
        ) : null}
      </td>
      <td className={`py-2.5 pr-3 tabular-nums font-medium ${tone}`}>
        {Number.isFinite(required)
          ? `${(required * 100).toFixed(required < 0.1 ? 1 : 0)}%`
          : '∞'}
        <span className="ml-1 text-[10px] font-normal text-muted">
          {Math.ceil(oppsNeeded)} opp
        </span>
      </td>
    </>
  );
}

// Sections of the planner, grouped, each with a stable anchor so other
// material can link straight to it (e.g. /gtm-planning#funnel).
const PLANNER_SECTIONS: { group: string; items: { id: string; label: string }[] }[] = [
  {
    group: 'Plan',
    items: [
      { id: 'scenario', label: 'Scenario & targets' },
      { id: 'arr-mix', label: 'ARR mix' },
      { id: 'quarterly', label: 'Quarterly goals' },
      { id: 'retention', label: 'Retention' },
      { id: 'reps', label: 'Rep quotas' },
    ],
  },
  {
    group: 'Shape',
    items: [
      { id: 'medical-commercial', label: 'Market mix' },
      { id: 'region', label: 'By region' },
    ],
  },
  {
    group: 'Pipeline',
    items: [
      { id: 'pipeline-check', label: 'Pipeline' },
      { id: 'funnel', label: 'Funnel' },
    ],
  },
  {
    group: 'Execution',
    items: [
      { id: 'outreach', label: 'Outreach plan' },
      { id: 'assumptions', label: 'Assumptions' },
    ],
  },
];

function PlanSection({
  id,
  icon: Icon,
  title,
  description,
  children,
}: {
  id: string;
  icon: React.ElementType;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-4 mb-10">
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Icon className="w-5 h-5 text-accent" />
          {title}
        </h2>
        {description ? <p className="text-sm text-muted mt-1">{description}</p> : null}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function PlannerContents() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const ids = PLANNER_SECTIONS.flatMap((g) => g.items.map((i) => i.id));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -60% 0px' }
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="sticky top-20 hidden w-48 flex-shrink-0 self-start lg:block" aria-label="Planner sections">
      {PLANNER_SECTIONS.map((g) => (
        <div key={g.group} className="mb-4">
          <div className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">{g.group}</div>
          <ul className="space-y-0.5">
            {g.items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`block rounded-md px-2 py-1 text-sm transition-colors ${
                    active === item.id ? 'bg-accent/15 text-accent' : 'text-muted hover:bg-surface hover:text-foreground'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export default function GtmPlanningPage() {
  const [state, setState] = useState<PlanState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  // Apollo tells us how many accounts actually exist per market, which turns
  // the pipeline target from an assertion into something testable.
  const customerArr = useMarketArr();
  const arrByMarket = useMemo(() => {
    const out: Record<string, number> = {};
    for (const m of customerArr.markets) out[m.marketId] = m.arrUsd;
    return out;
  }, [customerArr.markets]);

  const apollo = useApolloLists(true);
  // Keyed off the deduped market summaries: a market's lists overlap, and
  // summing them inflated `prospectable`, which made the required conversion
  // read easier than it is.
  const apolloByMarket = useMemo(() => {
    const byId = marketsById(apollo.markets);
    const out: Record<string, StageMix> = {};
    for (const [marketId, summary] of Object.entries(byId)) {
      const mix = bucketMarketStages(summary);
      if (mix) out[marketId] = mix;
    }
    return out;
  }, [apollo.markets]);

  // The plan is shared: loaded from the database, saved there by admins only.
  // localStorage is kept as a fallback for when the database can't be reached.
  const [shared, setShared] = useState<{
    canEdit: boolean;
    updatedBy: string | null;
    updatedAt: string | null;
    outreach: Record<string, OutreachSettings>;
  } | null>(null);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [outreachReach, setOutreachReach] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/gtm-outreach')
      .then((r) => (r.ok ? r.json() : null))
      .then((body: { lists?: { coverage: { coveredIn12m: number } }[] } | null) => {
        if (body?.lists) setOutreachReach(body.lists.reduce((sum, l) => sum + l.coverage.coveredIn12m, 0));
      })
      .catch(() => {});
  }, []);
  const lastSaved = useRef<string>('');

  useEffect(() => {
    const restore = (parsed: Partial<PlanState> | null) => {
      const plan = normalizePlan(parsed);
      if (plan) setState(plan);
      return Boolean(plan);
    };
    fetch('/api/gtm-planning/plan')
      .then(async (res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json();
      })
      .then((body) => {
        setShared({ canEdit: body.canEdit, updatedBy: body.updatedBy, updatedAt: body.updatedAt, outreach: body.outreach });
        if (restore(body.planner as Partial<PlanState> | null)) {
          lastSaved.current = JSON.stringify(body.planner);
          return;
        }
        // Nothing shared yet: start from the plan this browser already holds, so
        // the first admin save carries existing work over rather than defaults.
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) restore(JSON.parse(raw) as Partial<PlanState>);
        } catch {
          /* ignore */
        }
      })
      .catch(() => {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) restore(JSON.parse(raw) as Partial<PlanState>);
        } catch {
          /* ignore */
        }
      })
      .finally(() => setHydrated(true));
  }, []);

  const savePlan = async (patch: { planner?: PlanState; outreach?: Record<string, OutreachSettings> }) => {
    setSaveState('saving');
    try {
      const res = await fetch('/api/gtm-planning/plan', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error(String(res.status));
      const body = await res.json();
      setShared((prev) => (prev ? { ...prev, updatedBy: body.updatedBy, updatedAt: body.updatedAt, outreach: body.outreach } : prev));
      setSaveState('saved');
    } catch {
      setSaveState('error');
    }
  };

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (!shared?.canEdit) return;
    const json = JSON.stringify(state);
    if (json === lastSaved.current) return;
    const t = setTimeout(() => {
      lastSaved.current = json;
      void savePlan({ planner: state });
    }, 1200);
    return () => clearTimeout(t);
  }, [state, hydrated, shared?.canEdit]);

  const setOutreach = (next: Record<string, OutreachSettings>) => {
    setShared((prev) => (prev ? { ...prev, outreach: next } : prev));
    if (shared?.canEdit) void savePlan({ outreach: next });
  };

  const installedUkPct = useMemo(() => installedUkShare(arrByMarket), [arrByMarket]);
  const {
    activeReps,
    newPlusExpansion,
    totalArr,
    repDelta,
    repsBalanced,
    medicalPct,
    commercialPct,
    medicalArr,
    commercialArr,
    marketRows,
    ukPct,
    split,
    byRegion,
    coverageMultiple,
    currentPipeline,
    pipelineNeeded,
    pipelineGap,
    oppsNeeded,
    accountsWorked,
    capacityMeetings,
    meetingsPerYear,
    meetingsLimitedBy,
    sdrOppsPerYear,
    winsPerYear,
    sdrArrCapacity,
    sdrGap,
    winsNeeded,
    meetingsNeeded,
    meetingRateNeeded,
    accountsNeeded,
    sdrsNeeded,
    quarterTotals,
    regionGoals,
    quarterlyDelta,
    quartersBalanced,
  } = computePlan(state, { installedUkPct, outreachReach });
  const medicalMarkets = marketRows.filter((m) => m.category === 'medical');
  const commercialMarkets = marketRows.filter((m) => m.category === 'commercial');

  // Each market's share of today's ARR within its own category, so the panel
  // can show plan focus against installed revenue side by side.
  const arrShareByCategory = useMemo(() => {
    const out: Record<string, number> = {};
    for (const category of ['medical', 'commercial'] as Category[]) {
      const inCat = state.markets.filter((m) => m.category === category);
      const total = inCat.reduce((s, m) => s + (arrByMarket[m.id] || 0), 0);
      if (total <= 0) continue;
      for (const m of inCat) {
        if (arrByMarket[m.id] === undefined) continue;
        out[m.id] = (arrByMarket[m.id] / total) * 100;
      }
    }
    return out;
  }, [state.markets, arrByMarket]);

  const markCustom = (prev: PlanState): PlanState =>
    prev.scenario === 'custom' ? prev : { ...prev, scenario: 'custom' };

  const setRegionSplit = (key: 'netNew' | 'expansion' | 'renewal', value: number | null) =>
    setState((p) => markCustom({ ...p, regionSplit: { ...p.regionSplit, [key]: value } }));

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

  const setQuarter = (region: Region, q: number, value: number) => {
    setState((prev) => {
      const row = [...prev.quarterly[region]] as Quarters;
      row[q] = Math.max(0, value);
      return markCustom({ ...prev, quarterly: { ...prev.quarterly, [region]: row } });
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
      `${formatCompact(state.netNew)} net-new / new-logo ARR target`,
      `${formatCompact(state.expansion)} expansion from existing customers`,
      `${activeReps.length} AE seats × ~${formatCompact(newPlusExpansion / Math.max(activeReps.length, 1))} new+expansion`,
      `GRR ${state.grrTargetPct}% · NRR ${state.nrrTargetPct}% · new terminations under ${formatCompact(state.terminationCap)}`,
      `Medical ${medicalPct}% / Commercial ${commercialPct}%`,
      `Opp→close ${state.closeRatePct}% ≈ ${coverageMultiple.toFixed(1)}:1 coverage`,
      `SDR: ${state.sdrCount} × ${state.meetingsPerSdrPerMonth} mtgs/mo → ${state.meetingToOppPct}% opp`,
      `New logos: UK ${Math.round(byRegion[0].logos)} · US ${Math.round(byRegion[1].logos)} (net new UK ${Math.round(split.netNew)}% / US ${100 - Math.round(split.netNew)}%)`,
    ],
    [
      state.netNew,
      state.expansion,
      state.grrTargetPct,
      state.nrrTargetPct,
      state.terminationCap,
      newPlusExpansion,
      activeReps.length,
      medicalPct,
      commercialPct,
      state.closeRatePct,
      coverageMultiple,
      state.sdrCount,
      state.meetingsPerSdrPerMonth,
      state.meetingToOppPct,
      byRegion,
      split.netNew,
    ]
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-8">
          <PlannerContents />
          <div className="min-w-0 flex-1">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <Target className="w-7 h-7 text-accent" />
              GTM Strategy
            </h1>
            <p className="text-sm text-muted mt-1 max-w-2xl">
              FY28 ARR scenario — medical vs commercial first, then industry focus, with
              beachhead markets you can add or remove.
            </p>
            {shared ? (
              <p className={`mt-2 text-xs ${shared.canEdit ? 'text-muted' : 'text-amber-300'}`}>
                {shared.canEdit
                  ? `Shared plan · ${
                      saveState === 'saving'
                        ? 'saving…'
                        : saveState === 'error'
                          ? 'save failed; edit again to retry'
                          : shared.updatedAt
                            ? `saved by ${shared.updatedBy ?? 'admin'}, ${new Date(shared.updatedAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}`
                            : 'not saved yet'
                    }`
                  : `Viewing the shared plan${shared.updatedBy ? ` (last saved by ${shared.updatedBy})` : ''} · your changes aren’t saved`}
              </p>
            ) : null}
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

        <PlanSection id="scenario" icon={Target} title="Scenario & targets" description="Pick a scenario, then fine-tune below. Changes flow to the GTM map and the outreach plan.">
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
        </PlanSection>

        <PlanSection id="arr-mix" icon={SlidersHorizontal} title="ARR mix" description="Net new, expansion and renewal targets for the year.">
          <div className="bg-surface border border-border rounded-xl p-5 space-y-5">
            <SliderRow
              label="Net new (new logo)"
              value={state.netNew}
              min={0}
              max={4_000_000}
              step={50_000}
              onChange={(v) => setArrType('netNew', v)}
              display={formatGBP(state.netNew)}
              hint={`FY28 plan: ${formatGBP(FY28_GOALS.netNew)} new business`}
            />
            <SliderRow
              label="Expansion"
              value={state.expansion}
              min={0}
              max={2_000_000}
              step={25_000}
              onChange={(v) => setArrType('expansion', v)}
              display={formatGBP(state.expansion)}
              hint={`FY28 plan: ${formatGBP(FY28_GOALS.expansion)} from existing customers`}
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
          </div>
        </PlanSection>

        <PlanSection id="quarterly" icon={CalendarRange} title="Quarterly goals" description="ARR goal by quarter and region; the quarters should add up to total ARR.">
          <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
            <div
              className={`flex flex-wrap items-center justify-between gap-2 text-sm rounded-lg px-3 py-2 border ${
                quartersBalanced
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}
            >
              <span className="flex items-center gap-2">
                {quartersBalanced ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                {quartersBalanced
                  ? `Quarters = total ARR (${formatGBP(totalArr)})`
                  : `Quarters are ${formatGBP(Math.abs(quarterlyDelta))} ${quarterlyDelta < 0 ? 'short of' : 'over'} total ARR`}
              </span>
              {!quartersBalanced ? (
                <button
                  type="button"
                  onClick={() => setState((p) => markCustom({ ...p, quarterly: scaleQuarterly(p.quarterly, totalArr) }))}
                  className="text-xs px-2.5 py-1 rounded-lg bg-surface-elevated border border-border text-muted hover:text-foreground"
                >
                  Scale to {formatCompact(totalArr)}
                </button>
              ) : null}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[560px]">
                <thead>
                  <tr className="text-left text-muted border-b border-border">
                    <th className="py-2 pr-3 font-medium">Region</th>
                    {['Q1', 'Q2', 'Q3', 'Q4'].map((q) => (
                      <th key={q} className="py-2 pr-3 font-medium">{q}</th>
                    ))}
                    <th className="py-2 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(['uk', 'us'] as Region[]).map((region) => (
                    <tr key={region} className="border-b border-border/60">
                      <td className="py-2.5 pr-3 text-foreground">{region === 'uk' ? 'UK / RoW' : 'US'}</td>
                      {state.quarterly[region].map((v, q) => (
                        <td key={q} className="py-2.5 pr-3">
                          <input
                            type="number"
                            value={v}
                            step={1_000}
                            min={0}
                            onChange={(e) => setQuarter(region, q, parseInt(e.target.value) || 0)}
                            className="w-28 px-2 py-1 rounded-md bg-surface-elevated border border-border tabular-nums text-sm"
                          />
                        </td>
                      ))}
                      <td className="py-2.5 text-right tabular-nums font-medium">{formatCompact(regionGoals[region])}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="py-3 text-muted">Total</td>
                    {quarterTotals.map((v, q) => (
                      <td key={q} className="py-3 pr-3 tabular-nums font-semibold">{formatCompact(v)}</td>
                    ))}
                    <td className="py-3 text-right tabular-nums font-bold">{formatCompact(regionGoals.uk + regionGoals.us)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </PlanSection>

        <PlanSection id="retention" icon={RotateCcw} title="Retention" description="Retention targets for the installed base.">
          <div className="bg-surface border border-border rounded-xl p-5 grid md:grid-cols-3 gap-5">
            <SliderRow
              label="Gross revenue retention"
              value={state.grrTargetPct}
              min={80}
              max={100}
              step={1}
              onChange={(v) => setState((p) => markCustom({ ...p, grrTargetPct: v }))}
              display={`${state.grrTargetPct}%`}
              hint="Includes notified terminations"
            />
            <SliderRow
              label="Net revenue retention"
              value={state.nrrTargetPct}
              min={90}
              max={130}
              step={1}
              onChange={(v) => setState((p) => markCustom({ ...p, nrrTargetPct: v }))}
              display={`${state.nrrTargetPct}%`}
            />
            <SliderRow
              label="New terminations cap"
              value={state.terminationCap}
              min={0}
              max={1_000_000}
              step={25_000}
              onChange={(v) => setState((p) => markCustom({ ...p, terminationCap: v }))}
              display={formatGBP(state.terminationCap)}
              hint="The GRR target holds only below this"
            />
          </div>
        </PlanSection>

        <PlanSection id="reps" icon={Users} title="Rep quotas" description="New plus expansion quota by AE seat; quotas should add up to the ARR mix.">
          <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-end gap-3">
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
          </div>
        </PlanSection>

        <PlanSection id="medical-commercial" icon={Building2} title="Market mix" description="Split total ARR between medical and commercial, then set focus by industry within each side.">
          <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
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
          </div>

        <div id="industry-focus" className="scroll-mt-4 space-y-4">
          <div>
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <MapPin className="w-5 h-5 text-accent" />
              Industry focus
            </h3>
            <p className="text-sm text-muted mt-1">
              Set focus within medical and commercial. Add or remove markets; UK/US is a tag
              on each market (drives region totals above).
            </p>
            {customerArr.status === 'ready' && customerArr.unattributed.customers > 0 ? (
              <p className="text-xs text-amber-300 mt-1.5">
                {customerArr.unattributed.customers} active customers carrying{' '}
                {formatUsdCompact(customerArr.unattributed.arrUsd)} are not assigned to a
                market, so they are absent from the ARR weighting below.
              </p>
            ) : null}
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <CategoryFocusPanel
              category="medical"
              categoryArr={medicalArr}
              categoryPct={medicalPct}
              markets={medicalMarkets}
              arrShare={arrShareByCategory}
              canWeightByArr={customerArr.status === 'ready'}
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
              onWeightByArr={() =>
                setState((p) =>
                  markCustom({
                    ...p,
                    markets: arrWeightedFocus(p.markets, 'medical', arrByMarket),
                  })
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
              arrShare={arrShareByCategory}
              canWeightByArr={customerArr.status === 'ready'}
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
              onWeightByArr={() =>
                setState((p) =>
                  markCustom({
                    ...p,
                    markets: arrWeightedFocus(p.markets, 'commercial', arrByMarket),
                  })
                )
              }
              onRemove={removeMarket}
              onAdd={(draft) => addMarket('commercial', draft)}
            />
          </div>
        </div>
        </PlanSection>

        <PlanSection id="region" icon={Globe} title="By region" description="UK and US share of net new, expansion and renewal, and the new logos each region needs.">
          <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-end gap-2">
              {state.regionSplit.netNew !== null || state.regionSplit.expansion !== null || state.regionSplit.renewal !== null ? (
                <button
                  type="button"
                  onClick={() => setState((p) => markCustom({ ...p, regionSplit: { netNew: null, expansion: null, renewal: null } }))}
                  className="text-xs text-muted hover:text-foreground"
                >
                  Reset to data
                </button>
              ) : null}
            </div>
            <SliderRow
              label="Net new · UK share"
              value={split.netNew}
              min={0}
              max={100}
              step={5}
              onChange={(v) => setRegionSplit('netNew', v)}
              display={`UK ${Math.round(split.netNew)}% · US ${100 - Math.round(split.netNew)}%`}
              hint={state.regionSplit.netNew === null ? 'From the quarterly goals' : `Set manually · market focus says UK ${ukPct}%`}
            />
            <SliderRow
              label="Expansion · UK share"
              value={split.expansion}
              min={0}
              max={100}
              step={5}
              onChange={(v) => setRegionSplit('expansion', v)}
              display={`UK ${Math.round(split.expansion)}% · US ${100 - Math.round(split.expansion)}%`}
              hint={state.regionSplit.expansion === null ? 'From the quarterly goals' : `Set manually · installed base is UK ${installedUkPct ?? '—'}%`}
            />
            <SliderRow
              label="Renewal · UK share"
              value={split.renewal}
              min={0}
              max={100}
              step={5}
              onChange={(v) => setRegionSplit('renewal', v)}
              display={`UK ${Math.round(split.renewal)}% · US ${100 - Math.round(split.renewal)}%`}
              hint={state.regionSplit.renewal === null ? 'From installed customer ARR' : `Set manually · installed base is UK ${installedUkPct ?? '—'}%`}
            />
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-muted">
                  <th className="py-1 font-medium">Region</th>
                  <th className="py-1 font-medium text-right">Net new</th>
                  <th className="py-1 font-medium text-right">New logos</th>
                  <th className="py-1 font-medium text-right">Expansion</th>
                  <th className="py-1 font-medium text-right">Renewal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {byRegion.map((r) => (
                  <tr key={r.region}>
                    <td className="py-1.5 font-medium text-foreground">{r.region === 'uk' ? 'UK / RoW' : 'US'}</td>
                    <td className="py-1.5 text-right tabular-nums">{formatCompact(r.netNew)}</td>
                    <td className="py-1.5 text-right tabular-nums font-semibold text-foreground">{Math.round(r.logos)}</td>
                    <td className="py-1.5 text-right tabular-nums">{formatCompact(r.expansion)}</td>
                    <td className="py-1.5 text-right tabular-nums">{formatCompact(r.renewal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[11px] text-muted">
              New logos = regional net new ÷ {formatCompact(state.avgDealSize)} average deal size.
            </p>
          </div>
        </PlanSection>

        <PlanSection id="pipeline-check" icon={TrendingUp} title="Pipeline" description="Win rate and deal size set the pipeline needed; enter qualified pipeline by market to see the gap.">
          <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
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
          </div>

        <div id="pipeline-by-market" className="scroll-mt-4 bg-surface border border-border rounded-xl p-5 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-foreground">Pipeline by market</h3>
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
                  <th className="py-2 pr-3 font-medium" title="Apollo accounts excluding current clients and do-not-prospect">
                    Prospectable
                  </th>
                  <th
                    className="py-2 pr-3 font-medium"
                    title="Share of prospectable accounts that must become opportunities to hit the needed pipeline"
                  >
                    Conv. req.
                  </th>
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
                      <ApolloCapacityCells
                        mix={apolloByMarket[row.id]}
                        status={apollo.status}
                        pipelineNeeded={needed}
                        avgDealSize={state.avgDealSize}
                      />
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
                  <td className="py-3 tabular-nums text-muted">
                    {apollo.status === 'ready'
                      ? Object.values(apolloByMarket)
                          .reduce((s, m) => s + m.prospectable, 0)
                          .toLocaleString()
                      : '—'}
                  </td>
                  <td className="py-3" />
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
        </div>
        </PlanSection>

        <PlanSection id="funnel" icon={Zap} title="Funnel · accounts → revenue" description="Accounts worked × meeting rate (capped by SDR capacity) × opp rate × win rate × deal size, against the net-new target.">
        <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
          <div className="flex flex-wrap items-start justify-end gap-3">
            <div
              className={`text-sm px-3 py-1.5 rounded-lg border ${
                sdrGap <= 0
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}
            >
              {sdrGap <= 0
                ? `Funnel covers net-new (+${formatCompact(Math.abs(sdrGap))})`
                : `Shortfall ${formatCompact(sdrGap)} vs net-new`}
            </div>
          </div>

          <div className="text-sm font-medium text-foreground">Ideal funnel to hit the {formatCompact(state.netNew)} target</div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
            {[
              { label: 'Accounts to work', value: Math.ceil(accountsNeeded).toLocaleString(), sub: `${state.accountToMeetingPct}% book a meeting` },
              { label: 'First meetings', value: Math.ceil(meetingsNeeded).toLocaleString(), sub: `${state.meetingToOppPct}% become opportunities` },
              { label: 'Opportunities', value: oppsNeeded.toLocaleString(), sub: `${state.closeRatePct}% are won` },
              { label: 'Wins (new logos)', value: Math.ceil(winsNeeded).toLocaleString(), sub: `at ${formatGBP(state.avgDealSize)} a deal` },
              { label: 'Net-new ARR', value: formatCompact(state.netNew), sub: 'The new-logo target' },
            ].map((stage, i) => (
              <div key={stage.label} className="relative rounded-lg bg-accent/10 border border-accent/30 p-3">
                <div className="text-xs text-muted">{i + 1}. {stage.label}</div>
                <div className="text-xl font-semibold tabular-nums text-foreground">{stage.value}</div>
                <div className="text-[11px] text-muted">{stage.sub}</div>
              </div>
            ))}
          </div>

          <div className="text-sm font-medium text-foreground">Forward from current activity</div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
            {[
              { label: 'Accounts worked', value: Math.round(accountsWorked).toLocaleString(), sub: state.accountsWorked === null ? 'From the outreach plan' : 'Set manually' },
              { label: 'Meetings', value: Math.round(meetingsPerYear).toLocaleString(), sub: `Limited by ${meetingsLimitedBy}` },
              { label: 'Opportunities', value: Math.round(sdrOppsPerYear).toLocaleString(), sub: `${state.meetingToOppPct}% of meetings` },
              { label: 'Wins (new logos)', value: Math.round(winsPerYear).toLocaleString(), sub: `${state.closeRatePct}% of opps` },
              { label: 'Net-new ARR', value: formatCompact(sdrArrCapacity), sub: `${state.netNew > 0 ? Math.round((sdrArrCapacity / state.netNew) * 100) : 0}% of ${formatCompact(state.netNew)} target` },
            ].map((stage, i) => (
              <div key={stage.label} className="relative rounded-lg bg-surface-elevated p-3">
                <div className="text-xs text-muted">{i + 1}. {stage.label}</div>
                <div className="text-xl font-semibold tabular-nums text-foreground">{stage.value}</div>
                <div className="text-[11px] text-muted">{stage.sub}</div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <SliderRow
                label="Accounts worked / year"
                value={Math.round(accountsWorked)}
                min={0}
                max={3000}
                step={25}
                onChange={(v) => setState((p) => markCustom({ ...p, accountsWorked: v }))}
                display={`${Math.round(accountsWorked).toLocaleString()}`}
                hint={outreachReach !== null ? `Outreach plan reaches ${outreachReach.toLocaleString()} in 12 months` : 'Outreach plan not loaded'}
              />
              {state.accountsWorked !== null ? (
                <button
                  type="button"
                  onClick={() => setState((p) => markCustom({ ...p, accountsWorked: null }))}
                  className="mt-1 text-xs text-muted hover:text-foreground"
                >
                  Use outreach plan
                </button>
              ) : null}
            </div>
            <SliderRow
              label="Account → meeting %"
              value={state.accountToMeetingPct}
              min={5}
              max={60}
              step={1}
              onChange={(v) => setState((p) => markCustom({ ...p, accountToMeetingPct: v }))}
              display={`${state.accountToMeetingPct}%`}
              hint="Assumption until SDR meetings are logged; see the SDR baseline"
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
            <SliderRow
              label="Opp → win %"
              value={state.closeRatePct}
              min={5}
              max={40}
              step={1}
              onChange={(v) => setState((p) => markCustom({ ...p, closeRatePct: v }))}
              display={`${state.closeRatePct}%`}
              hint="Same setting as the pipeline check"
            />
            <SliderRow
              label="Avg deal size (ACV)"
              value={state.avgDealSize}
              min={20_000}
              max={100_000}
              step={2_500}
              onChange={(v) => setState((p) => markCustom({ ...p, avgDealSize: v }))}
              display={formatGBP(state.avgDealSize)}
              hint="Same setting as the pipeline check"
            />
            <div className="grid grid-cols-2 gap-3">
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
                label="Meetings / SDR / mo"
                value={state.meetingsPerSdrPerMonth}
                min={3}
                max={15}
                step={1}
                onChange={(v) => setState((p) => markCustom({ ...p, meetingsPerSdrPerMonth: v }))}
                display={`${state.meetingsPerSdrPerMonth}`}
                hint={`Capacity ${Math.round(capacityMeetings)} meetings / yr`}
              />
            </div>
          </div>

          {sdrGap > 0 ? (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-sm text-foreground/90">
              <strong>To hit {formatCompact(state.netNew)}:</strong> {Math.round(winsNeeded)} wins from {Math.round(meetingsNeeded)} meetings a year. Any one of:{' '}
              {meetingRateNeeded !== null ? `a ${Math.round(meetingRateNeeded * 100)}% account → meeting rate, ` : ''}
              {Math.round(accountsNeeded).toLocaleString()} accounts worked at {state.accountToMeetingPct}%, or{' '}
              {Math.ceil(sdrsNeeded)} SDRs at {state.meetingsPerSdrPerMonth} meetings a month
              {meetingsLimitedBy === 'SDR capacity' ? ' (SDR capacity is the binding limit today)' : ''}.
            </div>
          ) : null}
        </div>
        </PlanSection>

        <PlanSection id="outreach" icon={CalendarRange} title="Outreach plan" description="Who prospects each target list, at what pace and in what order.">
        <OutreachPanel outreach={shared?.outreach ?? null} canEdit={Boolean(shared?.canEdit)} onChange={setOutreach} />
        </PlanSection>

        <PlanSection id="assumptions" icon={CheckCircle2} title="Assumptions" description="The assumptions behind this plan.">
        <div className="bg-accent/5 border border-accent/20 rounded-xl p-5">
          <ul className="grid sm:grid-cols-2 gap-2 text-sm text-muted">
            {assumptions.map((a) => (
              <li key={a} className="flex gap-2">
                <span className="text-accent shrink-0">•</span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
        </PlanSection>
        {/* Room below the last section so its contents link can scroll it to the top. */}
        <div className="h-[60vh]" aria-hidden />

          </div>
        </div>
      </div>
    </div>
  );
}
