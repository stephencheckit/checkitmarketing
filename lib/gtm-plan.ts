// The shared GTM plan: the planner's settings plus outreach settings per
// target list. Stored once in the database (lib/gtm-plan-db.ts) so the
// planner, the GTM map and the outreach page all read the same plan; only
// admins can save it.

import { SEGMENT_ORDER, TARGET_LISTS, type TargetList } from './gtm-targets';

export interface OutreachSettings {
  /** SDR working the list. */
  owner: string;
  /** Who takes the meetings; empty means nobody. */
  closer: string;
  /** Accounts prospected per week. */
  perWeek: number;
  /** ISO date (Monday) outreach starts. */
  startDate: string;
  /** Segment priority, first worked first. Missing segments go last. */
  order: string[];
  /** Why this order, shown on the outreach page. */
  orderNote: string;
}

export interface SharedPlan {
  /** The GTM planner's own state, stored as the planner saves it. */
  planner: Record<string, unknown> | null;
  outreach: Record<string, OutreachSettings>;
  updatedBy: string | null;
  updatedAt: string | null;
}

function nextMonday(from = new Date()) {
  const d = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()));
  d.setUTCDate(d.getUTCDate() + (((8 - d.getUTCDay()) % 7) || 7));
  return d.toISOString().slice(0, 10);
}

// Starting point until an admin saves the plan. Bryan's 10 a week is the
// stated assumption; Jordan's lower pace reflects his account-management time;
// Tom's 10 is split across his two UK lists.
const DEFAULTS: Record<string, Omit<OutreachSettings, 'startDate' | 'order'>> = {
  '6ad8d5d602c70b00189187c0': {
    owner: 'Bryan',
    closer: 'Jen',
    perWeek: 10,
    orderNote: 'Plasma, blood and labs first, closest to existing medical wins (Grifols, Octapharma, BioIVT); clinics last.',
  },
  '6ad8b9470082ae0010a432d2': {
    owner: 'Jordan',
    closer: '',
    perWeek: 5,
    orderNote: 'Contract caterers first (largest estates), then venues and senior living, where OVG and Morningstar are proof points.',
  },
  '6ada12d70709160020f98f7a': {
    owner: 'Tom',
    closer: 'Meg',
    perWeek: 6,
    orderNote: 'Acute trusts and health boards first, where pharmacy and pathology tenders originate; time outreach to Contracts Advance alerts.',
  },
  '6ad8b9ff8ff1d7001477f102': {
    owner: 'Tom',
    closer: 'April',
    perWeek: 4,
    orderNote: 'Caterers and FM firms first, where Tom’s FM sequences already have replies.',
  },
};

export function defaultOutreach(list: TargetList): OutreachSettings {
  const base = DEFAULTS[list.id] ?? { owner: '', closer: '', perWeek: 5, orderNote: '' };
  const order =
    list.segmenter === 'food-service' && list.region === 'UK'
      ? ['Contract catering & food service', 'Facilities services', 'Venues, stadiums & live events', 'Leisure, attractions & hospitality', 'Senior living & care']
      : SEGMENT_ORDER[list.segmenter];
  return { ...base, startDate: nextMonday(), order };
}

/** Saved outreach settings merged over defaults, so a new target list still gets a plan. */
export function resolveOutreach(saved: Record<string, Partial<OutreachSettings>> | null | undefined) {
  return Object.fromEntries(
    TARGET_LISTS.map((l) => [l.id, { ...defaultOutreach(l), ...(saved?.[l.id] ?? {}) }])
  ) as Record<string, OutreachSettings>;
}

// ---------------------------------------------------------------------------
// Coverage: how a list's segments are sequenced at its weekly pace.

export const PLAN_WEEKS = 52;

export interface SegmentCount {
  segment: string;
  accounts: number;
  enterprise: number;
  examples: string[];
}

export interface CoveragePlan {
  list: TargetList;
  settings: OutreachSettings;
  accounts: number;
  weeksToCover: number;
  coveredIn12m: number;
  segments: (SegmentCount & { startWeek: number; endWeek: number })[];
}

export function buildCoverage(list: TargetList, settings: OutreachSettings, counts: SegmentCount[]): CoveragePlan {
  const rank = (s: string) => {
    const i = settings.order.indexOf(s);
    return i < 0 ? 99 : i;
  };
  const pace = Math.max(1, settings.perWeek);
  let done = 0;
  const segments = counts
    .filter((c) => c.accounts > 0)
    .sort((a, b) => rank(a.segment) - rank(b.segment))
    .map((c) => {
      const startWeek = Math.floor(done / pace);
      done += c.accounts;
      return { ...c, startWeek, endWeek: Math.ceil(done / pace) };
    });
  return {
    list,
    settings,
    accounts: done,
    weeksToCover: Math.ceil(done / pace),
    coveredIn12m: Math.min(done, pace * PLAN_WEEKS),
    segments,
  };
}

export function weekStart(startDate: string, week: number) {
  const d = new Date(`${startDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + week * 7);
  return d;
}

export function formatWeek(startDate: string, week: number) {
  return weekStart(startDate, week).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit', timeZone: 'UTC' });
}
