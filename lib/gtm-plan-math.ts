// The GTM planner's state and the numbers derived from it. Shared by the
// planner page and the exec deck so both show the same plan.

import { GTM_MARKETS } from './gtm-markets';

export type ScenarioId = 'base' | 'upside' | 'conservative' | 'custom';
export type Category = 'medical' | 'commercial';
export type Region = 'uk' | 'us';

export type Rep = {
  id: string;
  name: string;
  quota: number;
  isOpen: boolean;
};

export type Beachhead = { name: string; logo?: string };

export type Market = {
  id: string;
  label: string;
  detail?: string;
  category: Category;
  region: Region;
  beachheads: Beachhead[];
  focusPct: number; // within category; category markets sum to 100
};

export type PlanState = {
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
  /**
   * UK share (%) of each ARR type. null follows the data: net new from the
   * region tags on focused markets, expansion and renewal from where today's
   * customer ARR sits.
   */
  regionSplit: { netNew: number | null; expansion: number | null; renewal: number | null };
  /** Target accounts prospected in a year; null follows the outreach plan's 12-month reach. */
  accountsWorked: number | null;
  /** Share of prospected accounts that take a first meeting. */
  accountToMeetingPct: number;
};

export function equalFocus(markets: Market[], category: Category): Market[] {
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

export function distributePipeline(
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

export function buildReps(includeOpen: boolean, targetNewExp: number): Rep[] {
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

// Markets are defined once in lib/gtm-markets.ts and shared with the GTM map,
// so the two pages cannot drift apart again. `pillar` and `apolloLists` are
// dropped here — the planner only needs the revenue category.
function seedMarkets(): Market[] {
  const withZero: Market[] = GTM_MARKETS.map((m) => ({
    id: m.id,
    label: m.label,
    detail: m.detail,
    category: m.category,
    region: m.region,
    beachheads: m.beachheads,
    focusPct: 0,
  }));
  return equalFocus(equalFocus(withZero, 'medical'), 'commercial');
}

const DEFAULT_PIPELINE = 1_900_000;
const DEFAULT_MARKETS = seedMarkets();

export const DEFAULT_STATE: PlanState = {
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
  regionSplit: { netNew: null, expansion: null, renewal: null },
  accountsWorked: null,
  accountToMeetingPct: 25,
};

/** A saved plan merged over the defaults, or null if it isn't a usable plan. */
export function normalizePlan(parsed: Partial<PlanState> | null | undefined): PlanState | null {
  if (parsed?.reps?.length !== 4 || !Array.isArray(parsed.markets)) return null;
  return {
    ...DEFAULT_STATE,
    ...parsed,
    reps: parsed.reps,
    markets: parsed.markets,
    marketPipeline: { ...DEFAULT_STATE.marketPipeline, ...parsed.marketPipeline },
    regionSplit: { ...DEFAULT_STATE.regionSplit, ...parsed.regionSplit },
  };
}

/** Where today's customer ARR sits (UK %), the default region split for expansion and renewal. */
export function installedUkShare(arrByMarket: Record<string, number>): number | null {
  let uk = 0;
  let all = 0;
  for (const m of GTM_MARKETS) {
    const arr = arrByMarket[m.id] || 0;
    all += arr;
    if (m.region === 'uk') uk += arr;
  }
  return all > 0 ? Math.round((uk / all) * 100) : null;
}

export function computePlan(
  state: PlanState,
  inputs: { installedUkPct: number | null; outreachReach: number | null }
) {
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

  const ukArr = marketRows.filter((m) => m.region === 'uk').reduce((s, m) => s + m.arr, 0);
  const ukPct = totalArr > 0 ? Math.round((ukArr / totalArr) * 100) : 0;

  const split = {
    netNew: state.regionSplit.netNew ?? ukPct,
    expansion: state.regionSplit.expansion ?? inputs.installedUkPct ?? ukPct,
    renewal: state.regionSplit.renewal ?? inputs.installedUkPct ?? ukPct,
  };
  const byRegion = (['uk', 'us'] as const).map((region) => {
    const share = (pct: number) => (region === 'uk' ? pct : 100 - pct) / 100;
    const netNew = state.netNew * share(split.netNew);
    return {
      region,
      netNew,
      logos: state.avgDealSize > 0 ? netNew / state.avgDealSize : 0,
      expansion: state.expansion * share(split.expansion),
      renewal: state.renewal * share(split.renewal),
    };
  });

  const closeRate = Math.max(state.closeRatePct, 1) / 100;
  const coverageMultiple = 100 / Math.max(state.closeRatePct, 1);
  const currentPipeline = state.markets.reduce((s, m) => s + (state.marketPipeline[m.id] || 0), 0);
  const pipelineNeeded = state.netNew * coverageMultiple;
  const pipelineGap = Math.max(0, pipelineNeeded - currentPipeline);
  const oppsNeeded =
    state.avgDealSize > 0 ? Math.ceil(state.netNew / state.avgDealSize / closeRate) : 0;

  // End-to-end funnel: accounts worked -> meetings -> opps -> wins -> revenue.
  // Meetings are the lower of demand (accounts x meeting rate) and SDR capacity.
  const accountsWorked = state.accountsWorked ?? inputs.outreachReach ?? 0;
  const meetingRate = state.accountToMeetingPct / 100;
  const meetingToOpp = state.meetingToOppPct / 100;
  const demandMeetings = accountsWorked * meetingRate;
  const capacityMeetings = state.sdrCount * state.meetingsPerSdrPerMonth * 12;
  const meetingsPerYear = Math.min(demandMeetings, capacityMeetings);
  const meetingsLimitedBy: 'accounts' | 'SDR capacity' =
    demandMeetings <= capacityMeetings ? 'accounts' : 'SDR capacity';
  const sdrOppsPerYear = meetingsPerYear * meetingToOpp;
  const winsPerYear = sdrOppsPerYear * closeRate;
  const sdrArrCapacity = winsPerYear * state.avgDealSize;
  const sdrGap = state.netNew - sdrArrCapacity;
  // What closing the gap would take, holding the other rates fixed.
  const winsNeeded = state.avgDealSize > 0 ? state.netNew / state.avgDealSize : 0;
  const meetingsNeeded = winsNeeded / Math.max(closeRate, 0.01) / Math.max(meetingToOpp, 0.01);
  const meetingRateNeeded = accountsWorked > 0 ? meetingsNeeded / accountsWorked : null;
  const accountsNeeded = meetingsNeeded / Math.max(meetingRate, 0.01);
  const sdrsNeeded = meetingsNeeded / Math.max(1, state.meetingsPerSdrPerMonth * 12);

  return {
    activeReps,
    newPlusExpansion,
    totalArr,
    repTotal,
    repDelta,
    repsBalanced,
    medicalPct,
    commercialPct,
    medicalArr,
    commercialArr,
    marketRows,
    ukArr,
    ukPct,
    split,
    byRegion,
    closeRate,
    coverageMultiple,
    currentPipeline,
    pipelineNeeded,
    pipelineGap,
    oppsNeeded,
    accountsWorked,
    meetingRate,
    meetingToOpp,
    demandMeetings,
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
  };
}
